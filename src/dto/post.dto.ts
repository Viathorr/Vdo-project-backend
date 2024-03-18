import { IsString, IsOptional, IsNumber } from 'class-validator';
import DtoBuilder from '../interfaces/builder';

class PostDto {
  /** 
   * The ID of the post. 
   */
  @IsOptional()
  @IsNumber()
  public id?: number;

  /** 
   * The content of the post.
   */
  @IsOptional()
  @IsString()
  public content?: string;

  /** 
   * The ID of the user associated with the post. 
   */
  @IsOptional()
  @IsNumber()
  public userId?: number;
}

/**
 * Builder class for constructing instances of PostDto.
 */
class PostDtoBuilder extends DtoBuilder<PostDto> {
  /**
   * Constructs a new PostDtoBuilder instance.
   * @param dto The PostDto object to build upon, default is a new PostDto instance.
   */
  constructor(dto: PostDto = new PostDto()) {
    super(dto);
  }

  /**
   * Creates a new PostDto instance.
   */
  private reset = () => {
    this.dto = new PostDto();
  }

  /**
   * Sets the name of the post item.
   * @param content The content of the post.
   * @returns The PostDtoBuilder instance.
   */
  public addContent = (content: string) => {
    this.dto.content = content;
    return this;
  }
 
  /**
   * Sets the ID of the user associated with the post item.
   * @param userId The ID of the user.
   * @returns The PostDtoBuilder instance.
   */
  public addUserId = (userId: number) => {
    this.dto.userId = userId;
    return this;
  }

  /**
   * Sets the ID of the post item.
   * @param id The ID of the post item.
   * @returns The PostDtoBuilder instance.
   */
  public addId = (id: number) => {
    this.dto.id = id;
    return this;
  }

  /**
   * Builds and returns the constructed PostDto instance.
   * @returns The constructed PostDto instance.
   */
  public build = () => {
    const post = this.dto;
    this.reset();
    return post;
  }
}

export { PostDto, PostDtoBuilder };