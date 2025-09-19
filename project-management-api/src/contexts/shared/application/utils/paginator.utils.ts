import { IPaginatorDto, IPaginatorOffset } from '../../domain/abstractions';

export class PaginatorUtil {
  static calculateOffset(page: number, limit: number): IPaginatorOffset {
    return {
      skip: page * limit,
      take: limit,
    };
  }

  static mapper<T>(
    data: T[],
    count: number,
    page: number,
    limit: number,
  ): IPaginatorDto<T> {
    try {
      const currentPage = page ? +page : 0;
      const totalPages = Math.ceil(count / limit);
      return {
        total: count,
        items: data,
        totalPages,
        currentPage,
      };
    } catch (e) {
      return {
        total: 0,
        items: [],
        totalPages: 0,
        currentPage: 0,
      };
    }
  }
}
