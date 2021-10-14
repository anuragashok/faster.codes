import * as k8s from '@kubernetes/client-node';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { promisify } from 'util';
import * as handlebars from 'handlebars';
import * as stream from 'stream';
import * as request from 'request';

const fsReadFileP = promisify(fs.readFile);
const fsWriteFileP = promisify(fs.writeFile);

import { Injectable, Logger } from '@nestjs/common';
import Run from './dto/Run';
import Code from './dto/Code';
import { CoreV1Api } from '@kubernetes/client-node';

@Injectable()
export class K8sService {
  private kc: k8s.KubeConfig;
  private readonly logger = new Logger(K8sService.name);
  jobSpecTemplate: HandlebarsTemplateDelegate<any>;
  watch: k8s.Watch;
  coreClient: k8s.CoreV1Api;
  objectClient: k8s.KubernetesObjectApi;

  constructor() {
    this.kc = new k8s.KubeConfig();
    this.kc.loadFromFile('/kubeconfig/config');
    this.watch = new k8s.Watch(this.kc);
    this.coreClient = this.kc.makeApiClient(CoreV1Api);
    this.objectClient = k8s.KubernetesObjectApi.makeApiClient(this.kc);

    const source = fs
      .readFileSync(`${__dirname}/config/jobSpec.yaml`)
      .toString();
    this.jobSpecTemplate = handlebars.compile(source);
  }

  async startJob(runId: string, code: Code) {
    this.logger.log(`starting job for run #${runId}`);
    const contents = this.jobSpecTemplate({
      lang: `hello-world`,
      runId: runId,
      codeId: code.codeId,
    });

    const jobName = code.codeId;
    const sharePath = `/data/${runId}/${code.codeId}/`;
    const spec: k8s.KubernetesObject = yaml.load(contents);
    const created = await this.create(spec);
    const result = await this.waitForJob(jobName);
    this.logger.log(`job:${jobName} done waiting for job completion ${result}`);
    await this.getLogs(jobName, await this.getPodName(code.codeId));
    this.delete(spec);
  }
  async getLogs(jobName: string, podName: string) {
    const log = new k8s.Log(this.kc);

    const logStream = new stream.PassThrough();
    logStream.on('data', (chunk) => {
      // use write rather than console.log to prevent double line feed
      process.stdout.write(chunk);
    });
    await log.log('default', podName, jobName, logStream, {
      pretty: true,
      timestamps: false,
    });
  }

  private async create(spec: k8s.KubernetesObject) {
    try {
      return (await this.objectClient.create(spec)).body;
    } catch (e) {
      this.logger.error(
        'error in deleting:' + e.message + ' : ' + JSON.stringify(e.body),
      );
    }
  }
  private async delete(spec: k8s.KubernetesObject) {
    try {
      return this.objectClient.delete(
        spec,
        undefined,
        undefined,
        undefined,
        undefined,
        'Foreground',
      );
    } catch (e) {
      this.logger.error(
        'error in deleting:' + e.message + ' : ' + JSON.stringify(e.body),
      );
    }
  }
  private async getPodName(jobName: string) {
    const podList = await this.coreClient.listNamespacedPod(
      'default',
      'false',
      undefined,
      undefined,
      undefined,
      `job-name=${jobName}`,
    );
    this.logger.log(`pod name ${podList.body.items[0].metadata.name}`);
    return podList.body.items[0].metadata.name;
  }

  private waitForK8sObject(path, query, checkFn, timeout, timeoutMsg) {
    this.logger.debug('waiting for', path);
    let res;
    let timer;
    const result = new Promise((resolve, reject) => {
      this.watch
        .watch(
          path,
          query,
          (type, apiObj, watchObj) => {
            if (checkFn(type, apiObj, watchObj)) {
              if (res) {
                res.abort();
              }
              clearTimeout(timer);
              this.logger.debug('finished waiting for ', path);
              resolve(watchObj.object);
            }
          },
          () => {},
        )
        .then((r) => {
          res = r;
          timer = setTimeout(() => {
            res.abort();
            reject(new Error(timeoutMsg));
          }, timeout);
        });
    });
    return result;
  }
  private waitForJob(name, namespace = 'default', timeout = 90000) {
    return this.waitForK8sObject(
      `/apis/batch/v1/namespaces/${namespace}/jobs`,
      {},
      (_type, _apiObj, watchObj) => {
        this.logger.log(
          watchObj.object.metadata.name +
            ':' +
            (watchObj.object.metadata.name == name) +
            ':' +
            name,
        );
        return (
          watchObj.object.metadata.name == name &&
          watchObj.object.status.conditions &&
          watchObj.object.status.conditions.some(
            (c) =>
              (c.type === 'Complete' || c.type === 'Failed') &&
              c.status === 'True',
          )
        );
      },
      timeout,
      `Waiting for job ${name} timeout (${timeout} ms)`,
    );
  }
}
