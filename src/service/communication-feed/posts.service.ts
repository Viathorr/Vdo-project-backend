// import { PostDto } from "../../dto/Post.dto";
import AppDataSource from "../../config/mysqlConn";
import { Post } from "../../entity/communication-feed/post.entity";
import { Saved } from "../../entity/communication-feed/saved.entity";
import UserService from "../../service/user.service";
import { DeleteResult, Repository } from "typeorm";
import LikesService from "./likes.service";
import CommentsService from "./comments.service";

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
 
class PostsService {
  private postRepository: Repository<Post> = AppDataSource.getRepository(Post);
  private savedPostsRepository: Repository<Saved> = AppDataSource.getRepository(Saved);

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
        this.paginationInfo(result, posts, pageNum, limit, offset);
      
        const { postUserInfos, likesNums, commentsNums } = await this.getAllNeededPostsInformation(posts);

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
  public async getSavedPosts(userId: number, pageNum: number, limit: number) {
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
        this.paginationInfo(result, savedPosts, pageNum, limit, offset);
    
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

  public async getUsersPosts(userId: number, pageNum: number, limit: number) {
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
        this.paginationInfo(result, userPosts, pageNum, limit, offset);
    
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

  public async getPost(postId: number, userId: number) {
    try {
      const post: Post | null = await this.postRepository.findOne({
        where: { id: postId },
        relations: ['user'] 
      });
      if (!post) {
        throw new Error(`No post matches ID ${postId}`);
      } else {
        let result: getPostResult = { id: post.id, content: post.content, created_at: post.created_at, updated_at: post.updated_at };

        const likes = await LikesService.getNumOfLikes(postId, userId);
        const userInfo = await UserService.getPostUserInfo(post.user.id);

        result = { ...result, numOfLikes: likes.numOfLikes, liked: likes.likedByUser, username: userInfo.name, userProfileImageURL: userInfo.profileImageURL };
        
        const saved: Saved | null = await this.savedPostsRepository.findOne({
          where: { user: { id: userId }, post: { id: postId } },
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

  public async addPost(content: string, userId: number) {
    try {
      await this.postRepository.createQueryBuilder('posts').insert().into(Post).values({
        content,
        user: { id: userId }
      }).execute();
      return 'Success';
    } catch (err) {
      throw err;
    }
  }

  public async updatePost(postId: number, content: string, userId: number) {
    try {
      const post: Post | null = await this.postRepository.findOne({
        where: {
          id: postId,
          user: { id: userId }
      }});
      if (!post) {
        throw new Error(`No Post matches ID ${postId}.`);
      } else {
        this.postRepository.merge(post, { content });
        return await this.postRepository.save(post);
      }
    } catch (err) {
      throw err;
    }
  }

  public async deletePost(postId: number, userId: number) {
    try {
      const post: Post | null = await this.postRepository.findOne({
        where: {
          id: postId,
          user: { id: userId }
      }});
      if (!post) {
        throw new Error(`No Post matches ID ${postId}.`);
      } else {
        const result: DeleteResult = await this.postRepository.delete(postId);
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
  static async amountOfPostsForUser(userId: number) {
    try {
      return await AppDataSource.getRepository(Post).count({ where: { user: { id: userId } } });
    } catch (err) {
      throw err;
    }
  }

  private async getAllNeededPostsInformation(posts: Post[] | Saved[]) {
    const postUserInfoPromises = posts.map(post => UserService.getPostUserInfo(post instanceof Post ? post.user.id : post.post.user.id));
    const likesNumPromises = posts.map(post => LikesService.getNumOfLikes(post instanceof Post ? post.id : post.post.id));
    const commentsNumPromises= posts.map(post => CommentsService.getNumOfComments(post instanceof Post ? post.id : post.post.id));

    const postUserInfos = await Promise.all(postUserInfoPromises);
    const likesNums = await Promise.all(likesNumPromises);
    const commentsNums = await Promise.all(commentsNumPromises);
    return { postUserInfos, likesNums, commentsNums };
  } 

  private paginationInfo(result: getPostsResult, posts: Post[] | Saved[], pageNum: number, limit: number, offset: number): void {
    if (posts.length > limit) {
      result.nextPage = pageNum + 1;
      posts.pop();
    }
    if (offset > 0) {
      result.prevPage = pageNum - 1;
    }
  }
}

export default PostsService;