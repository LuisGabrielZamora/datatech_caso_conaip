import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MasterController } from 'src/contexts/shared/infrastructure';
import { Employee } from '../../domain/entities/employee.entity';
import { EmployeeRepository } from '../repositories/employee.repository';
import { EmployeesService } from '../services/employees.service';
import { EmployeeResources } from '../../domain/enum';
import { Auth } from 'src/contexts/auth/infrastructure/decorators';
import { Roles } from 'src/contexts/auth/domain/enum';
import { CreateEmployeeDto } from '../../domain/dto/create-employee.dto';
import { UpdateEmployeeDto } from '../../domain/dto/update-employee.dto';
import { RequestPaginatorDto } from 'src/contexts/shared/infrastructure/dto';

@ApiTags('Employees')
@Controller('employees')
export class EmployeesController extends MasterController<Employee> {
  private _repository: EmployeeRepository;
  constructor(
    _repository: EmployeeRepository,
    private readonly service: EmployeesService,
  ) {
    super(_repository, EmployeeResources.FILTER_OR_FIELDS, EmployeeResources.ENTITY_RELATIONS);
    this._repository = _repository;
  }

  @Post()
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({ status: 201, description: 'Employee successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this._repository.createEntity(createEmployeeDto);
  }

  @Patch(':id')
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update employee by ID' })
  @ApiResponse({ status: 200, description: 'Employee updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this._repository.updateEntity(id, updateEmployeeDto);
  }

  @Get('department/:department')
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get employees by department' })
  @ApiResponse({ status: 200, description: 'Employees retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  getEmployeesByDepartment(
    @Param('department') department: string,
    @Query() { page, limit }: RequestPaginatorDto
  ) {
    return this.service.getEmployeesByDepartment(department, page, limit);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed employee data' })
  @ApiResponse({ status: 200, description: 'Employee data seeded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  seed() {
    return this.service.seed();
  }
}