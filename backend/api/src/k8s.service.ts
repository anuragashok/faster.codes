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
import Code from './dto/Code';
import { CoreV1Api } from '@kubernetes/client-node';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class K8sService {
  @InjectPinoLogger(K8sService.name)
  private readonly logger: PinoLogger;
  jobSpecTemplate: HandlebarsTemplateDelegate<any>;

  constructor() {
    const kc = this.loadConfig();

    const source = fs
      .readFileSync(`${__dirname}/config/jobSpec.yaml`)
      .toString();
    this.jobSpecTemplate = handlebars.compile(source);
  }

  private loadConfig() {
    const kc = new k8s.KubeConfig();
    kc.loadFromFile('/kubeconfig/config');
    return kc;
  }
  private getCoreClient() {
    return this.loadConfig().makeApiClient(CoreV1Api);
  }

  private getObjectClient() {
    return k8s.KubernetesObjectApi.makeApiClient(this.loadConfig());
  }

  async startJob(runId: string, code: Code) {
    this.logger.info(`starting job for run #${runId}`);
    const sharePath = `${runId}/${code.codeId}/`;
    const jobName = code.codeId;

    const contents = this.jobSpecTemplate({
      lang: `ghcr.io/anuragashok/faster.codes/runner-${code.lang}:latest`,
      sharePath: sharePath,
      jobName: jobName,
    });

    const spec: k8s.KubernetesObject = yaml.load(contents);
    await this.create(jobName, spec);
    const result = await this.waitForJob(jobName);
    this.logger.info(
      `job:${jobName} done waiting for job completion ${result}`,
    );
    await this.getLogs(jobName, await this.getPodName(code.codeId));
    //this.delete(jobName, spec);
  }

  async getLogs(jobName: string, podName: string) {
    this.log(jobName, 'getting logs for pod ' + podName);
    const log = new k8s.Log(this.loadConfig());

    const logStream = new stream.PassThrough();
    logStream.on('data', (chunk) => {
      // use write rather than console.log to prevent double line feed
      process.stdout.write(chunk);
    });
    await log.log('default', podName, jobName, logStream, {
      pretty: true,
      timestamps: false,
    });
    await new Promise((fulfill) => logStream.on('finish', fulfill));
    console.log('logs read');
  }

  private async create(jobName: string, spec: k8s.KubernetesObject) {
    try {
      this.log(jobName, `creating ${spec}`);
      return (await this.getObjectClient().create(spec)).body;
    } catch (e) {
      this.logger.error(
        jobName +
          'error in creating: ' +
          e.message +
          ' : ' +
          JSON.stringify(e.body),
        ' : ' + JSON.stringify(e.response),
      );
    }
  }
  private async delete(jobName: string, spec: k8s.KubernetesObject) {
    this.log(jobName, `deleting ${spec}`);
    try {
      return this.getObjectClient().delete(
        spec,
        undefined,
        undefined,
        undefined,
        undefined,
        'Foreground',
      );
    } catch (e) {
      this.logger.error(
        jobName +
          'error in deleting:' +
          e.message +
          ' : ' +
          JSON.stringify(e.body),
      );
    }
  }
  private async getPodName(jobName: string) {
    this.log(jobName, `get pod name`);

    const podList = await this.getCoreClient().listNamespacedPod(
      'default',
      'false',
      undefined,
      undefined,
      undefined,
      `job-name=${jobName}`,
    );
    this.log(jobName, `got pod name as ${podList.body.items[0].metadata.name}`);
    return podList.body.items[0].metadata.name;
  }

  private waitForK8sObject(path, query, checkFn, timeout, timeoutMsg) {
    this.logger.debug('waiting for', path);
    let res;
    let timer;
    const result = new Promise((resolve, reject) => {
      new k8s.Watch(this.loadConfig())
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
  private waitForJob(name, namespace = 'default', timeout = 300000) {
    return this.waitForK8sObject(
      `/apis/batch/v1/namespaces/${namespace}/jobs`,
      {},
      (_type, _apiObj, watchObj) => {
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

  private log(context: string, message: string) {
    this.logger.info(`[${context}] ${message}`);
  }
}
