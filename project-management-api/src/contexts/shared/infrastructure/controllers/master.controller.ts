import { Delete, Get, Param, Query } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { RequestPaginatorDto } from '../dto';
import { CustomBaseEntity } from '../entities';
import { Roles } from 'src/contexts/auth/domain/enum';
import { FilterUtil, GenericRepository } from '../../application';
import { Auth } from 'src/contexts/auth/infrastructure/decorators';

export abstract class MasterController<T extends CustomBaseEntity> {
  protected constructor(
    private readonly repository: GenericRepository<T>,
    private readonly orFields: string[],
    private readonly relations: string[],
  ) {}

  @Get()
  @Auth(Roles.admin, Roles.user)
  @ApiOperation({ summary: 'Get all entities with pagination' })
  @ApiResponse({ status: 200, description: 'Entities retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term to filter results',
    example: '',
  })
  findAll(@Query() { page, limit, search = '' }: RequestPaginatorDto) {
    return this.repository.getEntities(
      page,
      limit,
      FilterUtil.retrieveOrOptions<T>(this.orFields, this.relations, search),
    );
  }

  @Get(':id')
  @Auth(Roles.admin, Roles.user)
  @ApiOperation({ summary: 'Get entity by ID' })
  @ApiResponse({ status: 200, description: 'Entity retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Entity not found' })
  findOne(@Param('id') id: string) {
    const options = {
      where: { id },
      relations: this.relations,
    } as FindOneOptions;
    return this.repository.showEntity(options);
  }

  @Delete(':id')
  @Auth(Roles.admin, Roles.user)
  @ApiOperation({ summary: 'Delete entity by ID' })
  @ApiResponse({ status: 200, description: 'Entity deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Entity not found' })
  remove(@Param('id') id: string) {
    return this.repository.deleteEntity(id);
  }
}
