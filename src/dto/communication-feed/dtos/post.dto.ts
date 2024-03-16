interface PostDto {
  id: number;

  content?: string;

  userName?: string;

  userImageURL?: string;

  creationDate?: string;

  likesNum?: number;

  commentsNum?: number;

  saved?: boolean;

  liked?: boolean;
}

export default PostDto;