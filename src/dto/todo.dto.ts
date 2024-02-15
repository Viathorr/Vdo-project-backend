import { IsString, IsBoolean, IsEmpty, IsOptional, IsNumber } from 'class-validator';

class CreateTodoDto {
  @IsString()
  public name: string;

  @IsOptional()
  @IsBoolean()
  public checked: boolean | null;

  @IsNumber()
  public user_id: number;
}

export default CreateTodoDto;