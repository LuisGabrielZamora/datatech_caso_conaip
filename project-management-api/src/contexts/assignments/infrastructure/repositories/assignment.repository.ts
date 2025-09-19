import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IPaginatorDto } from 'src/contexts/shared/domain/abstractions';
import { PaginatorUtil } from 'src/contexts/shared/application';

import { AssignmentResources } from '../../domain/enum';
import { Assignment } from '../../domain/entities/assignment.entity';
import { GenericRepository } from 'src/contexts/shared/application';
import { IAssignment } from '../../domain/abstractions/assignment.interface';
import { CUSTOM_MESSAGES } from 'src/contexts/shared/domain/constants';
import { ErrorHandlerService } from 'src/contexts/shared/infrastructure/services';

@Injectable()
export class AssignmentRepository extends GenericRepository<Assignment> {
  @Inject(ErrorHandlerService)
  protected readonly errorHandlerService: ErrorHandlerService;

  constructor(
    @InjectRepository(Assignment)
    _repository: Repository<Assignment>,
  ) {
    super(_repository, AssignmentResources.UNIQUE_CONSTANTS);
  }

  async seed(records: IAssignment[]) {
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

  async findByProjectId(
    projectId: string,
    page: number = 0,
    limit: number = 10,
  ) {
    try {
      return await this.getEntities(page, limit, {
        where: { projectId },
        relations: AssignmentResources.ENTITY_RELATIONS,
      });
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(
        error,
        CUSTOM_MESSAGES.notFoundBy.description,
      );
    }
  }

  async findByEmployeeId(
    employeeId: string,
    page: number = 0,
    limit: number = 10,
  ) {
    try {
      return await this.getEntities(page, limit, {
        where: { employeeId },
        relations: AssignmentResources.ENTITY_RELATIONS,
      });
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(
        error,
        CUSTOM_MESSAGES.notFoundBy.description,
      );
    }
  }

  async findByTaskId(taskId: string, page: number = 0, limit: number = 10) {
    try {
      return await this.getEntities(page, limit, {
        where: { taskId },
        relations: AssignmentResources.ENTITY_RELATIONS,
      });
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(
        error,
        CUSTOM_MESSAGES.notFoundBy.description,
      );
    }
  }

  async findBySupervisorId(
    supervisorId: string,
    page: number = 0,
    limit: number = 10,
  ) {
    try {
      return await this.getEntities(page, limit, {
        where: { supervisorId },
        relations: AssignmentResources.ENTITY_RELATIONS,
      });
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(
        error,
        CUSTOM_MESSAGES.notFoundBy.description,
      );
    }
  }
}
