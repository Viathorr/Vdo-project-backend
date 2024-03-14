// import { PostDto } from "../../dto/Post.dto";
import AppDataSource from "../../config/mysqlConn";
import { Post } from "../../entity/communication-feed/post.entity";
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
  // private postsSortingStrategy: PostsSortingStrategy;
  
  // public setPostsSortingStrategy(sortingStrategy: PostsSortingStrategy): void {
  //   this.postsSortingStrategy = sortingStrategy;
  // }

  public async getAllPosts(userId: number, pageNum: number, limit: number) {

  }

  // public async addPost(PostData: PostDto) {

  // }

  // public async updatePost(PostData: PostDto) {

  
  // }

  // public async deletePost(PostData: PostDto) {
  
  // }
}

export default PostsService;