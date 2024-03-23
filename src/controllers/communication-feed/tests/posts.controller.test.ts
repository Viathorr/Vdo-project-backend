import postsController from "../posts.controller";
import httpMocks from 'node-mocks-http';
import { Response } from "express";
import RequestWithUserId from "../../../interfaces/requestWithUserId.interface";
import { postInfo } from "../../../service/communication-feed/posts.service";

describe('get all posts', () => {
  const mockGetAllposts = jest.spyOn(postsController.postsService, 'getAllPosts');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send all posts', async () => {
    mockGetAllposts.mockResolvedValue({
      posts: [
        {
          id: 1,
          content: 'Post1',
          username: 'User1',
          likes: 2,
          comments: 3
        } as postInfo,
        {
          id: 2,
          content: 'Post2',
          username: 'User2',
          likes: 5,
          comments: 4
        } as postInfo,
        {
          id: 3,
          content: 'Post3',
          username: 'User3',
          likes: 8,
          comments: 1
        } as postInfo
      ]
    });

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      query: {
        page: 4,
        limit: 10
      }
    });
    const mockRes = httpMocks.createResponse<Response>();
 
    await postsController.getPosts(mockReq, mockRes);

    expect(mockGetAllposts).toHaveBeenCalledTimes(1);
    expect(mockGetAllposts).toHaveBeenCalledWith(1, 4, 10);
    expect(mockRes.statusCode).toBe(200);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({
      posts: [
        {
          id: 1,
          content: 'Post1',
          username: 'User1',
          likes: 2,
          comments: 3
        } as postInfo,
        {
          id: 2,
          content: 'Post2',
          username: 'User2',
          likes: 5,
          comments: 4
        } as postInfo,
        {
          id: 3,
          content: 'Post3',
          username: 'User3',
          likes: 8,
          comments: 1
        } as postInfo
      ]
    });
  });
  
  it('should send 204 status code if no posts exist', async () => {
    mockGetAllposts.mockResolvedValue({
      posts: []
    });

    const mockReq = httpMocks.createRequest<RequestWithUserId>({ id: 1 });
    const mockRes = httpMocks.createResponse<Response>();

    await postsController.getPosts(mockReq, mockRes);

    expect(mockGetAllposts).toHaveBeenCalledTimes(1);
    expect(mockGetAllposts).toHaveBeenCalledWith(1, 1, 10);
    expect(mockRes.statusCode).toBe(204);
    expect(mockRes._isEndCalled()).toBeTruthy();
  });
  
  it('should send 404 error if some error occurred', async () => {
    const mockError = new Error('Mock Error');
    mockGetAllposts.mockRejectedValue(mockError);

    const mockReq = httpMocks.createRequest<RequestWithUserId>({ id: 1 });
    const mockRes = httpMocks.createResponse<Response>();

    await postsController.getPosts(mockReq, mockRes);

    expect(console.log).toHaveBeenCalledWith(mockError.message);
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._isEndCalled()).toBeTruthy();
  });
});

