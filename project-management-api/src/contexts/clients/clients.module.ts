import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { ClientsController } from './infrastructure/controllers/clients.controller';
import { ClientsService } from './infrastructure/services/clients.service';
import { ClientRepository } from './infrastructure/repositories/client.repository';
import { Client } from './domain/entities/client.entity';
import { ErrorHandlerService } from '../shared/infrastructure/services';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService, ErrorHandlerService, ClientRepository],
  imports: [TypeOrmModule.forFeature([Client]), AuthModule],
  exports: [TypeOrmModule],
})
export class ClientsModule {}
