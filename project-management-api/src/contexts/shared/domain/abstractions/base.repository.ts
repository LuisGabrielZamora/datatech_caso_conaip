export abstract class AbsBaseRepository<T> {
  abstract findAll(): Promise<T[]>;
  abstract findById(id: string): Promise<T | null>;
  abstract create(entity: T): Promise<void>;
  abstract update(id: string, entity: T): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
