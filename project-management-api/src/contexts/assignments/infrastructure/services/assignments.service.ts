import { Inject, Injectable } from '@nestjs/common';
import { ErrorHandlerService } from 'src/contexts/shared/infrastructure/services';
import { AssignmentRepository } from '../repositories/assignment.repository';
import { CUSTOM_MESSAGES } from 'src/contexts/shared/domain/constants';

@Injectable()
export class AssignmentsService {
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;

  constructor(private readonly repository: AssignmentRepository) { }

  async seed() {
    try {
      // TODO: Implement seeding logic here
      // return await this.repository.seed(AssignmentSeed);
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(error, CUSTOM_MESSAGES.onCreateError.description);
    }
  }

  async getAssignmentsByProject(projectId: string, page: number, limit: number) {
    try {
      return await this.repository.findByProjectId(projectId, page, limit);
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(error, CUSTOM_MESSAGES.notFoundBy.description);
    }
  }

  async getAssignmentsByEmployee(employeeId: string, page: number, limit: number) {
    try {
      return await this.repository.findByEmployeeId(employeeId, page, limit);
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(error, CUSTOM_MESSAGES.notFoundBy.description);
    }
  }

  async getAssignmentsByTask(taskId: string, page: number, limit: number) {
    try {
      return await this.repository.findByTaskId(taskId, page, limit);
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(error, CUSTOM_MESSAGES.notFoundBy.description);
    }
  }

  async getAssignmentsBySupervisor(supervisorId: string, page: number, limit: number) {
    try {
      return await this.repository.findBySupervisorId(supervisorId, page, limit);
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(error, CUSTOM_MESSAGES.notFoundBy.description);
    }
  }
}