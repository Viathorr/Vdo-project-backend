import { getPostsResult } from "./communication-feed/posts.service";
import { getCommentsResult } from "./communication-feed/comments.service";
import { Post } from "../entity/communication-feed/post.entity";
import { Saved } from "../entity/communication-feed/saved.entity";
import { Comment } from "../entity/communication-feed/comment.entity";

// type pagination = {
//   nextPage?: number,
//   prevPage?: number
// };

export const paginationInfo = (result: getPostsResult | getCommentsResult, data: Post[] | Saved[] | Comment[], pageNum: number, limit: number, offset: number): void => {
  if (data.length > limit) {
    result.nextPage = pageNum + 1;
    data.pop();
  }
  if (offset > 0) {
    result.prevPage = pageNum - 1;
  }
}