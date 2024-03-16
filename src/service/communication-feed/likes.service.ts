import AppDataSource from "../../config/mysqlConn";
import { Like } from "../../entity/communication-feed/like.entity";
import { Repository } from "typeorm";
 
type getResult = {
  numOfLikes: number,
  likedByUser: boolean
};

class LikesService {
  private likeRepository: Repository<Like> = AppDataSource.getRepository(Like);

  static async getNumOfLikes(postId: number, userId?: number) {
    try {
      const likes: Like[] = await AppDataSource.getRepository(Like).createQueryBuilder('likes')
        .leftJoinAndSelect('likes.post', 'post')
        .where('post.id != :postId', { postId })
        .leftJoinAndSelect('likes.user', 'user')
        .getMany();
      const result: getResult = {
        numOfLikes: likes.length,
        likedByUser: userId ? Boolean(likes.filter(like => like.user.id === userId).length) : false
      };
      return result;
    } catch (err) {
      throw err;
    }
  }

  // public async addlike(...) {

  // }

  // public async deletelike(...) {
  
  // }
}

export default LikesService;