describe('get all user posts', () => {
  const mockGetUsersPosts = jest.spyOn(postsController.postsService, 'getUsersPosts');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send all posts', async () => {
    mockGetUsersPosts.mockResolvedValue({
      posts: [
        {
          id: 1,
          content: 'Post1',
          username: 'User1',
          likes: 2,
          comments: 3
        } as postInfo,
        {
          id: 2,
          content: 'Post2',
          username: 'User1',
          likes: 5,
          comments: 4
        } as postInfo,
        {
          id: 3,
          content: 'Post3',
          username: 'User1',
          likes: 8,
          comments: 1
        } as postInfo
      ]
    });

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      query: {
        page: 4,
        limit: 10
      }
    });
    const mockRes = httpMocks.createResponse<Response>();
 
    await postsController.getUserPosts(mockReq, mockRes);

    expect(mockGetUsersPosts).toHaveBeenCalledTimes(1);
    expect(mockGetUsersPosts).toHaveBeenCalledWith(1, 4, 10);
    expect(mockRes.statusCode).toBe(200);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({
      posts: [
        {
          id: 1,
          content: 'Post1',
          username: 'User1',
          likes: 2,
          comments: 3
        } as postInfo,
        {
          id: 2,
          content: 'Post2',
          username: 'User1',
          likes: 5,
          comments: 4
        } as postInfo,
        {
          id: 3,
          content: 'Post3',
          username: 'User1',
          likes: 8,
          comments: 1
        } as postInfo
      ]
    });
  });
  
  it('should send 204 status code if no posts exist', async () => {
    mockGetUsersPosts.mockResolvedValue({
      posts: []
    });

    const mockReq = httpMocks.createRequest<RequestWithUserId>({ id: 1 });
    const mockRes = httpMocks.createResponse<Response>();

    await postsController.getUserPosts(mockReq, mockRes);

    expect(mockGetUsersPosts).toHaveBeenCalledTimes(1);
    expect(mockGetUsersPosts).toHaveBeenCalledWith(1, 1, 10);
    expect(mockRes.statusCode).toBe(204);
    expect(mockRes._isEndCalled()).toBeTruthy();
  });
  
  it('should send 404 error if some error occurred', async () => {
    const mockError = new Error('Mock Error');
    mockGetUsersPosts.mockRejectedValue(mockError);

    const mockReq = httpMocks.createRequest<RequestWithUserId>({ id: 1 });
    const mockRes = httpMocks.createResponse<Response>();

    await postsController.getUserPosts(mockReq, mockRes);

    expect(console.log).toHaveBeenCalledWith(mockError.message);
    expect(mockGetUsersPosts).toHaveBeenCalledWith(1, 1, 10);
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._isEndCalled()).toBeTruthy();
  });
});

describe('get all saved posts', () => {
  const mockGetSavedPosts = jest.spyOn(postsController.postsService, 'getSavedPosts');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send all posts', async () => {
    mockGetSavedPosts.mockResolvedValue({
      posts: [
        {
          id: 1,
          content: 'Post1',
          username: 'User1',
          likes: 2,
          comments: 3
        } as postInfo,
        {
          id: 2,
          content: 'Post2',
          username: 'User2',
          likes: 5,
          comments: 4
        } as postInfo,
        {
          id: 3,
          content: 'Post3',
          username: 'User3',
          likes: 8,
          comments: 1
        } as postInfo
      ]
    });

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      query: {
        page: 4,
        limit: 10
      }
    });
    const mockRes = httpMocks.createResponse<Response>();
 
    await postsController.getSavedPosts(mockReq, mockRes);

    expect(mockGetSavedPosts).toHaveBeenCalledTimes(1);
    expect(mockGetSavedPosts).toHaveBeenCalledWith(1, 4, 10);
    expect(mockRes.statusCode).toBe(200);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({
      posts: [
        {
          id: 1,
          content: 'Post1',
          username: 'User1',
          likes: 2,
          comments: 3
        } as postInfo,
        {
          id: 2,
          content: 'Post2',
          username: 'User2',
          likes: 5,
          comments: 4
        } as postInfo,
        {
          id: 3,
          content: 'Post3',
          username: 'User3',
          likes: 8,
          comments: 1
        } as postInfo
      ]
    });
  });
  
  it('should send 204 status code if no posts exist', async () => {
    mockGetSavedPosts.mockResolvedValue({
      posts: []
    });

    const mockReq = httpMocks.createRequest<RequestWithUserId>({ id: 1 });
    const mockRes = httpMocks.createResponse<Response>();

    await postsController.getSavedPosts(mockReq, mockRes);

    expect(mockGetSavedPosts).toHaveBeenCalledTimes(1);
    expect(mockGetSavedPosts).toHaveBeenCalledWith(1, 1, 10);
    expect(mockRes.statusCode).toBe(204);
    expect(mockRes._isEndCalled()).toBeTruthy();
  });
  
  it('should send 404 error if some error occurred', async () => {
    const mockError = new Error('Mock Error');
    mockGetSavedPosts.mockRejectedValue(mockError);

    const mockReq = httpMocks.createRequest<RequestWithUserId>({ id: 1 });
    const mockRes = httpMocks.createResponse<Response>();

    await postsController.getSavedPosts(mockReq, mockRes);

    expect(console.log).toHaveBeenCalledWith(mockError.message);
    expect(mockGetSavedPosts).toHaveBeenCalledWith(1, 1, 10);
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._isEndCalled()).toBeTruthy();
  });
});

