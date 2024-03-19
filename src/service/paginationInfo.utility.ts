import { getPostsResult } from "./communication-feed/posts.service";
import { getCommentsResult } from "./communication-feed/comments.service";
import { Post } from "../entity/communication-feed/post.entity";
import { Saved } from "../entity/communication-feed/saved.entity";
import { Comment } from "../entity/communication-feed/comment.entity";
 
/**
 * Updates pagination information based on the provided data and pagination settings.
 * @param result The pagination result object to be updated.
 * @param data The array of data being paginated (e.g., posts, comments, saved items).
 * @param pageNum The current page number.
 * @param limit The maximum number of items per page.
 * @param offset The offset for paginating the data.
 */
export const paginationInfo = (result: getPostsResult | getCommentsResult, data: Post[] | Saved[] | Comment[], pageNum: number, limit: number, offset: number): void => {
  // Check if there are more items than the limit for pagination
  if (data.length > limit) {
    // Update the next page number in the pagination result
    result.nextPage = pageNum + 1;
    // Remove the last item from the data array to adjust for pagination
    data.pop();
  }
  // Check if there is an offset for pagination
  if (offset > 0) {
    // Update the previous page number in the pagination result
    result.prevPage = pageNum - 1;
  }
}