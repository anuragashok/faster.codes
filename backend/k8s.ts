import * as k8s from '@kubernetes/client-node';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { promisify } from 'util';

const kc = new k8s.KubeConfig();
kc.loadFromFile('/kubeconfig/config');
const fsReadFileP = promisify(fs.readFile);

export async function apply(specPath: string): Promise<k8s.KubernetesObject[]> {
  const client = k8s.KubernetesObjectApi.makeApiClient(kc);
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
