import { IsString, IsBoolean, IsOptional, IsNumber, IsDate } from 'class-validator';
import DtoBuilder from '../interfaces/builder';

class TodoDto {
  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @IsNumber()
  public userId?: number;

  @IsOptional()
  @IsNumber()
  public id?: number;

  @IsOptional()
  @IsBoolean()
  public checked?: boolean;

  @IsOptional()
  @IsDate()
  // TODO change deadline data type (maybe Date) 
  public deadline?: string;
}

class TodoDtoBuilder extends DtoBuilder<TodoDto> {
  constructor(dto: TodoDto = new TodoDto()) {
    super(dto);
  }

  private reset = () => {
    this.dto = new TodoDto();
  }

  public addName = (name: string) => {
    this.dto.name = name;
    return this;
  }

  public addUserId = (userId: number) => {
    this.dto.userId = userId;
    return this;
  }

  public addId = (id: number) => {
    this.dto.id = id;
    return this;
  }
  
  public addChecked = (checked: boolean) => {
    this.dto.checked = checked;
    return this;
  }

  // TODO change deadline data type (maybe Date)
  public addDeadline = (deadline: string) => {
    this.dto.deadline = deadline;
    return this;
  }

  public build = () => {
    const todo = this.dto;
    this.reset();
    return todo;
  }
}

export { TodoDto, TodoDtoBuilder };