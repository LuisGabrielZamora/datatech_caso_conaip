import { Controller, Post, Query, BadRequestException } from '@nestjs/common';
import { IngestService } from './ingest.service';

@Controller('ingest')
export class IngestController {
  constructor(private readonly ingestService: IngestService) {}

  @Post()
  async ingest(
    @Query('db') db: string,
    @Query('rows') rows: string = '100',
    @Query('payloadBytes') payloadBytes: string = '256',
    @Query('concurrency') concurrency: string = '1',
    @Query('method') method: string = 'single',
    @Query('batchSize') batchSize: string = '100',
  ) {
    const validDbs = ['postgres', 'mysql', 'mariadb', 'mssql'];
    const validMethods = ['single', 'batch'];

    if (!validDbs.includes(db)) {
      throw new BadRequestException(`Invalid db. Must be one of: ${validDbs.join(', ')}`);
    }

    if (!validMethods.includes(method)) {
      throw new BadRequestException(`Invalid method. Must be one of: ${validMethods.join(', ')}`);
    }

    const params = {
      db,
      rows: parseInt(rows, 10),
      payloadBytes: parseInt(payloadBytes, 10),
      concurrency: parseInt(concurrency, 10),
      method,
      batchSize: parseInt(batchSize, 10),
    };

    const result = await this.ingestService.performIngestion(params);
    return result;
  }
}