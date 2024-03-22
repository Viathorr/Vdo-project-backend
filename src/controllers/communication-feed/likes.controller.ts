import { Response, Router } from 'express';
import Controller from '../../interfaces/controller.interface';
import RequestWithUserId from '../../interfaces/requestWithUserId.interface';
import LikesService from '../../service/communication-feed/likes.service';


/**
 * Controller handling routes related to likes on posts.
 */
class LikesController implements Controller {
  public path: string = '/likes';
  public router: Router = Router();
  public likesService: LikesService = new LikesService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.route(this.path)
      // @ts-ignore
      .post(this.addLike)
      // @ts-ignore
      .delete(this.deleteLike);
  }
 
  // getLikes request is sent every time user clicks on certain post and is redirected to the page with that post's information, and server simply sends a number of likes of that particular post
  // also I have to add the property called liked/not liked (or sth else) to inform user whether he has liked this post or not
  // URL: http://localhost:3500/comments?post_id=:id&page=:page&limit=:limit
  // private getLikes = async (req: RequestWithUserId, res: Response) => {

  // }
   
  // adds new record to the Like table in db
  // URL: http://localhost:3500/comments?post_id=:id
  /**
   * Handles POST request to add a like to a post.
   * @param req Request object containing query parameter: post_id.
   * @param res Response object to send back the result.
   */

  public addLike = async (req: RequestWithUserId, res: Response) => {
    console.log('Add like request');
    const postId = parseInt(req.query.post_id as string);
    if (!postId) {
      return res.sendStatus(404);
    }
    try {
      const result = await this.likesService.addlike(postId, req.id);
      console.log('Inserted like:', result);
      return res.json({ message: 'Success' });
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.sendStatus(400);
    }
  }
  
  // deletes the record from the Like table in db with certain user's id
  // URL: http://localhost:3500/comments?post_id=:id
  /**
   * Handles DELETE request to delete a like from a post.
   * @param req Request object containing query parameter: post_id.
   * @param res Response object to send back the result.
   */
  public deleteLike = async (req: RequestWithUserId, res: Response) => {
    console.log('Delete like request');
    const postId = parseInt(req.query.post_id as string);
    if (!postId) {
      return res.sendStatus(404);
    }
    try {
      const result = await this.likesService.deletelike(postId, req.id);
      return res.json(result);
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.sendStatus(400);
    }
  }
}

export default new LikesController();