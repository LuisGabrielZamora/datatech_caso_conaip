import { Delete, Get, Param, Query } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';

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
  findAll(@Query() { page, limit, search = '' }: RequestPaginatorDto) {
    return this.repository.getEntities(
      page,
      limit,
      FilterUtil.retrieveOrOptions<T>(this.orFields, this.relations, search),
    );
  }

  @Get(':id')
  @Auth(Roles.admin, Roles.user)
  findOne(@Param('id') id: string) {
    const options = {
      where: { id },
      relations: this.relations,
    } as FindOneOptions;
    return this.repository.showEntity(options);
  }

  @Delete(':id')
  @Auth(Roles.admin, Roles.user)
  remove(@Param('id') id: string) {
    return this.repository.deleteEntity(id);
  }
}
