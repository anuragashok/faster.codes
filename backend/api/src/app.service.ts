import { Injectable, Logger } from '@nestjs/common';
import Run from './dto/Run';
import * as fs from 'fs';
import { K8sService } from './k8s.service';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class AppService {
  @InjectPinoLogger(AppService.name)
  private readonly logger: PinoLogger;

  constructor(private readonly k8sService: K8sService) {}
   
  async run(runInfo: Run) {
    Promise.all(
      runInfo.codes.map(async (c) => {
        fs.mkdirSync(`/data/${runInfo.runId}/${c.codeId}`, { recursive: true });
        fs.writeFileSync(`/data/${runInfo.runId}/${c.codeId}/Main.java`,Buffer.from(c.code, 'base64'))
        this.k8sService.startJob(runInfo.runId, c);
      }),
    );
  }
}
