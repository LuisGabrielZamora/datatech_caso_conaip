import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MasterController } from 'src/contexts/shared/infrastructure';
import { Task } from '../../domain/entities/task.entity';
import { TaskRepository } from '../repositories/task.repository';
import { TasksService } from '../services/tasks.service';
import { TaskResources } from '../../domain/enum';
import { Auth } from 'src/contexts/auth/infrastructure/decorators';
import { Roles } from 'src/contexts/auth/domain/enum';
import { CreateTaskDto } from '../../domain/dto/create-task.dto';
import { UpdateTaskDto } from '../../domain/dto/update-task.dto';
import { RequestPaginatorDto } from 'src/contexts/shared/infrastructure/dto';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController extends MasterController<Task> {
  private _repository: TaskRepository;
  constructor(
    _repository: TaskRepository,
    private readonly service: TasksService,
  ) {
    super(_repository, TaskResources.FILTER_OR_FIELDS, TaskResources.ENTITY_RELATIONS);
    this._repository = _repository;
  }

  @Post()
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this._repository.createEntity(createTaskDto);
  }

  @Patch(':id')
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update task by ID' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this._repository.updateEntity(id, updateTaskDto);
  }

  @Get('project/:projectId')
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get tasks by project ID' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  getTasksByProject(
    @Param('projectId') projectId: string,
    @Query() { page, limit }: RequestPaginatorDto
  ) {
    return this.service.getTasksByProject(projectId, page, limit);
  }

  @Get('assignee/:assigneeEmployeeId')
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get tasks by assignee employee ID' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  getTasksByAssignee(
    @Param('assigneeEmployeeId') assigneeEmployeeId: string,
    @Query() { page, limit }: RequestPaginatorDto
  ) {
    return this.service.getTasksByAssignee(assigneeEmployeeId, page, limit);
  }

  @Get('supervisor/:supervisorId')
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get tasks by supervisor ID' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Supervisor not found' })
  getTasksBySupervisor(
    @Param('supervisorId') supervisorId: string,
    @Query() { page, limit }: RequestPaginatorDto
  ) {
    return this.service.getTasksBySupervisor(supervisorId, page, limit);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed task data' })
  @ApiResponse({ status: 200, description: 'Task data seeded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  seed() {
    return this.service.seed();
  }
}