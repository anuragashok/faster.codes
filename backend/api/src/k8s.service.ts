import * as k8s from '@kubernetes/client-node';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { promisify } from 'util';
import * as handlebars from 'handlebars';

const fsReadFileP = promisify(fs.readFile);
const fsWriteFileP = promisify(fs.writeFile);
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

import { Injectable, Logger } from '@nestjs/common';
import Run from './dto/Run';
import Code from './dto/Code';

@Injectable()
export class K8sService {
  private kc: k8s.KubeConfig;
  private readonly logger = new Logger(K8sService.name);
  jobSpecTemplate: HandlebarsTemplateDelegate<any>;
  watch: k8s.Watch;

  constructor() {
    this.kc = new k8s.KubeConfig();
    this.kc.loadFromFile('/kubeconfig/config');
    this.watch = new k8s.Watch(this.kc);

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
    const specPath = `/data/${runId}/${code.codeId}/spec.yaml`;
    await fsWriteFileP(specPath, contents);
    const created = await this.apply(specPath);
    const result = await this.waitForJob(created[0].metadata.name);
    this.logger.log(`done waiting for job completion ${result}`);
    return this.delete(specPath);
  }

  private async apply(specPath: string) {
    const created: k8s.KubernetesObject[] = [];
    try {
      const client = k8s.KubernetesObjectApi.makeApiClient(this.kc);
      const specString = await fsReadFileP(specPath, 'utf8');
      const specs: k8s.KubernetesObject[] = yaml.loadAll(specString);
      const validSpecs = specs.filter((s) => s && s.kind && s.metadata);
      for (const spec of validSpecs) {
        this.logger.log(spec);
        const response = await client.create(spec);
        created.push(response.body);
      }
    } catch (e) {
      this.logger.error('error' + e.message);
    }

    return created;
  }
  private async delete(specPath: string) {
    const client = k8s.KubernetesObjectApi.makeApiClient(this.kc);
    const specString = await fsReadFileP(specPath, 'utf8');
    const spec: k8s.KubernetesObject = yaml.load(specString);
    return client.delete(
      spec,
      undefined,
      undefined,
      undefined,
      undefined,
      'Foreground',
    );
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
        this.logger.log(watchObj);
        return (
          watchObj.object.metadata.name === name &&
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

  private async pollForJobCompletion() {}
}
