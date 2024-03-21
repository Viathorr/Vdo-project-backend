import refreshTokenController from "../refreshToken.controller";
import httpMocks from 'node-mocks-http';
import { Request, Response } from "express";

describe('refreshToken', () => {
  const mockRefreshToken = jest.spyOn(refreshTokenController.authenticationService, 'refreshToken');
  
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully refresh tokens', async () => {
    mockRefreshToken.mockResolvedValue({ accessToken: 'mockAccessToken', refreshToken: 'MockRefreshToken' });
    const mockReq = httpMocks.createRequest<Request>({
      cookies: {
        refreshToken: 'mockRefreshToken'
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await refreshTokenController.refreshToken(mockReq, mockRes);

    expect(mockRefreshToken).toHaveBeenCalledTimes(1);
    expect(mockRefreshToken).toHaveBeenCalledWith('mockRefreshToken');
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes.statusCode).toBe(200);
    expect(mockRes._getJSONData()).toEqual({ accessToken: 'mockAccessToken' });
  });

  it('should send 401 status code if no refreshToken provided', async () => {
    const mockReq = httpMocks.createRequest<Request>();
    const mockRes = httpMocks.createResponse<Response>();

    await refreshTokenController.refreshToken(mockReq, mockRes);

    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes.statusCode).toBe(401);
  });
  
  it('should send 204 status code if any errors occurred', async () => {
    const mockError = new Error('Mock Error');
    mockRefreshToken.mockRejectedValue(mockError);

    const mockReq = httpMocks.createRequest<Request>({
      cookies: {
        refreshToken: 'mockRefreshToken'
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await refreshTokenController.refreshToken(mockReq, mockRes);

    expect(mockRefreshToken).toHaveBeenCalledTimes(1);
    expect(mockRefreshToken).toHaveBeenCalledWith('mockRefreshToken');
    expect(console.log).toHaveBeenCalledWith(mockError.message);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes.statusCode).toBe(403);
  });
});