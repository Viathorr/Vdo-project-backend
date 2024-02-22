import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

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
}

class TodoDtoBuilder {
  private todoDto: TodoDto;

  constructor() {
    this.todoDto = new TodoDto();
  }

  private reset = () => {
    this.todoDto = new TodoDto();
  }

  public addName = (name: string) => {
    this.todoDto.name = name;
  }

  public addUserId = (userId: number) => {
    this.todoDto.userId = userId;
  }

  public addId = (id: number) => {
    this.todoDto.id = id;
  }
  
  public addChecked = (checked: boolean) => {
    this.todoDto.checked = checked;
  }

  public build = () => {
    const todo = this.todoDto;
    this.reset();
    return todo;
  }
}

export { TodoDto, TodoDtoBuilder };