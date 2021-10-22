import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import Run from './dto/Run';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(AppController.name);

  @Post()
  run(@Body() runInfo: Run) {
    this.logger.log('Received request for run #' + runInfo.runId);
    this.appService.run(runInfo);
  }

  @Get('health')
  health() {
    return '';
  }
}
