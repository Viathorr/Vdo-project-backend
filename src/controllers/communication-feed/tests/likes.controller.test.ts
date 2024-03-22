import likesController from "../likes.controller";
import httpMocks from 'node-mocks-http';
import { Response } from "express";
import RequestWithUserId from "../../../interfaces/requestWithUserId.interface";

describe('add like', () => {
  const mockAddLike = jest.spyOn(likesController.likesService, 'addlike');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add like and send success message', async () => {
    mockAddLike.mockImplementation(jest.fn());

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      query: {
        post_id: 1
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await likesController.addLike(mockReq, mockRes);

    expect(console.log).toHaveBeenCalled();
    expect(mockAddLike).toHaveBeenCalledTimes(1);
    expect(mockAddLike).toHaveBeenCalledWith(1, 1);
    expect(mockRes.statusCode).toBe(200);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({ message: 'Success' });
  });
  
  it('should send 404 error if no post id provided', async () => {
    const mockReq = httpMocks.createRequest<RequestWithUserId>({ id: 1 });
    const mockRes = httpMocks.createResponse<Response>();

    await likesController.addLike(mockReq, mockRes);

    expect(mockRes._isEndCalled).toBeTruthy();
    expect(mockRes.statusCode).toBe(404);
  });
  
  it('should send 400 error if some error occurred', async () => {
    const mockError = new Error('Mock Error');
    mockAddLike.mockRejectedValue(mockError);

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      query: {
        post_id: 1
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await likesController.addLike(mockReq, mockRes);

    expect(console.log).toHaveBeenLastCalledWith(mockError.message);
    expect(mockAddLike).toHaveBeenCalledTimes(1);
    expect(mockAddLike).toHaveBeenCalledWith(1, 1);
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._isEndCalled()).toBeTruthy();
  });
});

describe('delete like', () => {
  const mockDeleteLike = jest.spyOn(likesController.likesService, 'deletelike');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete like', async () => {
    mockDeleteLike.mockResolvedValue({ message: 'Success' });

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      query: {
        post_id: 1
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await likesController.deleteLike(mockReq, mockRes);

    expect(mockDeleteLike).toHaveBeenCalledTimes(1);
    expect(mockDeleteLike).toHaveBeenCalledWith(1, 1);
    expect(mockRes.statusCode).toBe(200);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({ message: 'Success' });
  });

  it('should send 404 error if no post id provided', async () => {
    const mockReq = httpMocks.createRequest<RequestWithUserId>({ id: 1 });
    const mockRes = httpMocks.createResponse<Response>();

    await likesController.deleteLike(mockReq, mockRes);

    expect(mockRes._isEndCalled).toBeTruthy();
    expect(mockRes.statusCode).toBe(404);
  });
  
  it('should send 400 error if some error occurred', async () => {
    const mockError = new Error('Mock Error');
    mockDeleteLike.mockRejectedValue(mockError);

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      query: {
        post_id: 1
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await likesController.deleteLike(mockReq, mockRes);

    expect(console.log).toHaveBeenLastCalledWith(mockError.message);
    expect(mockDeleteLike).toHaveBeenCalledTimes(1);
    expect(mockDeleteLike).toHaveBeenCalledWith(1, 1);
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._isEndCalled()).toBeTruthy();
  });
});