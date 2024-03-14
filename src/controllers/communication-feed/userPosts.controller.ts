import { Response, Router } from 'express';
import Controller from '../../interfaces/controller.interface';
import RequestWithUserId from '../../interfaces/requestWithUserId.interface';


class UserPostsController implements Controller {
  public path: string = '/my_posts';
  public router: Router = Router();
  // the same Service class as in PostsController class
  // private postsService: PostsService = new PostsService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.route(this.path)
      // @ts-ignore
      .get(this.getPosts)
      // @ts-ignore
      .post(this.addPost);
    
    this.router.route(`${this.path}/:id`)
      // @ts-ignore
      .get(this.getPost)
      // @ts-ignore
      .put(this.updatePost)
      // @ts-ignore
      .delete(this.deletePost);
    
    this.router.route(`${this.path}/saved`)
      // @ts-ignore
      .get(this.getSavedPosts);
  }

  // request sent every time user opens his posts page
  // here I merely have to send some basic information about the posts (content(with limitations handled on the frontend side), amount of likes and comments (apart from comments and likes services), date of creation)
  // URL: http://localhost:3500/my_posts?page=:page&limit=:limit&s=:sort
  private getPosts = async (req: RequestWithUserId, res: Response) => {
    
  }
  
  // request sent every time user opens his saved posts page
  // user can't save his own posts so I don't have to handle the situation when user ids are the same (post's creator and recipient)
  // the same as in PostsController getPosts method
  // URL: http://localhost:3500/my_posts/saved?page=:page&limit=:limit&s=:sort
  private getSavedPosts = async (req: RequestWithUserId, res: Response) => {
    
  }

  // request sent every time user clicks on his post from his posts page
  // the same as in PostsController getPost method
  private getPost = async (req: RequestWithUserId, res: Response) => {
    
  }
  
  private addPost = async (req: RequestWithUserId, res: Response) => {
    
  }
  
  private updatePost = async (req: RequestWithUserId, res: Response) => {
    
  }
  
  private deletePost = async (req: RequestWithUserId, res: Response) => {
    
  }
}

export default new UserPostsController();