import { Response, Router } from 'express';
import Controller from '../../interfaces/controller.interface';
import RequestWithUserId from '../../interfaces/requestWithUserId.interface';


class CommentsController implements Controller {
  public path: string = '/likes';
  public router: Router = Router();
  // private likesService: LikesService = new LikesService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.route(this.path)
      // @ts-ignore
      .get(this.getLikes)
      // @ts-ignore
      .post(this.addLike)
      // @ts-ignore
      .delete(this.deleteLike);
  }

  // getLikes request is sent every time user clicks on certain post and is redirected to the page with that post's information, and server simply sends a number of likes of that particular post
  // also I have to add the property called liked/not liked (or sth else) to inform user whether he has liked this post or not
  // URL: http://localhost:3500/comments?postId=:id&page=:page&limit=:limit
  private getLikes = async (req: RequestWithUserId, res: Response) => {
  }
  
  // adds new record to the Like table in db
  // URL: http://localhost:3500/comments?postId=:id
  private addLike = async (req: RequestWithUserId, res: Response) => {
    
  }
  
  // deletes the record from the Like table in db with certain user's id
  // URL: http://localhost:3500/comments?postId=:id
  private deleteLike = async (req: RequestWithUserId, res: Response) => {
    
  }
}

export default new CommentsController();