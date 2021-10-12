import { Injectable, Logger } from '@nestjs/common';
import Run from './dto/Run';
import * as fs from 'fs';
import { K8sService } from './k8s.service';

@Injectable()
export class AppService {
  constructor(private readonly k8sService: K8sService) {}
  private readonly logger = new Logger(AppService.name);

  async run(runInfo: Run) {
    await Promise.all(
      runInfo.codes.map(async (c) => {
        fs.mkdirSync(`/data/${runInfo.runId}/${c.codeId}`, { recursive: true });
        await this.k8sService.startJob(runInfo.runId, c);
      }),
    );
  }
}
