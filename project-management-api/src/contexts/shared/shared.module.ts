import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import {
  ErrorHandlerService,
  PgConnectionService,
} from './infrastructure/services';

@Module({
  providers: [PgConnectionService, ErrorHandlerService],
  imports: [EventEmitterModule],
})
export class SharedModule {}
