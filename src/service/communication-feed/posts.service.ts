// import { PostDto } from "../../dto/Post.dto";
import AppDataSource from "../../config/mysqlConn";
import { Post } from "../../entity/communication-feed/post.entity";
import { Like } from "../../entity/communication-feed/like.entity";
import { Comment } from "../../entity/communication-feed/comment.entity";
import { Saved } from "../../entity/communication-feed/saved.entity";
import { User } from "../../entity/user.entity";
// import {PostsSortingStrategy} from "./PostsSortingStrategy";
import {DeleteResult, InsertResult, Repository} from "typeorm";
 
export type getResult = {
  prevPage?: number,
  nextPage?: number,
  posts: Post[]
};
 
class PostsService {
  private postRepository: Repository<Post> = AppDataSource.getRepository(Post);
  private savedPostsRepository: Repository<Saved> = AppDataSource.getRepository(Saved);

  public async getAllPosts(userId: number, pageNum: number, limit: number): Promise<getResult> {
    try {
      const offset: number = (pageNum - 1) * limit;
      const posts: Post[] = await this.postRepository.createQueryBuilder('posts')
            .leftJoinAndSelect('posts.user', 'user')
            .where('user.id != :userId', { userId }) 
            .orderBy('posts.created_at', 'DESC')
            .skip(offset)
            .take(limit + 1)
            .getMany();
      let result: getResult = {
        posts
      };
      if (posts.length > limit) {
        result.nextPage = pageNum + 1;
        posts.pop();
      }
      if (offset > 0) {
        result.prevPage = pageNum - 1;
      }

      console.log('post user id: ', result.posts[0].user.id);
      // TODO: solve the issuse with lines below (why it doesn't work?)
      // result.posts.map(async post => {
      //   return { content: post.content, created_at: post.created_at, userName: (await this.getPostUserInfo(post.user.id)).name }
      // });
      // result.posts.map(async post => {
      //   return { ...post, likes: await this.getLikesNum(post.id) };
      // });
      // result.posts.map(async post => {
      //   return { ...post, comments: await this.getCommentsNum(post.id) };
      // });
      console.log('post: ', result.posts[0]);
      return result;
    } catch (err) {
      throw err;
    }
  }

  // user cannot save his own posts so you don't have to check whether IDs are the same or not
  public async getSavedPosts(userId: number, pageNum: number, limit: number) {

  }

  public async getUsersPosts(userId: number, pageNum: number, limit: number) {

  }

  // public async addPost(PostData: PostDto) {

  // }

  // public async updatePost(PostData: PostDto) {

  
  // }

  // public async deletePost(PostData: PostDto) {
  
  // }

  public async getPostUserInfo(user_id: number) {
    try {
      const user: User | null = await AppDataSource.getRepository(User).findOneBy({ id: user_id });
      if (user) {
        return { name: user.name, profileImageURL: user.profile_picture };
      }
      else {
        return {};
      }
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  public async getLikesNum(postId: number): Promise<number> {
    try {
      const result: number = await AppDataSource.getRepository(Like).count({ where: { post: { id: postId } } });
      console.log(result);
      return result;
    } catch (err) {
      console.log('in catch section');
      return 0;
    }
  }

  public async getCommentsNum(postId: number): Promise<number> {
    try {
      const result: number = await AppDataSource.getRepository(Comment).count({ where: { post: { id: postId } } });
      console.log(result);
      return result;
    } catch (err) {
      console.log('in catch section');
      return 0;
    }
  }
}

export default PostsService;