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

  constructor() {
    this.kc = new k8s.KubeConfig();
    this.kc.loadFromFile('/kubeconfig/config');

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
    const client = k8s.KubernetesObjectApi.makeApiClient(this.kc);

    for (var i = 0; i <= 100; i++) {
      await delay(2000)
      const res = await client.read(created[0]);
      this.logger.log(res.body);
    }
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
      this.logger.error(e.body);
    }

    return created;
  }

  private async pollForJobCompletion() {}
}
