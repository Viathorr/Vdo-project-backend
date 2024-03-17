import AppDataSource from "../../config/mysqlConn";
import { Like } from "../../entity/communication-feed/like.entity";
import { DeleteResult, InsertResult, Repository } from "typeorm";
 
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
        .where('post.id = :postId', { postId })
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
 
  public async addlike(postId: number, userId: number) {
    try {
      const like: InsertResult = await this.likeRepository.createQueryBuilder('likes').insert().into(Like).values({
        user: { id: userId },
        post: { id: postId }
      }).execute();
      return like.generatedMaps[0];
    } catch (err) {
      throw err;
    }
  }

  public async deletelike(postId: number) {
    try {
      const result: DeleteResult = await this.likeRepository.delete({ post: { id: postId } });
      if (result.affected === 1) {
        return { message: 'Success' };
      } else {
        return { message: 'Fail' };
      }
    } catch (err) {
      throw err;
    }
  }
}

export default LikesService;