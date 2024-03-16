import AppDataSource from "../../config/mysqlConn";
import { Comment } from "../../entity/communication-feed/comment.entity";
// import { CommentDto } from "../../dto/comment.dto";
import { Repository } from "typeorm";

class CommentsService {
  private CommentRepository: Repository<Comment> = AppDataSource.getRepository(Comment);

  // public async getComments(...) {
  
  // }

  // public async addComment(...) {

  // }

  // public async deleteComment(...) {
  
  // }

  static async getNumOfComments(postId: number) {
    try {
      return await AppDataSource.getRepository(Comment).count({ where: { post: { id: postId } } });
    } catch (err) {
      throw err;
    }
  }
}

export default CommentsService;