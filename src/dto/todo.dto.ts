import { IsString, IsBoolean } from 'class-validator';

class CreateTodoDto {
  @IsString()
  public name: string;

  @IsBoolean()
  public checked: boolean;
}

export default CreateTodoDto;