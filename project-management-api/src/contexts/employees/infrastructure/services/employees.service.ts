import { Inject, Injectable } from '@nestjs/common';
import { ErrorHandlerService } from 'src/contexts/shared/infrastructure/services';
import { EmployeeRepository } from '../repositories/employee.repository';
import { CUSTOM_MESSAGES } from 'src/contexts/shared/domain/constants';

@Injectable()
export class EmployeesService {
  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;

  constructor(private readonly repository: EmployeeRepository) {}

  async seed() {
    try {
      // TODO: Implement seeding logic here
      // return await this.repository.seed(EmployeeSeed);
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(
        error,
        CUSTOM_MESSAGES.onCreateError.description,
      );
    }
  }

  async getEmployeesByDepartment(
    department: string,
    page: number,
    limit: number,
  ) {
    try {
      return await this.repository.findByDepartment(department, page, limit);
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(
        error,
        CUSTOM_MESSAGES.notFoundBy.description,
      );
    }
  }
}