describe('get post', () => {
  const mockGetPost = jest.spyOn(postsController.postsService, 'getPost');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send post info', async () => {
    
  });
});

// describe('add Post', () => {
//   const mockAddPost = jest.spyOn(postsController.postsService, 'addPost');

//   beforeEach(() => {
//     jest.spyOn(console, 'log').mockImplementation(() => { });
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should create Post and send it', async () => {
//     mockAddPost.mockResolvedValue(
//       {
//         id: 1,
//         content: 'Post1',
//         checked: false
//       }
//     );

//     const mockReq = httpMocks.createRequest<RequestWithUserId>({
//       id: 1,
//       body: {
//         content: 'Post1'
//       }
//     });
//     const mockRes = httpMocks.createResponse<Response>();

//     await postsController.addPost(mockReq, mockRes);

//     expect(mockAddPost).toHaveBeenCalledTimes(1);
//     expect(mockAddPost).toHaveBeenCalledWith({
//       content: 'Post1',
//       deadline: undefined,
//       userId: 1
//     });
//     expect(mockRes.statusCode).toBe(201);
//     expect(mockRes._isEndCalled()).toBeTruthy();
//     expect(mockRes._getJSONData()).toEqual({
//       id: 1,
//       content: 'Post1',
//       checked: false
//     });
//   });
  
//   it('should send 400 error if no Post content provided', async () => {
//     const mockReq = httpMocks.createRequest<RequestWithUserId>({ id: 1 });
//     const mockRes = httpMocks.createResponse<Response>();

//     await postsController.addPost(mockReq, mockRes);

//     expect(mockRes.statusCode).toBe(400);
//     expect(mockRes._isEndCalled()).toBeTruthy();
//     expect(mockRes._getJSONData()).toEqual({ message: 'Post content is required.' });
//   });
  
//   it('should send 500 error if some error occurred', async () => {
//     const mockError = new Error('Mock Error');
//     mockAddPost.mockRejectedValue(mockError);

//     const mockReq = httpMocks.createRequest<RequestWithUserId>({
//       id: 1,
//       body: {
//         content: 'Post1'
//       }
//     });
//     const mockRes = httpMocks.createResponse<Response>();

//     await postsController.addPost(mockReq, mockRes);

//     expect(console.log).toHaveBeenLastCalledWith(mockError.message);
//     expect(mockRes.statusCode).toBe(500);
//     expect(mockRes._getJSONData()).toEqual({ message: mockError.message });
//     expect(mockRes._isEndCalled()).toBeTruthy();
//   });
// });

// describe('update Post', () => {
//   const mockUpdatePost = jest.spyOn(postsController.postService, 'updatePost');

//   beforeEach(() => {
//     jest.spyOn(console, 'log').mockImplementation(() => { });
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should update Post and send it', async () => {
//     mockUpdatePost.mockResolvedValue(
//       {
//         id: 1,
//         content: 'PostChanged',
//         checked: false
//       } as Post
//     );

//     const mockReq = httpMocks.createRequest<RequestWithUserId>({
//       id: 1,
//       query: {
//         id: 1
//       },
//       body: {
//         content: 'PostChanged'
//       }
//     });
//     const mockRes = httpMocks.createResponse<Response>();

//     await postsController.updatePost(mockReq, mockRes);

//     expect(mockUpdatePost).toHaveBeenCalledTimes(1);
//     expect(mockUpdatePost).toHaveBeenCalledWith({
//       id: 1,
//       content: 'PostChanged',
//       deadline: undefined,
//       userId: 1
//     });
//     expect(mockRes.statusCode).toBe(200);
//     expect(mockRes._isEndCalled()).toBeTruthy();
//     expect(mockRes._getJSONData()).toEqual({
//       id: 1,
//       content: 'PostChanged',
//       checked: false
//     });
//   });
  
//   it('should send 400 error if no Post id provided', async () => {
//     const mockReq = httpMocks.createRequest<RequestWithUserId>({
//       id: 1
//     });
//     const mockRes = httpMocks.createResponse<Response>();

