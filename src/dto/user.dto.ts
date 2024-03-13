import { IsNumber, IsEmail, IsString, IsOptional, IsPhoneNumber } from 'class-validator';
import DtoBuilder from '../interfaces/builder';

/**
 * Data Transfer Object (DTO) for representing user information.
 */
class UserDto {
  /**
   *  User's ID. 
   */
  @IsNumber()
  public id: number;

  /**
   *  User's name. 
   */
  @IsOptional()
  @IsString()
  public name?: string;
 
  /** 
   * User's email. 
   */
  @IsOptional()
  @IsString()
  @IsEmail()
  public email?: string;
  
  /** 
   * User's country. 
   */
  @IsOptional()
  @IsString()
  public country?: string;

  /** 
   * User's phone number. 
   */
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  public phoneNum?: string;

  /** 
   * URL of user's profile picture. 
   */
  @IsOptional()
  @IsString()
  public profilePicture?: string;

  /** 
   * Number of completed todos by the user. 
   */
  @IsOptional()
  @IsNumber()
  public completedTodos?: number;

  /** 
   * Number of todos left to be completed by the user.
   */
  @IsOptional()
  @IsNumber()
  public leftTodos?: number;

  /** 
   * Number of questions asked by the user. 
   */
  @IsOptional()
  @IsNumber()
  public askedQuestions?: number;

  /** 
   * User's current password. 
   */
  @IsOptional()
  @IsString()
  public currPassword?: string;
  
  /** 
   * User's new password. 
   */
  @IsOptional()
  @IsString()
  public newPassword?: string;
}

/**
 * Builder class for constructing instances of UserDto.
 */
class UserDtoBuilder extends DtoBuilder<UserDto> {
   /**
   * Constructs a new UserDtoBuilder instance.
   * @param dto The UserDto object to build upon, default is a new UserDto instance.
   */
  constructor(dto: UserDto = new UserDto()) {
    super(dto);
  }

  /**
   * Creates a new UserDto instance.
   */
  private reset = () => {
    this.dto = new UserDto();
  }

  /**
   * Sets the ID of the user.
   * @param id The user's ID.
   * @returns The UserDtoBuilder instance.
   */
  public addId = (id: number) => {
    this.dto.id = id;
    return this;
  }

  /**
   * Sets the name of the user.
   * @param name The user's name.
   * @returns The UserDtoBuilder instance.
   */
  public addName = (name: string) => {
    this.dto.name = name;
    return this;
  }

  /**
   * Sets the email of the user.
   * @param name The user's email.
   * @returns The UserDtoBuilder instance.
   */
  public addEmail = (email: string) => {
    this.dto.email = email;
    return this;
  }

  /**
   * Sets the country of the user.
   * @param name The user's country.
   * @returns The UserDtoBuilder instance.
   */
  public addCountry = (country: string) => {
    this.dto.country = country;
    return this;
  }

  /**
   * Sets the profile picture URL of the user.
   * @param name The URL of the user's profile picture.
   * @returns The UserDtoBuilder instance.
   */
  public addProfilePicture = (profilePictureUrl: string) => {
    this.dto.profilePicture = profilePictureUrl;
    return this;
  }

  /**
   * Sets the phone number of the user.
   * @param phoneNum The user's phone number.
   * @returns The UserDtoBuilder instance.
   */
  public addPhoneNum = (phoneNum: string) => {
    this.dto.phoneNum = phoneNum;
    return this;
  }

  /**
   * Sets the number of completed todos by the user.
   * @param todosCount The number of completed todos.
   * @returns The UserDtoBuilder instance.
   */
  public addCompletedTodos = (todosCount: number) => {
    this.dto.completedTodos = todosCount;
    return this;
  }
  
  /**
   * Sets the number of todos left to be completed by the user.
   * @param todosCount The number of todos left.
   * @returns The UserDtoBuilder instance.
   */
  public addLeftTodos = (todosCount: number) => {
    this.dto.leftTodos = todosCount;
    return this;
  }
  
  /**
   * Sets the number of questions asked by the user.
   * @param questionsCount The number of questions asked.
   * @returns The UserDtoBuilder instance.
   */
  public addAskedQuestions = (questionsCount: number) => {
    this.dto.askedQuestions = questionsCount;
    return this;
  }
  
  /**
   * Sets the user's current password.
   * @param pwd The user's current password.
   * @returns The UserDtoBuilder instance.
   */
  public addCurrPassword = (pwd: string) => {
    this.dto.currPassword = pwd;
    return this;
  }

  /**
   * Sets the user's new password.
   * @param pwd The user's new password.
   * @returns The UserDtoBuilder instance.
   */
  public addNewPassword = (pwd: string) => {
    this.dto.newPassword = pwd;
    return this;
  }

  /** 
   * Builds and returns the constructed UserDto instance.
   * @returns The constructed UserDto instance.
   */
  public build = () => {
    const user = this.dto;
    this.reset();
    return user;
  }
}

export { UserDto, UserDtoBuilder };