import { IsString, IsBoolean, IsOptional, IsNumber, IsDate } from 'class-validator';
import DtoBuilder from '../interfaces/builder';

/**
 * Data Transfer Object (DTO) for representing a todo item.
 */
class TodoDto {
  /** 
   * The name of the todo item.
   */
  @IsOptional()
  @IsString()
  public name?: string;

  /** 
   * The ID of the user associated with the todo item. 
   */
  @IsOptional()
  @IsNumber()
  public userId?: number;

  /** 
   * The ID of the todo item. 
   */
  @IsOptional()
  @IsNumber()
  public id?: number;

  /** 
   * Indicates whether the todo item is checked or not. 
   */
  @IsOptional()
  @IsBoolean()
  public checked?: boolean;

  /** 
   * The deadline for completing the todo item. 
   */
  @IsOptional()
  @IsDate()
  public deadline?: string;
}


/**
 * Builder class for constructing instances of TodoDto.
 */
class TodoDtoBuilder extends DtoBuilder<TodoDto> {
  /**
   * Constructs a new TodoDtoBuilder instance.
   * @param dto The TodoDto object to build upon, default is a new TodoDto instance.
   */
  constructor(dto: TodoDto = new TodoDto()) {
    super(dto);
  }

  /**
   * Creates a new TodoDto instance.
   */
  private reset = () => {
    this.dto = new TodoDto();
  }

  /**
   * Sets the name of the todo item.
   * @param name The name of the todo item.
   * @returns The TodoDtoBuilder instance.
   */
  public addName = (name: string) => {
    this.dto.name = name;
    return this;
  }

  /**
   * Sets the ID of the user associated with the todo item.
   * @param userId The ID of the user.
   * @returns The TodoDtoBuilder instance.
   */
  public addUserId = (userId: number) => {
    this.dto.userId = userId;
    return this;
  }

  /**
   * Sets the ID of the todo item.
   * @param id The ID of the todo item.
   * @returns The TodoDtoBuilder instance.
   */
  public addId = (id: number) => {
    this.dto.id = id;
    return this;
  }
  
  /**
   * Sets whether the todo item is checked or not.
   * @param checked Indicates whether the todo item is checked.
   * @returns The TodoDtoBuilder instance.
   */
  public addChecked = (checked: boolean) => {
    this.dto.checked = checked;
    return this;
  }

  /**
   * Sets the deadline for completing the todo item.
   * @param deadline The deadline for completing the todo item.
   * @returns The TodoDtoBuilder instance.
   */
  public addDeadline = (deadline: string) => {
    this.dto.deadline = deadline;
    return this;
  }

  /**
   * Builds and returns the constructed TodoDto instance.
   * @returns The constructed TodoDto instance.
   */
  public build = () => {
    const todo = this.dto;
    this.reset();
    return todo;
  }
}

export { TodoDto, TodoDtoBuilder };