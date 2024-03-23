import commentsController from "../comments.controller";
import httpMocks from 'node-mocks-http';
import { Response } from "express";
import RequestWithUserId from "../../../interfaces/requestWithUserId.interface";
import { commentInfo } from "../../../service/communication-feed/comments.service";

describe('get comments', () => {
   const mockGetComments = jest.spyOn(commentsController.commentsService, 'getComments');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send all comments', async () => {
    const comments = [
      {
        content: 'comment1',
        username: 'username1',
        userIsCreator: false
      } as commentInfo,
      {
        content: 'comment2',
        username: 'username2',
        userIsCreator: true
      } as commentInfo,
      {
        content: 'comment3',
        username: 'username3',
        userIsCreator: false
      } as commentInfo
    ];
    mockGetComments.mockResolvedValue({ comments });

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      query: {
        post_id: 1
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await commentsController.getComments(mockReq, mockRes);

    expect(mockGetComments).toHaveBeenCalledTimes(1);
    expect(mockGetComments).toHaveBeenCalledWith(1, 1, 1, 10);
    expect(mockRes.statusCode).toBe(200);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({ comments });
  });
  
  it('should send 204 status code if no comments found', async () => {
    mockGetComments.mockResolvedValue({ comments: [] });

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      query: {
        post_id: 1
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await commentsController.getComments(mockReq, mockRes);

    expect(mockGetComments).toHaveBeenCalledTimes(1);
    expect(mockGetComments).toHaveBeenCalledWith(1, 1, 1, 10);
    expect(mockRes.statusCode).toBe(204);
    expect(mockRes._isEndCalled()).toBeTruthy();
  });
  
  it('should send 400 error if no post ID provided', async () => {
    const mockReq = httpMocks.createRequest<RequestWithUserId>({ id: 1 });
    const mockRes = httpMocks.createResponse<Response>();

    await commentsController.getComments(mockReq, mockRes);

    expect(mockRes._isEndCalled).toBeTruthy();
    expect(mockRes.statusCode).toBe(400);
  });
  
  it('should send 404 error if some error occurred', async () => {
    const mockError = new Error('Mock Error');
    mockGetComments.mockRejectedValue(mockError);

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      query: {
        post_id: 1
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await commentsController.getComments(mockReq, mockRes);

    expect(console.log).toHaveBeenLastCalledWith(mockError.message);
    expect(mockGetComments).toHaveBeenCalledTimes(1);
    expect(mockGetComments).toHaveBeenCalledWith(1, 1, 1, 10);
    expect(mockRes.statusCode).toBe(404);
    expect(mockRes._isEndCalled()).toBeTruthy();
  });
});

describe('add comment', () => {
  const mockAddComment = jest.spyOn(commentsController.commentsService, 'addComment');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add comment and send success message', async () => {
    mockAddComment.mockResolvedValue({
      id: 1,
      content: 'mockComment'
    });

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      query: {
        post_id: 1
      },
      body: {
        content: 'mockComment'
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await commentsController.addComment(mockReq, mockRes);

    expect(console.log).toHaveBeenCalled();
    expect(mockAddComment).toHaveBeenCalledTimes(1);
    expect(mockAddComment).toHaveBeenCalledWith(1, 1, 'mockComment');
    expect(mockRes.statusCode).toBe(200);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({ message: 'Success' });
  });
  
  it('should send 400 error if no post id or comment content provided', async () => {
    const mockReq = httpMocks.createRequest<RequestWithUserId>({ id: 1 });
    const mockRes = httpMocks.createResponse<Response>();

    await commentsController.addComment(mockReq, mockRes);

    expect(mockRes._isEndCalled).toBeTruthy();
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._getJSONData()).toEqual({ message: 'Comment content and ID are required.' });
  });
  
  it('should send 400 error if some error occurred', async () => {
    const mockError = new Error('Mock Error');
    mockAddComment.mockRejectedValue(mockError);

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      query: {
        post_id: 1
      },
      body: {
        content: 'mockComment'
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await commentsController.addComment(mockReq, mockRes);

    expect(console.log).toHaveBeenLastCalledWith(mockError.message);
    expect(mockAddComment).toHaveBeenCalledTimes(1);
    expect(mockAddComment).toHaveBeenCalledWith(1, 1, 'mockComment');
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._isEndCalled()).toBeTruthy();
  });
});

describe('delete comment', () => {
  const mockDeleteComment = jest.spyOn(commentsController.commentsService, 'deleteComment');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete comment', async () => {
    mockDeleteComment.mockResolvedValue({ message: 'Success' });

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      query: {
        post_id: 2,
        comment_id: 3
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await commentsController.deleteComment(mockReq, mockRes);

    expect(mockDeleteComment).toHaveBeenCalledTimes(1);
    expect(mockDeleteComment).toHaveBeenCalledWith(2, 1, 3);
    expect(mockRes.statusCode).toBe(200);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({ message: 'Success' });
  });

  it('should send 400 error if no post id or comment id provided', async () => {
    const mockReq = httpMocks.createRequest<RequestWithUserId>({ id: 1 });
    const mockRes = httpMocks.createResponse<Response>();

    await commentsController.deleteComment(mockReq, mockRes);

    expect(mockRes._isEndCalled).toBeTruthy();
    expect(mockRes.statusCode).toBe(400);
  });
  
  it('should send 400 error if some error occurred', async () => {
    const mockError = new Error('Mock Error');
    mockDeleteComment.mockRejectedValue(mockError);

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 3,
      query: {
        post_id: 1,
        comment_id: 2
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await commentsController.deleteComment(mockReq, mockRes);

    expect(console.log).toHaveBeenLastCalledWith(mockError.message);
    expect(mockDeleteComment).toHaveBeenCalledTimes(1);
    expect(mockDeleteComment).toHaveBeenCalledWith(1, 3, 2);
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._isEndCalled()).toBeTruthy();
  });
});