import logoutController from "../logout.controller";
import httpMocks from 'node-mocks-http';
import { Request, Response } from "express";

describe('logout', () => {
  const mockLogout = jest.spyOn(logoutController.authenticationService, 'logout');
  
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful logout', async () => {
    mockLogout.mockImplementation(jest.fn());
    const mockReq = httpMocks.createRequest<Request>({
      cookies: {
        refreshToken: 'mockRefreshToken'
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await logoutController.logout(mockReq, mockRes);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockLogout).toHaveBeenCalledWith('mockRefreshToken');
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes.statusCode).toBe(204);
  });

  it('should send 204 status code if no refreshToken provided', async () => {
    const mockReq = httpMocks.createRequest<Request>();
    const mockRes = httpMocks.createResponse<Response>();

    await logoutController.logout(mockReq, mockRes);

    expect(console.log).toHaveBeenCalledWith('no refresh token in request');
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes.statusCode).toBe(204);
  });
  
  it('should send 204 status code if any errors occurred', async () => {
    const mockError = new Error('Mock Error');
    mockLogout.mockRejectedValue(mockError);

    const mockReq = httpMocks.createRequest<Request>({
      cookies: {
        refreshToken: 'mockRefreshToken'
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await logoutController.logout(mockReq, mockRes);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockLogout).toHaveBeenCalledWith('mockRefreshToken');
    expect(console.log).toHaveBeenCalledWith(mockError.message);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes.statusCode).toBe(204);
  });
});