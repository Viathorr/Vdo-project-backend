import { IsNumber, IsEmail, IsString, IsOptional } from 'class-validator';

class UserDto {
  @IsNumber()
  public id: number;

  @IsOptional()
  @IsString()
  public name?: string;
 
  @IsOptional()
  @IsString()
  @IsEmail()
  public email?: string;

  @IsOptional()
  @IsString()
  public country?: string;

  @IsOptional()
  @IsString()
  public phoneNum?: string;

  @IsOptional()
  @IsString()
  public profilePicture?: string;

  @IsOptional()
  @IsString()
  public password?: string;
  
  @IsOptional()
  @IsString()
  public newPassword?: string;
}

export default UserDto;