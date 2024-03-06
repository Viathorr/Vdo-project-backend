abstract class DtoBuilder<T> {
  constructor(protected dto: T) {}

  abstract build(): T;
}

export default DtoBuilder;