import * as k8s from '@kubernetes/client-node';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { promisify } from 'util';
import * as handlebars from 'handlebars';

const fsReadFileP = promisify(fs.readFile);
const fsWriteFileP = promisify(fs.writeFile);

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
    const contents = this.jobSpecTemplate({
      lang: `hello-world`,
      runId: `${runId}/${code.codeId}`,
      codeId: `${code.codeId}`,
    });
    const specPath = `/data/${runId}/${code.codeId}`;
    await fsWriteFileP(specPath, contents);
    await this.apply(specPath);
  }

  private async apply(specPath: string) {
    const client = k8s.KubernetesObjectApi.makeApiClient(this.kc);
    const specString = await fsReadFileP(specPath, 'utf8');
    const specs: k8s.KubernetesObject[] = yaml.loadAll(specString);
    const validSpecs = specs.filter((s) => s && s.kind && s.metadata);
    const created: k8s.KubernetesObject[] = [];
    for (const spec of validSpecs) {
      const response = await client.create(spec);
      created.push(response.body);
    }
    return created;
  }
}
