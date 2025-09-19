import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IPaginatorDto } from 'src/contexts/shared/domain/abstractions';
import { PaginatorUtil } from 'src/contexts/shared/application';

import { ProjectResources } from '../../domain/enum';
import { Project } from '../../domain/entities/project.entity';
import { GenericRepository } from 'src/contexts/shared/application';
import { IProject } from '../../domain/abstractions/project.interface';
import { CUSTOM_MESSAGES } from 'src/contexts/shared/domain/constants';
import { ErrorHandlerService } from 'src/contexts/shared/infrastructure/services';

@Injectable()
export class ProjectRepository extends GenericRepository<Project> {
  @Inject(ErrorHandlerService)
  protected readonly errorHandlerService: ErrorHandlerService;

  constructor(
    @InjectRepository(Project)
    _repository: Repository<Project>,
  ) {
    super(_repository, ProjectResources.UNIQUE_CONSTANTS);
  }

  async seed(records: IProject[]) {
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

  /**
   * Find projects by client ID
   * @param clientId - The ID of the client
   * @param page - The page number for pagination (default is 0)
   * @param limit - The number of items per page for pagination (default is 10)
   * @returns A promise that resolves to an array of projects associated with the given client ID
   */
  async findByClientId(clientId: string, page: number = 0, limit: number = 10) {
    try {
      return await this.getEntities(page, limit, {
        where: { clientId },
        relations: ProjectResources.ENTITY_RELATIONS,
      });
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(
        error,
        CUSTOM_MESSAGES.notFoundBy.description,
      );
    }
  }
}
