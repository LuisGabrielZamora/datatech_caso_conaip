import { Inject, Injectable } from '@nestjs/common';
import { ErrorHandlerService } from 'src/contexts/shared/infrastructure/services';
import { ProjectRepository } from '../repositories/project.repository';
import { CUSTOM_MESSAGES } from 'src/contexts/shared/domain/constants';

@Injectable()
export class ProjectsService {
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;

  constructor(private readonly repository: ProjectRepository) {}

  async seed() {
    try {
      // TODO: Implement seeding logic here
      // return await this.repository.seed(ProjectSeed);
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(
        error,
        CUSTOM_MESSAGES.onCreateError.description,
      );
    }
  }

  async getProjectsByClient(clientId: string, page: number, limit: number) {
    try {
      return await this.repository.findByClientId(clientId, page, limit);
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(
        error,
        CUSTOM_MESSAGES.notFoundBy.description,
      );
    }
  }
}
