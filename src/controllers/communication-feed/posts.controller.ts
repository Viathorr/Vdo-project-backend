import { Response, Router } from 'express';
import PostsService, { getPostResult, getPostsResult } from '../../service/communication-feed/posts.service';
import Controller from '../../interfaces/controller.interface';
import RequestWithUserId from '../../interfaces/requestWithUserId.interface';
import { PostDtoBuilder } from '../../dto/post.dto';

/**
 * Controller handling routes related to posts.
 */
class PostsController implements Controller {
  public path: string = '/posts';
  public router: Router = Router();
  public postsService: PostsService = new PostsService();
  private postDtoBuilder: PostDtoBuilder = new PostDtoBuilder();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.route(this.path)
      // @ts-ignore
      .get(this.getPosts)
      // @ts-ignore
      .post(this.addPost);
    
    this.router.route(`${this.path}/saved`)
      // @ts-ignore
      .get(this.getSavedPosts);    
    
    this.router.route(`${this.path}/my`)
      // @ts-ignore
      .get(this.getUserPosts);
    
    this.router.route(`${this.path}/:id`)
      // @ts-ignore
      .get(this.getPost)
      // @ts-ignore
      .put(this.updatePost)
      // @ts-ignore
      .delete(this.deletePost);
    
     
  }

  // request sent every time user opens posts feed
  // here I merely have to send some basic information about the post (user's name, user's image(maybe), content(with limitations handled on the frontend side), amount of likes and comments (separately from comments and likes services), date of creation)
  // URL: http://localhost:3500/posts?page=:page&limit=:limit
  /**
   * Handles GET request to fetch all posts.
   * @param req Request object containing query parameters: page and limit.
   * @param res Response object to send back the result.
   */ 
  public getPosts = async (req: RequestWithUserId, res: Response) => {
    console.log('Get all posts request');
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const userId: number = req.id;
    try {
      const result: getPostsResult = await this.postsService.getAllPosts(userId, page, limit);
      if (!result.posts.length) {
        return res.sendStatus(204);
      }
      return res.status(200).json(result);
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.sendStatus(400);
    }
  }

  // request sent every time user opens his posts page
  // URL: http://localhost:3500/my_posts?page=:page&limit=:limit
  /**
   * Handles GET request to fetch posts created by the user.
   * @param req Request object containing query parameters: page and limit.
   * @param res Response object to send back the result.
   */
  public getUserPosts = async (req: RequestWithUserId, res: Response) => {
    console.log('Get user posts request');
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const userId: number = req.id;
    try {
      const result: getPostsResult = await this.postsService.getUsersPosts(userId, page, limit);
      if (!result.posts.length) {
        return res.sendStatus(204);
      }
      return res.status(200).json(result);
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.sendStatus(400);
    }
  }
   
  // request sent every time user opens his saved posts page
  // URL: http://localhost:3500/my_posts/saved?page=:page&limit=:limit
  /**
   * Handles GET request to fetch saved posts by the user.
   * @param req Request object containing query parameters: page and limit.
   * @param res Response object to send back the result.
   */
  public getSavedPosts = async (req: RequestWithUserId, res: Response) => {
    console.log('Get saved posts request');
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const userId: number = req.id;
    try {
      const result: getPostsResult = await this.postsService.getSavedPosts(userId, page, limit);
      if (!result.posts.length) {
        return res.sendStatus(204);
      }
      return res.status(200).json(result);
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.sendStatus(400);
    }
  }

  // request sent every time user clicks on certain post on posts feed page, here I merely have to send all the information about that post, such as user's name, user's image (for sure), date of creation, content, saved/not saved by the user who has sent this request, info about likes (number and liked/not liked by user), all the other information (such as likes, comments + pagination) will be handled by other controllers (likes/comments controllers)
  // URL: http://localhost:3500/posts/:id
  /**
   * Handles GET request to fetch a specific post.
   * @param req Request object containing the post ID in the URL.
   * @param res Response object to send back the result.
   */
  public getPost = async (req: RequestWithUserId, res: Response) => {
    console.log('Get certain post request');
    try {
      const result: getPostResult = await this.postsService.getPost(this.postDtoBuilder.addId(parseInt(req.params.id)).addUserId(req.id).build());
      return res.status(200).json(result);
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.sendStatus(404);
    }
  }

  /**
   * Handles POST request to add a new post.
   * @param req Request object containing the post content in the body.
   * @param res Response object to send back the result.
   */
  public addPost = async (req: RequestWithUserId, res: Response) => {
    console.log('Add post request');
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Post content is required.' });
    }
    try {
      const result: string = await this.postsService.addPost(this.postDtoBuilder.addContent(content).addUserId(req.id).build());
      return res.status(201).json({ message: result });
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.sendStatus(500);
    }
  }

  /**
   * Handles PUT request to update a post.
   * @param req Request object containing the post ID in the URL and updated content in the body.
   * @param res Response object to send back the result.
   */
  public updatePost = async (req: RequestWithUserId, res: Response) => {
    console.log('Update post request');
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Post content is required.' });
    }
    try {
      const result = await this.postsService.updatePost(this.postDtoBuilder.addId(parseInt(req.params.id)).addUserId(req.id).addContent(content).build());
      console.log('Update post result:', result);
      return res.sendStatus(200);
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.status(404).json({ message: "Fail" });
    }
  }
  
  /**
   * Handles DELETE request to delete a post.
   * @param req Request object containing the post ID in the URL.
   * @param res Response object to send back the result.
   */
  public deletePost = async (req: RequestWithUserId, res: Response) => {
    console.log('Delete post request');
    try {
      const result = await this.postsService.deletePost(this.postDtoBuilder.addId(parseInt(req.params.id)).addUserId(req.id).build());
      console.log('Delete post result:', result.message);
      return res.json(result);
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.status(404).json({ message: "Fail" });
    }
  }
}

export default new PostsController();