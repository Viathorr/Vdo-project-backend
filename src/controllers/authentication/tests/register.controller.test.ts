import registerController from "../register.controller";
import httpMocks from 'node-mocks-http';
import { Request, Response } from "express";

describe('registration', () => {
  const mockRegister = jest.spyOn(registerController.authenticationService, 'register');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle registration with valid credentials', async () => {
    const mockToken = { accessToken: 'mockAccessToken', refreshToken: 'mockRefreshToken' };
    mockRegister.mockResolvedValue(mockToken);

    const mockReq = httpMocks.createRequest<Request>({
      body: {
        name: 'test',
        email: 'test@example.com',
        password: 'password'
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await registerController.register(mockReq, mockRes);

    expect(mockRegister).toHaveBeenCalledTimes(1);
    expect(mockRegister).toHaveBeenCalledWith({ name: 'test', email: 'test@example.com', currPassword: 'password' });
    expect(mockRes.statusCode).toBe(201);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({ accessToken: 'mockAccessToken' });
  });

  it('should send 400 error if no email, name or password provided', async () => {
    const mockReq = httpMocks.createRequest<Request>();
    const mockRes = httpMocks.createResponse<Response>();

    await registerController.register(mockReq, mockRes);

    expect(mockRes.statusCode).toBe(400); 
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({ message: 'Username, email and password are required.' }); 
  });

  it('should send 401 error if invalid credentials', async () => {
    const mockError = new Error('Mock Error');
    mockRegister.mockRejectedValue(mockError);

    jest.spyOn(console, 'log').mockImplementation(() => {});

    const mockReq = httpMocks.createRequest<Request>({
      body: {
        name: 'test',
        email: 'test@example.com',
        password: 'password'
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await registerController.register(mockReq, mockRes);

    expect(mockRegister).toHaveBeenCalledTimes(1);
    expect(mockRegister).toHaveBeenCalledWith({ name: 'test', email: 'test@example.com', currPassword: 'password' });
    expect(console.log).toHaveBeenCalledWith(mockError.message);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes.statusCode).toBe(500);
  })
});