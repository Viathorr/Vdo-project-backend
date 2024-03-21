import userController from "./user.controller";
import httpMocks from 'node-mocks-http';
import { Response } from "express";
import RequestWithUserId from "../../interfaces/requestWithUserId.interface";
import { UserDto } from "../../dto/user.dto";

describe('get user info', () => {
  const mockGetUserData = jest.spyOn(userController.userService, 'getUserData');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send user info', async () => {
    mockGetUserData.mockResolvedValue({
      name: 'testName',
      country: 'testCountry'
    } as UserDto);

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1
    });
    const mockRes = httpMocks.createResponse<Response>();

    await userController.getUserInfo(mockReq, mockRes);

    expect(mockGetUserData).toHaveBeenCalledTimes(1);
    expect(mockGetUserData).toHaveBeenCalledWith({ id: 1 });
    expect(mockRes.statusCode).toBe(200);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({
      name: 'testName',
      country: 'testCountry'
    });
  });
  
  it('should send 404 error if no particular user was found', async () => {
    const mockError = new Error('Mock Error');
    mockGetUserData.mockRejectedValue(mockError);

    const mockReq = httpMocks.createRequest<RequestWithUserId>();
    const mockRes = httpMocks.createResponse<Response>();

    await userController.getUserInfo(mockReq, mockRes);

    expect(console.log).toHaveBeenCalledWith(mockError.message);
    expect(mockRes.statusCode).toBe(404);
    expect(mockRes._isEndCalled()).toBeTruthy();
  });
});

describe('change user info', () => {

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send user info', async () => {
    
  });
});

describe('change password', () => {

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send user info', async () => {
    
  });
});

describe('delete account', () => {

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send user info', async () => {
    
  });
});