//     await postsController.updatePost(mockReq, mockRes);

//     expect(mockRes.statusCode).toBe(400);
//     expect(mockRes._isEndCalled()).toBeTruthy();
//     expect(mockRes._getJSONData()).toEqual({ message: 'Post ID is required.' });
//   });

//   it('should send 204 status code if no Post info provided', async () => {
//     const mockReq = httpMocks.createRequest<RequestWithUserId>({
//       id: 1,
//       query: {
//         id: 1
//       }
//     });
//     const mockRes = httpMocks.createResponse<Response>();

//     await postsController.updatePost(mockReq, mockRes);

//     expect(mockRes.statusCode).toBe(204);
//     expect(mockRes._isEndCalled()).toBeTruthy();
//   });
  
//   it('should send 404 error if some error occurred', async () => {
//     const mockError = new Error('Mock Error');
//     mockUpdatePost.mockRejectedValue(mockError);

//     const mockReq = httpMocks.createRequest<RequestWithUserId>({
//       id: 1,
//       query: {
//         id: 1
//       },
//       body: {
//         content: 'PostChanged'
//       }
//     });
//     const mockRes = httpMocks.createResponse<Response>();

//     await postsController.updatePost(mockReq, mockRes);

//     expect(mockUpdatePost).toHaveBeenCalledWith({
//       id: 1,
//       content: 'PostChanged',
//       deadline: undefined,
//       userId: 1
//     });
//     expect(console.log).toHaveBeenLastCalledWith(mockError.message);
//     expect(mockRes.statusCode).toBe(404);
//     expect(mockRes._getJSONData()).toEqual({ message: 'An unexpected error occurred.' });
//     expect(mockRes._isEndCalled()).toBeTruthy();
//   });
// });

// describe('delete Post', () => {
//   const mockDeletePost = jest.spyOn(postsController.postService, 'deletePost');

//   beforeEach(() => {
//     jest.spyOn(console, 'log').mockImplementation(() => { });
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should delete Post and send success message', async () => {
//     mockDeletePost.mockResolvedValue({ message: 'Success'});

//     const mockReq = httpMocks.createRequest<RequestWithUserId>({
//       id: 1,
//       query: {
//         id: 1
//       }
//     });
//     const mockRes = httpMocks.createResponse<Response>();

//     await postsController.deletePost(mockReq, mockRes);

//     expect(mockDeletePost).toHaveBeenCalled();
//     expect(mockDeletePost).toHaveBeenCalledWith({
//       id: 1,
//       userId: 1
//     });
//     expect(mockRes.statusCode).toBe(200);
//     expect(mockRes._getJSONData()).toEqual({ message: 'Success' });
//     expect(mockRes._isEndCalled()).toBeTruthy();
//   });

//   it('should send 400 error if no Post id provided', async () => {
//     const mockReq = httpMocks.createRequest<RequestWithUserId>({
//       id: 1
//     });
//     const mockRes = httpMocks.createResponse<Response>();

//     await postsController.deletePost(mockReq, mockRes);

//     expect(mockRes.statusCode).toBe(400);
//     expect(mockRes._isEndCalled()).toBeTruthy();
//     expect(mockRes._getJSONData()).toEqual({ message: 'Post ID is required.' });
//   });

//   it('should send 404 error if some error occurred', async () => {
//     const mockError = new Error('Mock Error');
//     mockDeletePost.mockRejectedValue(mockError);

//     const mockReq = httpMocks.createRequest<RequestWithUserId>({
//       id: 1,
//       query: {
//         id: 1
//       }
//     });
//     const mockRes = httpMocks.createResponse<Response>();

//     await postsController.deletePost(mockReq, mockRes);

//     expect(mockDeletePost).toHaveBeenCalled();
//     expect(mockDeletePost).toHaveBeenCalledWith({
//       id: 1,
//       userId: 1
//     });
//     expect(console.log).toHaveBeenLastCalledWith(mockError.message);
//     expect(mockRes.statusCode).toBe(404);
//     expect(mockRes._getJSONData()).toEqual({ message: 'An unexpected error has occurred.' });
//     expect(mockRes._isEndCalled()).toBeTruthy();
//   });
// });


