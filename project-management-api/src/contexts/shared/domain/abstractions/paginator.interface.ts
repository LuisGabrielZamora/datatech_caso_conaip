export interface IPaginatorOffset {
  skip: number;
  take: number;
}

export interface IPaginatorDto<T> {
  total: number;
  items: T[];
  totalPages: number;
  currentPage: number;
}

export interface IPaginator {
  limit: number;
  page: number;
  search: string;
}
