import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';

import { CustomBaseEntity } from '../../infrastructure';
import { PaginatorUtil } from '../utils/paginator.utils';
import { IPaginatorDto } from '../../domain/abstractions';

export abstract class GenericRepository<T extends CustomBaseEntity> {
  @Inject(EventEmitter2)
  private readonly eventEmitter: EventEmitter2;

  protected constructor(
    private readonly repository: Repository<T>,
    private readonly uniqueParams: { uniqueField: string; isActive: boolean },
  ) {}

  getQueryBuilder(alias: string): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias);
  }

  getInstance(): Repository<T> {
    return this.repository;
  }

  get isActive() {
    return this.uniqueParams.isActive;
  }

  options(data: DeepPartial<T>): FindOneOptions<T> {
    const where = {};
    where[this.uniqueParams.uniqueField] = data[this.uniqueParams.uniqueField];
    return { where } as FindOneOptions<T>;
  }

  public idOptions(id: string) {
    return {
      where: { id },
    } as FindOneOptions<T>;
  }

  async getEntities(
    page: number,
    limit: number,
    options: FindManyOptions<T>,
  ): Promise<IPaginatorDto<T>> {
    const [data, count] = await this.repository.findAndCount({
      ...options,
      ...PaginatorUtil.calculateOffset(page, limit),
    });
    return PaginatorUtil.mapper<T>(data, count, page, limit);
  }

  async showEntity(options: FindOneOptions<T>): Promise<T | null> {
    return await this.repository.findOne(options);
  }

  async createEntity(data: DeepPartial<T>): Promise<T> {
    await this.recordIsUnique(data, this.isActive);

    const record = this.repository.create(data);
    return await this.repository.save(record);
  }

  async updateEntity(
    id: string,
    data: DeepPartial<T>,
    beforeUpdatedEvent?: string,
  ): Promise<UpdateResult> {
    const options = this.idOptions(id);
    const { existence, record } = await this.recordExistence(options);
    if (!existence)
      throw new NotFoundException(
        'This record does not exist into the database',
      );

    // Call onUpdated hook after the updated process
    if (beforeUpdatedEvent && beforeUpdatedEvent !== '') {
      this.eventEmitter.emit(beforeUpdatedEvent, record);
    }

    // Update Response into the database
    const updateResponse = await this.repository.update(id, data as any);
    return updateResponse;
  }

  async deleteEntity(id: string): Promise<T> {
    const options = this.idOptions(id);
    const { existence, record } = await this.recordExistence(options);
    if (!existence)
      throw new NotFoundException(
        'This record does not exist into the database',
      );

    return await this.repository.remove(record!);
  }

  private async recordIsUnique(
    data: DeepPartial<T>,
    isUniqueValidationActive = false,
  ) {
    // Check if validation flag is enable and verifies if the record is unique into the database
    if (isUniqueValidationActive) {
      const { existence } = await this.recordExistence(this.options(data));
      if (existence) {
        throw new BadRequestException(
          'This record is duplicated into the database. You cannot recreate it',
        );
      }
    }
  }

  private async recordExistence(
    options: FindOneOptions<T>,
  ): Promise<{ existence: boolean; record: T | null }> {
    const record = await this.showEntity(options);
    if (record) {
      return { existence: true, record };
    }
    return { existence: false, record };
  }
}
