import { Inject, Injectable } from '@nestjs/common';
import { ErrorHandlerService } from 'src/contexts/shared/infrastructure/services';
import { TaskRepository } from '../repositories/task.repository';
import { CUSTOM_MESSAGES } from 'src/contexts/shared/domain/constants';

@Injectable()
export class TasksService {
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;

  constructor(private readonly repository: TaskRepository) { }

  async seed() {
    try {
      // TODO: Implement seeding logic here
      // return await this.repository.seed(TaskSeed);
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(error, CUSTOM_MESSAGES.onCreateError.description);
    }
  }

  async getTasksByProject(projectId: string, page: number, limit: number) {
    try {
      return await this.repository.findByProjectId(projectId, page, limit);
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(error, CUSTOM_MESSAGES.notFoundBy.description);
    }
  }

  async getTasksByAssignee(assigneeEmployeeId: string, page: number, limit: number) {
    try {
      return await this.repository.findByAssigneeId(assigneeEmployeeId, page, limit);
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(error, CUSTOM_MESSAGES.notFoundBy.description);
    }
  }

  async getTasksBySupervisor(supervisorId: string, page: number, limit: number) {
    try {
      return await this.repository.findBySupervisorId(supervisorId, page, limit);
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(error, CUSTOM_MESSAGES.notFoundBy.description);
    }
  }
}