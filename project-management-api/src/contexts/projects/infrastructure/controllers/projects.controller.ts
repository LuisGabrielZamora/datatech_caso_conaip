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
import { Project } from '../../domain/entities/project.entity';
import { ProjectRepository } from '../repositories/project.repository';
import { ProjectsService } from '../services/projects.service';
import { ProjectResources } from '../../domain/enum';
import { Auth } from 'src/contexts/auth/infrastructure/decorators';
import { Roles } from 'src/contexts/auth/domain/enum';
import { CreateProjectDto } from '../../domain/dto/create-project.dto';
import { UpdateProjectDto } from '../../domain/dto/update-project.dto';
import { RequestPaginatorDto } from 'src/contexts/shared/infrastructure/dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController extends MasterController<Project> {
  private _repository: ProjectRepository;
  constructor(
    _repository: ProjectRepository,
    private readonly service: ProjectsService,
  ) {
    super(
      _repository,
      ProjectResources.FILTER_OR_FIELDS,
      ProjectResources.ENTITY_RELATIONS,
    );
    this._repository = _repository;
  }

  @Post()
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this._repository.createEntity(createProjectDto);
  }

  @Patch(':id')
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update project by ID' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this._repository.updateEntity(id, updateProjectDto);
  }

  @Get('client/:clientId')
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get projects by client ID' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Client not found' })
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
  getProjectsByClient(
    @Param('clientId') clientId: string,
    @Query() { page, limit }: RequestPaginatorDto,
  ) {
    return this.service.getProjectsByClient(clientId, page, limit);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed project data' })
  @ApiResponse({ status: 200, description: 'Project data seeded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  seed() {
    return this.service.seed();
  }
}
