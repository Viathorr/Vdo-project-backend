import authController from "../auth.controller";
import httpMocks from 'node-mocks-http';
import { Request, Response } from "express";

describe('authentication', () => {
  const mockLogin = jest.spyOn(authController.authenticationService, 'login');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle authentication with valid credentials', async () => {
    const mockToken = { accessToken: 'mockAccessToken', refreshToken: 'mockRefreshToken' };
    mockLogin.mockResolvedValue(mockToken);

    const mockReq = httpMocks.createRequest<Request>({ body: { email: 'test@example.com', password: 'password' } });
    const mockRes = httpMocks.createResponse<Response>();

    await authController.authenticate(mockReq, mockRes);

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', currPassword: 'password' });
    expect(mockRes.statusCode).toBe(200);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({ accessToken: 'mockAccessToken' });
  });

  it('should send 400 error if no email or password provided', async () => {
    const mockReq = httpMocks.createRequest<Request>();
    const mockRes = httpMocks.createResponse<Response>();

    await authController.authenticate(mockReq, mockRes);

    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({ message: 'Email and password are required.' });
  });

  it('should send 401 error if invalid credentials', async () => {
    const mockError = new Error('Mock Error');
    mockLogin.mockRejectedValue(mockError);

    jest.spyOn(console, 'log').mockImplementation(() => { });

    const mockReq = httpMocks.createRequest<Request>({ body: { email: 'test@example.com', password: 'password' } });
    const mockRes = httpMocks.createResponse<Response>();

    await authController.authenticate(mockReq, mockRes);

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', currPassword: 'password' });
    expect(console.log).toHaveBeenCalledWith(mockError.message);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes.statusCode).toBe(401);
  });
});