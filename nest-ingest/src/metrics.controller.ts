import { Controller, Get } from '@nestjs/common';
import { register } from 'prom-client';

@Controller()
export class MetricsController {
  @Get('metrics')
  async getMetrics() {
    return register.metrics();
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}