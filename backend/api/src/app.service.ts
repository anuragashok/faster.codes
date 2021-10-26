import { Injectable, Logger } from '@nestjs/common';
import Run from './dto/Run';
import * as fs from 'fs';
import { K8sService } from './k8s.service';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { promisify } from 'util';

const fsReadFileP = promisify(fs.readFile);

@Injectable()
export class AppService {
  @InjectPinoLogger(AppService.name)
  private readonly logger: PinoLogger;

  constructor(private readonly k8sService: K8sService) {}

  async run(runInfo: Run) {
    Promise.all(
      runInfo.codes.map(async (c) => {
        const dir = `/data/${runInfo.runId}/${c.codeId}`;
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(`${dir}/Main.java`, Buffer.from(c.code, 'base64'));
        await this.k8sService.startJob(runInfo.runId, c);

        let codeRunData = {};
        let buf = await fsReadFileP(`${dir}/stats.json`);
        let stats = JSON.parse(buf.toString());
        Object.assign(Stats);
      }),
    );
  }
}
