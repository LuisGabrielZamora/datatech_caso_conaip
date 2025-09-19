export abstract class GenericModel<T> {
  constructor(parameters: T) {}

  abstract create(parameters: T): T;
  abstract toValue(parameters: Partial<T>): T;
}
