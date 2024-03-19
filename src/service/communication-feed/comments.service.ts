import AppDataSource from "../../config/mysqlConn";
import { Comment } from "../../entity/communication-feed/comment.entity";
import { DeleteResult, InsertResult, Repository } from "typeorm";
import { paginationInfo } from "../paginationInfo.utility"; 

type commentInfo = {
  content: string,
  created_at: Date,
  username: string,
  userIsCreator: boolean // whether this comment belongs to the user who sent a request
}
 
export type getCommentsResult = {
  prevPage?: number,
  nextPage?: number,
  comments: commentInfo[]
}

/**
 * Service class for managing comments operations.
 */
class CommentsService {
  private commentRepository: Repository<Comment> = AppDataSource.getRepository(Comment);

  /**
   * Get comments for a specific post with pagination.
   * @param postId ID of the post to fetch comments for.
   * @param userId ID of the user making the request.
   * @param pageNum Page number for pagination.
   * @param limit Number of comments per page.
   * @returns Promise with getCommentsResult containing comments and pagination info.
   * @throws Error if some error occurred during the database query processing.
   */
  public async getComments(postId: number, userId: number, pageNum: number, limit: number): Promise<getCommentsResult> {
    try {
      const offset: number = (pageNum - 1) * limit;
      const comments: Comment[] = await this.commentRepository.createQueryBuilder('comments')
        .leftJoinAndSelect('comments.post', 'post')
        .leftJoinAndSelect('comments.user', 'user')
        .where('post.id = :postId', { postId }) 
        .orderBy('comments.created_at', 'ASC')
        .skip(offset)
        .take(limit + 1)
        .getMany();
      
      let result: getCommentsResult = {
        comments: []
      };
      
      if (comments.length) {
        paginationInfo(result, comments, pageNum, limit, offset);

        result.comments = comments.map(comment => ({
          content: comment.content,
          created_at: comment.created_at,
          username: comment.user.name,
          userIsCreator: comment.user.id === userId ? true : false
        }));
      }

      return result;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Add a new comment to a post.
   * @param postId ID of the post to add the comment to.
   * @param userId ID of the user adding the comment.
   * @param content Content of the comment.
   * @returns Promise with the result of the comment insertion.
   * @throws Error if some error occurred during the database query processing.
   */
  public async addComment(postId: number, userId: number, content: string) {
    try {
      const result: InsertResult = await this.commentRepository.createQueryBuilder('comments').insert().into(Comment).values({
        post: { id: postId },
        user: { id: userId },
        content: content
      }).execute();
      return result.generatedMaps[0];
    } catch (err) {
      throw err;
    }
  }

  /**
   * Delete a comment from a post.
   * @param postId ID of the post to delete the comment from.
   * @param userId ID of the user deleting the comment.
   * @param commentId ID of the comment to delete.
   * @returns Promise with the result of the comment deletion.
   * @throws Error if some error occurred during the database query processing.
   */
  public async deleteComment(postId: number, userId: number, commentId: number) {
    try {
      const result: DeleteResult = await this.commentRepository.delete({ post: { id: postId }, user: { id: userId }, id: commentId });
      if (result.affected === 1) {
        return { message: 'Success' };
      } else {
        return { message: 'Fail' };
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Get the number of comments for a specific post.
   * @param postId ID of the post to get the number of comments for.
   * @returns Promise with the number of comments.
   * @throws Error if some error occurred during the database query processing.
   */
  static async getNumOfComments(postId: number) {
    try {
      return await AppDataSource.getRepository(Comment).count({ where: { post: { id: postId } } });
    } catch (err) {
      throw err;
    }
  }
}

export default CommentsService;