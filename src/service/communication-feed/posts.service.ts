// import { PostDto } from "../../dto/Post.dto";
import AppDataSource from "../../config/mysqlConn";
import { Post } from "../../entity/communication-feed/post.entity";
import { Saved } from "../../entity/communication-feed/saved.entity";
import UserService from "../../service/user.service";
import { DeleteResult, Repository } from "typeorm";
import LikesService from "./likes.service";
import CommentsService from "./comments.service";
import { paginationInfo } from "../paginationInfo.utility";
import { PostDto } from "../../dto/post.dto";

type postInfo = {
  content: string,
  created_at: Date,
  username: string,
  likes: number,  
  comments: number
}

export type getPostsResult = {
  prevPage?: number,
  nextPage?: number,
  posts: postInfo[]
};

export type getPostResult = {
  id: number,
  content: string,
  username?: string,
  userProfileImageURL?: string,
  created_at: Date,
  updated_at: Date,
  numOfLikes?: number,
  liked?: boolean,
  saved?: boolean
};
 
/**
 * Service class for managing post operations.
 */
class PostsService {
  private postRepository: Repository<Post> = AppDataSource.getRepository(Post);
  private savedPostsRepository: Repository<Saved> = AppDataSource.getRepository(Saved);

  /**
   * Get all posts except those belonging to the current user.
   * @param userId ID of the current user.
   * @param pageNum Page number for pagination.
   * @param limit Number of posts per page.
   * @returns Promise with getPostsResult containing posts' information.
   * @throws Error if some error occurred during the database query processing.
   */
  public async getAllPosts(userId: number, pageNum: number, limit: number): Promise<getPostsResult> {
    try {
      const offset: number = (pageNum - 1) * limit;
      const posts: Post[] = await this.postRepository.createQueryBuilder('posts')
            .leftJoinAndSelect('posts.user', 'user')
            .where('user.id != :userId', { userId }) 
            .orderBy('posts.created_at', 'DESC')
            .skip(offset)
            .take(limit + 1)
            .getMany();
      
      let result: getPostsResult = {
        posts: []
      };

      if (posts.length) {
        paginationInfo(result, posts, pageNum, limit, offset);
      
        const { postUserInfos, likesNums, commentsNums } = await this.getAllNeededPostsInformation(posts);

        // think of getting rid of userinfo checking, because we already have that in our posts (because of left join)
        // @ts-ignore
        result.posts = posts.map((post, index) => ({
          content: post.content,
          created_at: post.created_at,
          username: postUserInfos[index].name,
          likes: likesNums[index].numOfLikes,
          comments: commentsNums[index]
        }));
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  // user cannot save his own posts so you don't have to check whether IDs are the same or not
  /**
   * Get posts saved by the current user.
   * @param userId ID of the current user.
   * @param pageNum Page number for pagination.
   * @param limit Number of posts per page.
   * @returns Promise with getPostsResult containing posts' information.
   * @throws Error if some error occurred during the database query processing.
   */
  public async getSavedPosts(userId: number, pageNum: number, limit: number): Promise<getPostsResult> {
      try {
      const offset: number = (pageNum - 1) * limit;
      const savedPosts: Saved[] = await this.savedPostsRepository.createQueryBuilder('saved_posts')
            .leftJoinAndSelect('saved_posts.user', 'user')
            .leftJoinAndSelect('saved_posts.post', 'corr_post')
            .leftJoinAndSelect('corr_post.user', 'post_user') // Add this line to join the user associated with the post
            .where('user.id = :userId', { userId }) 
            .orderBy('saved_posts.created_at', 'DESC')
            .skip(offset)
            .take(limit + 1)
            .getMany();
            
      let result: getPostsResult = {
        posts: []
      };

      if (savedPosts.length) {
        paginationInfo(result, savedPosts, pageNum, limit, offset);
    
        const { postUserInfos, likesNums, commentsNums } = await this.getAllNeededPostsInformation(savedPosts);

        // @ts-ignore
        result.posts = savedPosts?.map((saved, index) => ({
          content: saved.post.content,
          createdAt: saved.created_at,
          username: postUserInfos[index].name,
          likes: likesNums[index].numOfLikes,
          comments: commentsNums[index]
        }));
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Get all posts that belongs to the current user.
   * @param userId ID of the current user.
   * @param pageNum Page number for pagination.
   * @param limit Number of posts per page.
   * @returns Promise with getPostssResult containing posts' information.
   * @throws Error if some error occurred during the database query processing.
   */
  public async getUsersPosts(userId: number, pageNum: number, limit: number): Promise<getPostsResult> {
    try {
      const offset: number = (pageNum - 1) * limit;
      const userPosts: Post[] = await this.postRepository.createQueryBuilder('posts')
            .leftJoinAndSelect('posts.user', 'user')
            .where('user.id = :userId', { userId })
            .orderBy('posts.created_at', 'DESC')
            .skip(offset)
            .take(limit + 1)
            .getMany();
            
      let result: getPostsResult = {
        posts: []
      };

      if (userPosts.length) {
        paginationInfo(result, userPosts, pageNum, limit, offset);
    
        const { likesNums, commentsNums } = await this.getAllNeededPostsInformation(userPosts);

        // @ts-ignore
        result.posts = userPosts?.map((post, index) => ({
          content: post.content,
          createdAt: post.created_at,
          likes: likesNums[index].numOfLikes,
          comments: commentsNums[index]
        }));
      }
      return result;
    } catch (err) {
      throw err;
    }
  }
 
   /**
   * Retrieves detailed information about a specific post.
   * @param postData - The PostDto object containing post ID and user ID.
   * @returns A promise that resolves to a getPostResult object.
   * @throws Error if some error occurred during the database query processing.
   */
  public async getPost(postData: PostDto) {
    try {
      const post: Post | null = await this.postRepository.findOne({
        where: { id: postData.id },
        relations: ['user'] 
      });
      if (!post) {
        throw new Error(`No post matches ID ${postData.id}`);
      } else {
        let result: getPostResult = { id: post.id, content: post.content, created_at: post.created_at, updated_at: post.updated_at };

        const likes = await LikesService.getNumOfLikes(postData.id as number, postData.userId);
        const userInfo = await UserService.getPostUserInfo(post.user.id);

        result = { ...result, numOfLikes: likes.numOfLikes, liked: likes.likedByUser, username: userInfo.name, userProfileImageURL: userInfo.profileImageURL };
        
        const saved: Saved | null = await this.savedPostsRepository.findOne({
          where: { user: { id: postData.userId }, post: { id: postData.id } },
        });
        if (saved) {
          result.saved = true;
        } else {
          result.saved = false;
        }
        return result;
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Adds a new post to the database.
   * @param postData - The PostDto object containing post content and user ID.
   * @returns A promise that resolves to a success message upon successful insertion.
   * @throws Error if some error occurred during the database query processing.
   */
  public async addPost(postData: PostDto): Promise<string> {
    try {
      await this.postRepository.createQueryBuilder('posts').insert().into(Post).values({
        content: postData.content,
        user: { id: postData.id }
      }).execute();
      return 'Success';
    } catch (err) {
      throw err;
    }
  }

  /**
   * Updates an existing post in the database.
   * @param postData - The PostDto object containing post ID, user ID, and updated content.
   * @returns A promise that resolves to the updated post object.
   * @throws Error if some error occurred during the database query processing.
   */
  public async updatePost(postData: PostDto) {
    try {
      const post: Post | null = await this.postRepository.findOne({
        where: {
          id: postData.id,
          user: { id: postData.userId }
      }});
      if (!post) {
        throw new Error(`No Post matches ID ${postData.id}.`);
      } else {
        this.postRepository.merge(post, { content: postData.content });
        return await this.postRepository.save(post);
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Deletes a post from the database.
   * @param postData - The PostDto object containing post ID and user ID.
   * @returns A promise that resolves to a success message upon successful deletion.
   * @throws Error if some error occurred during the database query processing.
   */
  public async deletePost(postData: PostDto) {
    try {
      const post: Post | null = await this.postRepository.findOne({
        where: {
          id: postData.id,
          user: { id: postData.userId }
      }});
      if (!post) {
        throw new Error(`No Post matches ID ${postData.id}.`);
      } else {
        const result: DeleteResult = await this.postRepository.delete(postData.id as number);
        if (result.affected == 1) {
          return { message: 'Success' };
        } else {
          return { message: 'Fail' };
        }
      }
    } catch (err) {
      throw err;
    }
  }

  // To get an information about how many questions user has asked (when user fetches his own info for profile page)
  /**
   * Retrieves the number of posts made by a specific user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to the number of posts.
   * @throws Error if some error occurred during the database query processing.
   */
  static async amountOfPostsForUser(userId: number) {
    try {
      return await AppDataSource.getRepository(Post).count({ where: { user: { id: userId } } });
    } catch (err) {
      throw err;
    }
  }

  /**
   * Retrieves additional information needed for posts, such as user info, likes, and comments.
   * @param posts - An array of Post or Saved objects.
   * @returns A promise that resolves to an object containing postUserInfos, likesNums, and commentsNums.
   * @throws Error if some error occurred during the database query processing.
   */
  private async getAllNeededPostsInformation(posts: Post[] | Saved[]) {
    const postUserInfoPromises = posts.map(post => UserService.getPostUserInfo(post instanceof Post ? post.user.id : post.post.user.id));
    const likesNumPromises = posts.map(post => LikesService.getNumOfLikes(post instanceof Post ? post.id : post.post.id));
    const commentsNumPromises= posts.map(post => CommentsService.getNumOfComments(post instanceof Post ? post.id : post.post.id));

    const postUserInfos = await Promise.all(postUserInfoPromises);
    const likesNums = await Promise.all(likesNumPromises);
    const commentsNums = await Promise.all(commentsNumPromises);
    return { postUserInfos, likesNums, commentsNums };
  } 
}

export default PostsService;