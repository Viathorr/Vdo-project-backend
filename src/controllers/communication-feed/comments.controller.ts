import { Response, Router } from 'express';
import Controller from '../../interfaces/controller.interface';
import RequestWithUserId from '../../interfaces/requestWithUserId.interface';
import CommentsService, { getCommentsResult } from '../../service/communication-feed/comments.service';
 

class CommentsController implements Controller {
  public path: string = '/comments';
  public router: Router = Router();
  private commentsService: CommentsService = new CommentsService();

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
  // URL: http://localhost:3500/comments?post_id=:id&page=:page&limit=:limit
  private getComments = async (req: RequestWithUserId, res: Response) => {
    console.log('Get comments request');
    const postId: number = parseInt(req.query.post_id as string);
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required.' });
    }
    try {
      const result: getCommentsResult = await this.commentsService.getComments(postId, req.id, page, limit);
      if (!result.comments.length) {
        return res.sendStatus(204);
      }
      return res.status(200).json(result);
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.sendStatus(404);
    }
  }
  
  // URL: http://localhost:3500/comments?post_id=:id
  private addComment = async (req: RequestWithUserId, res: Response) => {
    console.log('Add comment request');
    const postId: number = parseInt(req.query.post_id as string);
    const { content } = req.body;
    if (!content || !postId) {
      return res.status(400).json({ message: 'Comment content and ID are required.' });
    }
    try {
      const result = await this.commentsService.addComment(postId, req.id, content);
      console.log('Inserted comment:', result);
      return res.json({ message: 'Success' });
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.sendStatus(400);
    }
  }
  
  // URL: http://localhost:3500/comments?post_id=:id&comment_id=:id
  private deleteComment = async (req: RequestWithUserId, res: Response) => {
    console.log('Delete comment request');
    const postId: number = parseInt(req.query.post_id as string);
    const commentId: number = parseInt(req.query.comment_id as string);
    if (!postId || !commentId) {
      return res.status(400).json({ message: 'Post and comment IDs are required.' });
    }
    try {
      const result = await this.commentsService.deleteComment(postId, req.id, commentId);
      return res.json(result);
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.sendStatus(400);
    }
  }
}

export default new CommentsController();