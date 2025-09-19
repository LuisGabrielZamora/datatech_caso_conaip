import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ClientResources } from '../../domain/enum';
import { Client } from '../../domain/entities/client.entity';
import { GenericRepository } from 'src/contexts/shared/application';
import { IClient } from '../../domain/abstractions/client.interface';
import { CUSTOM_MESSAGES } from 'src/contexts/shared/domain/constants';
import { ErrorHandlerService } from 'src/contexts/shared/infrastructure/services';

@Injectable()
export class ClientRepository extends GenericRepository<Client> {
  @Inject(ErrorHandlerService)
  protected readonly errorHandlerService: ErrorHandlerService;

  constructor(
    @InjectRepository(Client)
    _repository: Repository<Client>,
  ) {
    super(_repository, ClientResources.UNIQUE_CONSTANTS);
  }

  async seed(records: IClient[]) {
    try {
      const httpResponses = records.map((seed) => this.createEntity(seed));
      return await Promise.allSettled(httpResponses);
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(
        error,
        CUSTOM_MESSAGES.onCreateError.description,
      );
    }
  }
}
