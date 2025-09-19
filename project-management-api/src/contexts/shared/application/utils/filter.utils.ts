import { FindManyOptions, Like } from 'typeorm';

type SearchCondition = {
  [key: string]: any;
};

export class FilterUtil {
  static retrieveOrOptions<T>(
    fields: string[],
    relations: string[] = [],
    search: string = '',
  ): FindManyOptions<T> {
    const conditions: SearchCondition[] = [];

    for (const field of fields) {
      const condition: SearchCondition = {};
      condition[field] = Like(`%${search}%`);
      conditions.push(condition);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return {
      where: conditions,
      relations,
      order: {
        createdAt: 'DESC',
      },
    } as FindManyOptions<T>;
  }
}
