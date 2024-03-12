/**
 * Abstract class representing a builder for DTO (Data Transfer Object) objects.
 * @template T - The type of the DTO object being built.
 */
abstract class DtoBuilder<T> {
  /**
   * Constructs a new instance of the DtoBuilder class.
   * @param dto - The DTO object to be built.
   */
  constructor(protected dto: T) {}

  /**
   * Abstract method that must be implemented by subclasses to build the DTO object.
   * @returns The built DTO object.
   */
  abstract build(): T;
}

export default DtoBuilder;