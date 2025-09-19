import { Inject, Injectable } from '@nestjs/common';
import { ErrorHandlerService } from 'src/contexts/shared/infrastructure/services';
import { ClientRepository } from '../repositories/client.repository';
import { CUSTOM_MESSAGES } from 'src/contexts/shared/domain/constants';

@Injectable()
export class ClientsService {
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;

  constructor(private readonly repository: ClientRepository) { }

  async seed() {
    try {
      // TODO: Implement seeding logic here
      // return await this.repository.seed(ClientSeed);
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(error, CUSTOM_MESSAGES.onCreateError.description);
    }
  }
}
