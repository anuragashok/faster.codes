import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { K8sService } from './k8s.service';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        quietReqLogger: true,
        genReqId: (req) => req.body.runId,
        autoLogging: { ignorePaths: ['/health'] },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, K8sService],
})
export class AppModule {}
