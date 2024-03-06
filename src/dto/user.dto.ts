import { IsNumber, IsEmail, IsString, IsOptional, IsPhoneNumber } from 'class-validator';
import DtoBuilder from '../interfaces/builder';

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
  @IsPhoneNumber()
  public phoneNum?: string;

  @IsOptional()
  @IsString()
  public profilePicture?: string;

  @IsOptional()
  @IsString()
  public currPassword?: string;
  
  @IsOptional()
  @IsString()
  public newPassword?: string;
}


class UserDtoBuilder extends DtoBuilder<UserDto> {
  constructor(dto: UserDto = new UserDto()) {
    super(dto);
  }

  private reset = () => {
    this.dto = new UserDto();
  }

  public addId = (id: number) => {
    this.dto.id = id;
    return this;
  }

  public addName = (name: string) => {
    this.dto.name = name;
    return this;
  }

  public addEmail = (email: string) => {
    this.dto.email = email;
    return this;
  }

  public addCountry = (country: string) => {
    this.dto.country = country;
    return this;
  }

  public addProfilePicture = (profilePictureUrl: string) => {
    this.dto.profilePicture = profilePictureUrl;
    return this;
  }

  public addPhoneNum = (phoneNum: string) => {
    this.dto.phoneNum = phoneNum;
    return this;
  }

  public addCurrPassword = (pwd: string) => {
    this.dto.currPassword = pwd;
    return this;
  }

  public addNewPassword = (pwd: string) => {
    this.dto.newPassword = pwd;
    return this;
  }

  public build = () => {
    const user = this.dto;
    this.reset();
    return user;
  }
}

export { UserDto, UserDtoBuilder };