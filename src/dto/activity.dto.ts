import { IsString, IsBoolean, IsOptional, IsNumber, IsDate, isURL, IsUrl } from 'class-validator';
import DtoBuilder from '../interfaces/builder';

/**
 * Data Transfer Object (DTO) for representing an activity item.
 */
class ActivityDto {
  /** 
   * The name of the activity item.
   */
  @IsOptional()
  @IsString()
  public name?: string;

  /** 
   * The ID of the user associated with the activity item. 
   */
  @IsOptional()
  @IsNumber()
  public userId?: number;

  /** 
   * The ID of the activity item. 
   */
  @IsOptional()
  @IsNumber()
  public id?: number;

  /** 
   * The URL of the meeting of the activity item (if such exists). 
   */
  @IsOptional()
  @IsUrl()
  public url?: string;
  
  /**
   * The timestamp of the activity item. 
   */
  @IsOptional()
  @IsString()
  public time?: string;

  /** 
   * The name of week day of the activity item. 
   */
  @IsOptional()
  @IsString()
  public dayName?: string;
}


/**
 * Builder class for constructing instances of ActivityDto.
 */
class ActivityDtoBuilder extends DtoBuilder<ActivityDto> {
  /**
   * Constructs a new ActivityDtoBuilder instance.
   * @param dto The ActivityDto object to build upon, default is a new ActivityDto instance.
   */
  constructor(dto: ActivityDto = new ActivityDto()) {
    super(dto);
  }

  /**
   * Creates a new ActivityDto instance.
   */
  private reset = () => {
    this.dto = new ActivityDto();
  }

  /**
   * Sets the name of the activity item.
   * @param name The name of the activity item.
   * @returns The ActivityDtoBuilder instance.
   */
  public addName = (name: string) => {
    this.dto.name = name;
    return this;
  }

  /**
   * Sets the ID of the user associated with the activity item.
   * @param userId The ID of the user.
   * @returns The ActivityDtoBuilder instance.
   */
  public addUserId = (userId: number) => {
    this.dto.userId = userId;
    return this;
  }

  /**
   * Sets the ID of the activity item.
   * @param id The ID of the activity item.
   * @returns The ActivityDtoBuilder instance.
   */
  public addId = (id: number) => {
    this.dto.id = id;
    return this;
  }
  
  /**
   * Sets the URL of the activity item.
   * @param url The URL of the online meeting of the activity item.
   * @returns The ActivityDtoBuilder instance.
   */
  public addUrl = (url: string) => {
    this.dto.url = url;
    return this;
  }
  
  /**
   * Sets the timestamp of the activity item.
   * @param time The timestamp of the activity item.
   * @returns The ActivityDtoBuilder instance.
   */
  public addTime = (time: string) => {
    this.dto.time = time;
    return this;
  }

  /**
   * Sets the week day name for the activity item.
   * @param dayName The week day name for the activity item.
   * @returns The ActivityDtoBuilder instance.
   */
  public addDayName = (dayName: string) => {
    this.dto.dayName = dayName;
    return this;
  }

  /**
   * Builds and returns the constructed ActivityDto instance.
   * @returns The constructed ActivityDto instance.
   */
  public build = () => {
    const activity = this.dto;
    this.reset();
    return activity;
  }
}

export { ActivityDto, ActivityDtoBuilder };