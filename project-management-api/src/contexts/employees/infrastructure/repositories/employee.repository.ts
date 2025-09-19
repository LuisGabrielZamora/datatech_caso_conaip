import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IPaginatorDto } from 'src/contexts/shared/domain/abstractions';
import { PaginatorUtil } from 'src/contexts/shared/application';

import { EmployeeResources } from '../../domain/enum';
import { Employee } from '../../domain/entities/employee.entity';
import { GenericRepository } from 'src/contexts/shared/application';
import { IEmployee } from '../../domain/abstractions/employee.interface';
import { CUSTOM_MESSAGES } from 'src/contexts/shared/domain/constants';
import { ErrorHandlerService } from 'src/contexts/shared/infrastructure/services';

@Injectable()
export class EmployeeRepository extends GenericRepository<Employee> {
  @Inject(ErrorHandlerService)
  protected readonly errorHandlerService: ErrorHandlerService;

  constructor(
    @InjectRepository(Employee)
    _repository: Repository<Employee>,
  ) {
    super(_repository, EmployeeResources.UNIQUE_CONSTANTS);
  }

  async seed(records: IEmployee[]) {
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
   * Find employees by department with pagination
   * @param department - The department to filter employees by
   * @param page - The page number for pagination (default is 0)
   * @param limit - The number of records per page (default is 10)
   * @returns A paginated list of employees in the specified department
   */
  async findByDepartment(
    department: string,
    page: number = 0,
    limit: number = 10,
  ) {
    try {
      return await this.getEntities(page, limit, {
        where: { department },
        relations: EmployeeResources.ENTITY_RELATIONS,
      });
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(
        error,
        CUSTOM_MESSAGES.notFoundBy.description,
      );
    }
  }
}
