import { Injectable, Logger } from '@nestjs/common';
import Run from './dto/Run';
import * as fs from 'fs';
import { K8sService } from './k8s.service';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { promisify } from 'util';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

const fsReadFileP = promisify(fs.readFile);

@Injectable()
export class AppService {
  @InjectPinoLogger(AppService.name)
  private readonly logger: PinoLogger;

  constructor(
    private readonly k8sService: K8sService,
    private httpService: HttpService,
  ) {}

  async run(runInfo: Run) {
    runInfo.codes.map(async (c) => {
      const dir = `/data/${runInfo.runId}/${c.codeId}`;
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(`${dir}/Main.java`, Buffer.from(c.code, 'base64'));
      await this.k8sService.startJob(runInfo.runId, c);

      let codeRunData: CodeRunData = { id: c.codeId, stats: {} };

      let buf = await fsReadFileP(`${dir}/stats.json`);
      let stats = JSON.parse(buf.toString());
      Object.assign(codeRunData.stats, stats);

      await lastValueFrom(
        this.httpService.put(
          `https://fastercodes.anurag16890.workers.dev/${runInfo.runId}`,
          codeRunData,
        ),
      );
    });
  }
}

interface CodeRunData {
  id: string;
  stats?: RunStats;
}

interface RunStats {
  duration?: RunValues;
  mem?: RunValues;
  cpu?: RunValues;
}

interface RunValues {
  avg: number;
  values: number[];
}
