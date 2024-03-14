import { Response, Router } from 'express';
import Controller from '../../interfaces/controller.interface';
import RequestWithUserId from '../../interfaces/requestWithUserId.interface';


class CommentsController implements Controller {
  public path: string = '/comments';
  public router: Router = Router();
  // private commentsService: CommentsService = new CommentsService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.route(this.path)
      // @ts-ignore
      .get(this.getComments)
      // @ts-ignore
      .post(this.addComment)
      // @ts-ignore
      .delete(this.deleteComment);
  }

  // getComments request is sent every time user clicks on certain post and is redirected to the page with that post's information
  // also I have to add the property called yours/not yours (or sth else) to inform user that he is the author of that comment
  // the comments' info I have to send: user's name, user's image(maybe, not sure), content, creation date
  // URL: http://localhost:3500/comments?postId=:id&page=:page&limit=:limit
  private getComments = async (req: RequestWithUserId, res: Response) => {
  }
  
  // URL: http://localhost:3500/comments?postId=:id
  private addComment = async (req: RequestWithUserId, res: Response) => {
    
  }
  
  // URL: http://localhost:3500/comments?postId=:id
  private deleteComment = async (req: RequestWithUserId, res: Response) => {
    
  }
}

export default new CommentsController();