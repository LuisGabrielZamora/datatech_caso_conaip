import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CUSTOM_MESSAGES } from '../../domain/constants';

@Injectable()
export class ErrorHandlerService {
  handleDatabaseErrors(error: any, errorDescription?: string): never {
    if (error.number === 547)
      throw new BadRequestException(
        CUSTOM_MESSAGES.validForeignKeys.description,
      );

    throw new InternalServerErrorException(
      errorDescription ? errorDescription : CUSTOM_MESSAGES.serverError,
    );
  }

  handleGenericErrors(errorDescription: string): never {
    throw new BadRequestException(errorDescription);
  }
}
