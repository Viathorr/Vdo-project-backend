import userController from "./user.controller";
import httpMocks from 'node-mocks-http';
import { Response } from "express";
import RequestWithUserId from "../../interfaces/requestWithUserId.interface";
import { UserDto } from "../../dto/user.dto";
import { User } from "../../entity/user.entity";

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
  const mockChangeUserInfo = jest.spyOn(userController.userService, 'changeUserData');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should change user info', async () => {
    mockChangeUserInfo.mockResolvedValue({
      id: 1,
      name: 'testName',
      country: 'testCountry',
      phone_num: '+0000000000'
    } as User);

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      body: {
        name: 'testName',
        country: 'testCountry',
        phoneNum: '+0000000000'
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await userController.changeUserInfo(mockReq, mockRes);

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(mockChangeUserInfo).toHaveBeenCalledTimes(1);
    expect(mockChangeUserInfo).toHaveBeenCalledWith({
      id: 1,
      name: 'testName',
      country: 'testCountry',
      phoneNum: '+0000000000'
    });
    expect(mockRes.statusCode).toBe(200);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({
      message: 'Success'
    });
  });

  it('should send 204 status code if no user info provided', async () => {
    const mockReq = httpMocks.createRequest<RequestWithUserId>();
    const mockRes = httpMocks.createResponse<Response>();

    await userController.changeUserInfo(mockReq, mockRes);

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenLastCalledWith('No user info to update');
    expect(mockRes.statusCode).toBe(204);
    expect(mockRes._isEndCalled).toBeTruthy();
  });

  it('should send 400 error if some error occurred', async () => {
    const mockError = new Error('Mock Error');
    mockChangeUserInfo.mockRejectedValue(mockError);

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      body: {
        name: 'testName',
        country: 'testCountry',
        phoneNum: '+0000000000'
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await userController.changeUserInfo(mockReq, mockRes);

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenLastCalledWith(mockError.message);
    expect(mockChangeUserInfo).toHaveBeenCalledTimes(1);
    expect(mockChangeUserInfo).toHaveBeenCalledWith({
      id: 1,
      name: 'testName',
      country: 'testCountry',
      phoneNum: '+0000000000'
    });
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._isEndCalled).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({ message: 'Failed to change user info.' });
  });
});

describe('change password', () => {
  const mockChangePassword = jest.spyOn(userController.userService, 'changePassword');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should change user password', async () => {
    mockChangePassword.mockResolvedValue({
      name: 'testName',
      country: 'testCountry'
    } as User);

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      body: {
        currPassword: 'mockCurrPassword',
        newPassword: 'mockNewPassword' 
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await userController.changePassword(mockReq, mockRes);

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(mockChangePassword).toHaveBeenCalledTimes(1);
    expect(mockChangePassword).toHaveBeenLastCalledWith({
      id: 1,
      currPassword: 'mockCurrPassword',
      newPassword: 'mockNewPassword'
    });
    expect(mockRes.statusCode).toBe(201);
    expect(mockRes._getJSONData()).toEqual({ message: 'Success' });
    expect(mockRes._isEndCalled).toBeTruthy();
  });

  it('should send 204 status code if no passwords provided', async () => {
    const mockReq = httpMocks.createRequest<RequestWithUserId>();
    const mockRes = httpMocks.createResponse<Response>();

    await userController.changePassword(mockReq, mockRes);

    expect(mockRes.statusCode).toBe(204);
    expect(mockRes._isEndCalled).toBeTruthy();
  });

  it('should send 400 error if some error occurred', async () => {
    const mockError = new Error('Mock Error');
    mockChangePassword.mockRejectedValue(mockError);

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      body: {
        currPassword: 'mockCurrPassword',
        newPassword: 'mockNewPassword'
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await userController.changePassword(mockReq, mockRes);

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenLastCalledWith(mockError.message);
    expect(mockChangePassword).toHaveBeenCalledTimes(1);
    expect(mockChangePassword).toHaveBeenCalledWith({
      id: 1,
      currPassword: 'mockCurrPassword',
      newPassword: 'mockNewPassword'
    });
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._isEndCalled).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({ message: mockError.message });
  });
});

describe('delete account', () => {
  const mockDelete = jest.spyOn(userController.userService, 'deleteUser');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete user account', async () => {
    mockDelete.mockResolvedValue('Success');

    const mockReq = httpMocks.createRequest<RequestWithUserId>({ id: 1 });
    const mockRes = httpMocks.createResponse<Response>();

    await userController.deleteAccount(mockReq, mockRes);

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith({ id: 1 });
    expect(mockRes.statusCode).toBe(200);
    expect(mockRes._isEndCalled).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({ message: 'Success' });
  });
  
  it('should send 400 error if something went wrong', async () => {
    const mockError = new Error('Mock Error');
    mockDelete.mockRejectedValue(mockError);

    const mockReq = httpMocks.createRequest<RequestWithUserId>({ id: 1 });
    const mockRes = httpMocks.createResponse<Response>();

    await userController.deleteAccount(mockReq, mockRes);

    expect(console.log).toHaveBeenLastCalledWith(mockError.message);
    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith({ id: 1 });
    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._isEndCalled).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({ message: 'Fail' });
  });
});