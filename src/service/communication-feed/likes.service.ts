import AppDataSource from "../../config/mysqlConn";
import { Like } from "../../entity/communication-feed/like.entity";
import { DeleteResult, InsertResult, Repository } from "typeorm";
 
type getResult = {
  numOfLikes: number,
  likedByUser: boolean
};

/**
 * Service class for managing like operations.
 */
class LikesService {
  private likeRepository: Repository<Like> = AppDataSource.getRepository(Like);

  /**
   * Get the number of likes for a specific post and whether the user has liked it.
   * @param postId ID of the post to get likes for.
   * @param userId Optional ID of the user to check if they liked the post.
   * @returns Promise with getResult containing numOfLikes and likedByUser flag.
   * @throws Error if some error occurred during the database query processing.
   */
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
  
  /**
   * Add a like to a post.
   * @param postId ID of the post to like.
   * @param userId ID of the user liking the post.
   * @returns Promise with the result of the like insertion.
   * @throws Error if some error occurred during the database query processing.
   */
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

  /**
   * Delete a like from a post.
   * @param postId ID of the post to delete the like from.
   * @returns Promise with the result of the like deletion.
   * @throws Error if some error occurred during the database query processing.
   */
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