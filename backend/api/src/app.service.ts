import { Injectable, Logger } from '@nestjs/common';
import Run from './dto/Run';
import * as fs from 'fs';
import { K8sService } from './k8s.service';

@Injectable()
export class AppService {
  constructor(private readonly k8sService: K8sService) {}
  private readonly logger = new Logger(AppService.name);

  run(runInfo: Run) {
    runInfo.codes.forEach((c) => {
      fs.mkdirSync(`/data/${runInfo.runId}/${c.codeId}`,{recursive: true});
      this.k8sService.startJob(runInfo.runId, c);
    });
  }
}
