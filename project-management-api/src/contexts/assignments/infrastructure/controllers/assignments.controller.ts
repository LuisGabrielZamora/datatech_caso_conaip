import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { MasterController } from 'src/contexts/shared/infrastructure';
import { Assignment } from '../../domain/entities/assignment.entity';
import { AssignmentRepository } from '../repositories/assignment.repository';
import { AssignmentsService } from '../services/assignments.service';
import { AssignmentResources } from '../../domain/enum';
import { Auth } from 'src/contexts/auth/infrastructure/decorators';
import { Roles } from 'src/contexts/auth/domain/enum';
import { CreateAssignmentDto } from '../../domain/dto/create-assignment.dto';
import { UpdateAssignmentDto } from '../../domain/dto/update-assignment.dto';
import { RequestPaginatorDto } from 'src/contexts/shared/infrastructure/dto';

@ApiTags('Assignments')
@Controller('assignments')
export class AssignmentsController extends MasterController<Assignment> {
  private _repository: AssignmentRepository;
  constructor(
    _repository: AssignmentRepository,
    private readonly service: AssignmentsService,
  ) {
    super(
      _repository,
      AssignmentResources.FILTER_OR_FIELDS,
      AssignmentResources.ENTITY_RELATIONS,
    );
    this._repository = _repository;
  }

  @Post()
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new assignment' })
  @ApiResponse({ status: 201, description: 'Assignment successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this._repository.createEntity(createAssignmentDto);
  }

  @Patch(':id')
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update assignment by ID' })
  @ApiResponse({ status: 200, description: 'Assignment updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  update(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this._repository.updateEntity(id, updateAssignmentDto);
  }

  @Get('project/:projectId')
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get assignments by project ID' })
  @ApiResponse({
    status: 200,
    description: 'Assignments retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items to return per page',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (0-based)',
    example: 0,
  })
  getAssignmentsByProject(
    @Param('projectId') projectId: string,
    @Query() { page, limit }: RequestPaginatorDto,
  ) {
    return this.service.getAssignmentsByProject(projectId, page, limit);
  }

  @Get('employee/:employeeId')
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get assignments by employee ID' })
  @ApiResponse({
    status: 200,
    description: 'Assignments retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items to return per page',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (0-based)',
    example: 0,
  })
  getAssignmentsByEmployee(
    @Param('employeeId') employeeId: string,
    @Query() { page, limit }: RequestPaginatorDto,
  ) {
    return this.service.getAssignmentsByEmployee(employeeId, page, limit);
  }

  @Get('task/:taskId')
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get assignments by task ID' })
  @ApiResponse({
    status: 200,
    description: 'Assignments retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items to return per page',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (0-based)',
    example: 0,
  })
  getAssignmentsByTask(
    @Param('taskId') taskId: string,
    @Query() { page, limit }: RequestPaginatorDto,
  ) {
    return this.service.getAssignmentsByTask(taskId, page, limit);
  }

  @Get('supervisor/:supervisorId')
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get assignments by supervisor ID' })
  @ApiResponse({
    status: 200,
    description: 'Assignments retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Supervisor not found' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items to return per page',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (0-based)',
    example: 0,
  })
  getAssignmentsBySupervisor(
    @Param('supervisorId') supervisorId: string,
    @Query() { page, limit }: RequestPaginatorDto,
  ) {
    return this.service.getAssignmentsBySupervisor(supervisorId, page, limit);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed assignment data' })
  @ApiResponse({
    status: 200,
    description: 'Assignment data seeded successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  seed() {
    return this.service.seed();
  }
}
