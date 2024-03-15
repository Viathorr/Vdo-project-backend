import { Response, Router } from 'express';
import PostsService, { getResult } from '../../service/communication-feed/posts.service';
import Controller from '../../interfaces/controller.interface';
import RequestWithUserId from '../../interfaces/requestWithUserId.interface';


class PostsController implements Controller {
  public path: string = '/posts';
  public router: Router = Router();
  private postsService: PostsService = new PostsService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.route(this.path)
      // @ts-ignore
      .get(this.getPosts);
    
    this.router.route(`${this.path}/:id`)
      // @ts-ignore
      .get(this.getPost);
  }

  // request sent every time user opens posts feed
  // here I merely have to send some basic information about the post (user's name, user's image(maybe), content(with limitations handled on the frontend side), amount of likes and comments (separately from comments and likes services), date of creation)
  // URL: http://localhost:3500/posts?page=:page&limit=:limit
  private getPosts = async (req: RequestWithUserId, res: Response) => {
    console.log('Get all posts request');
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    try {
      const result: getResult = await this.postsService.getAllPosts(req.id, page, limit);
      if (!result.posts.length) {
        return res.sendStatus(204);
      }
      return res.sendStatus(200);
    } catch (err) {
      console.log(err);
      return res.sendStatus(404);
    }
  }

  // request sent every time user clicks on certain post on posts feed page, here I merely have to send all the information about that post, such as user's name, user's image (for sure), date of creation, content, saved/not saved by the user who has sent this request, all the other information (such as likes, comments + pagination) will be handled by other controllers (likes/comments controllers)
  private getPost = async (req: RequestWithUserId, res: Response) => {

  }
}

export default new PostsController();