import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { EmployeesController } from './infrastructure/controllers/employees.controller';
import { EmployeesService } from './infrastructure/services/employees.service';
import { EmployeeRepository } from './infrastructure/repositories/employee.repository';
import { Employee } from './domain/entities/employee.entity';
import { ErrorHandlerService } from '../shared/infrastructure/services';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService, ErrorHandlerService, EmployeeRepository],
  imports: [TypeOrmModule.forFeature([Employee]), AuthModule],
  exports: [TypeOrmModule],
})
export class EmployeesModule {}
