import { Module } from '@nestjs/common';
import { IngestController } from './ingest.controller';
import { MetricsController } from './metrics.controller';
import { IngestService } from './ingest.service';

@Module({
  imports: [],
  controllers: [IngestController, MetricsController],
  providers: [IngestService],
})
export class AppModule {}