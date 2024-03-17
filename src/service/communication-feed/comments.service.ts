import AppDataSource from "../../config/mysqlConn";
import { Comment } from "../../entity/communication-feed/comment.entity";
// import { CommentDto } from "../../dto/comment.dto";
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

class CommentsService {
  private commentRepository: Repository<Comment> = AppDataSource.getRepository(Comment);

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

  static async getNumOfComments(postId: number) {
    try {
      return await AppDataSource.getRepository(Comment).count({ where: { post: { id: postId } } });
    } catch (err) {
      throw err;
    }
  }
}

export default CommentsService;