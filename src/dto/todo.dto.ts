import { IsString, IsBoolean, IsEmpty, IsOptional, IsNumber } from 'class-validator';

class CreateTodoDto {
  @IsString()
  public name: string;

  @IsNumber()
  public userId: number;
}

// class for update and delete todo data
class UpdateTodoDto {
  @IsNumber()
  public id: number;

  @IsOptional()
  @IsBoolean()
  public checked: boolean;
}

export { CreateTodoDto, UpdateTodoDto };