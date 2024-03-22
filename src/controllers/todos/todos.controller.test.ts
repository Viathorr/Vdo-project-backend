import todosController from "./todos.controller";
import httpMocks from 'node-mocks-http';
import { Response } from "express";
import RequestWithUserId from "../../interfaces/requestWithUserId.interface";
import { Todo } from "../../entity/todo.entity";

describe('get all todos', () => {
  const mockGetAllTodos = jest.spyOn(todosController.todosService, 'getAllTodos');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send all todos', async () => {
    mockGetAllTodos.mockResolvedValue({
      todos: [
        {
          id: 1,
          name: 'Todo1',
          checked: true
        } as Todo,
        {
          id: 2,
          name: 'Todo2',
          checked: false
        } as Todo,
        {
          id: 3,
          name: 'Todo3',
          checked: true
        } as Todo
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

    await todosController.getTodos(mockReq, mockRes);

    expect(mockGetAllTodos).toHaveBeenCalledTimes(1);
    expect(mockGetAllTodos).toHaveBeenCalledWith(1, 4, 10);
    expect(mockRes.statusCode).toBe(200);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({
      todos: [
        {
          id: 1,
          name: 'Todo1',
          checked: true
        } as Todo,
        {
          id: 2,
          name: 'Todo2',
          checked: false
        } as Todo,
        {
          id: 3,
          name: 'Todo3',
          checked: true
        } as Todo
      ]
    });
  });
  
  it('should send 204 status code if no todos exist', async () => {
    mockGetAllTodos.mockResolvedValue({
      todos: []
    });

    const mockReq = httpMocks.createRequest<RequestWithUserId>({ id: 1 });
    const mockRes = httpMocks.createResponse<Response>();

    await todosController.getTodos(mockReq, mockRes);

    expect(mockGetAllTodos).toHaveBeenCalledTimes(1);
    expect(mockGetAllTodos).toHaveBeenCalledWith(1, 1, 6);
    expect(mockRes.statusCode).toBe(204);
    expect(mockRes._isEndCalled()).toBeTruthy();
  });
  
  it('should send 404 error if some error occurred', async () => {
    const mockError = new Error('Mock Error');
    mockGetAllTodos.mockRejectedValue(mockError);

    const mockReq = httpMocks.createRequest<RequestWithUserId>();
    const mockRes = httpMocks.createResponse<Response>();

    await todosController.getTodos(mockReq, mockRes);

    expect(console.log).toHaveBeenCalledWith(mockError.message);
    expect(mockRes.statusCode).toBe(404);
    expect(mockRes._isEndCalled()).toBeTruthy();
  });
});

describe('add todo', () => {
  const mockAddTodo = jest.spyOn(todosController.todosService, 'addTodo');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create todo and send it', async () => {
    mockAddTodo.mockResolvedValue(
      {
        id: 1,
        name: 'Todo1',
        checked: false
      }
    );

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      body: {
        name: 'Todo1'
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await todosController.addTodo(mockReq, mockRes);

    expect(mockAddTodo).toHaveBeenCalledTimes(1);
    expect(mockAddTodo).toHaveBeenCalledWith({
      name: 'Todo1',
      deadline: undefined,
      userId: 1
    });
    expect(mockRes.statusCode).toBe(201);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({
      id: 1,
      name: 'Todo1',
      checked: false
    });
  });
  
  it('should send 400 error if no todo name provided', async () => {
    const mockReq = httpMocks.createRequest<RequestWithUserId>({ id: 1 });
    const mockRes = httpMocks.createResponse<Response>();

    await todosController.addTodo(mockReq, mockRes);

    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({ message: 'Todo name is required.' });
  });
  
  it('should send 500 error if some error occurred', async () => {
    const mockError = new Error('Mock Error');
    mockAddTodo.mockRejectedValue(mockError);

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      body: {
        name: 'Todo1'
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await todosController.addTodo(mockReq, mockRes);

    expect(console.log).toHaveBeenLastCalledWith(mockError.message);
    expect(mockRes.statusCode).toBe(500);
    expect(mockRes._getJSONData()).toEqual({ message: mockError.message });
    expect(mockRes._isEndCalled()).toBeTruthy();
  });
});

describe('update todo', () => {
  const mockUpdateTodo = jest.spyOn(todosController.todosService, 'updateTodo');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update todo and send it', async () => {
    mockUpdateTodo.mockResolvedValue(
      {
        id: 1,
        name: 'TodoChanged',
        checked: false
      } as Todo
    );

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      query: {
        id: 1
      },
      body: {
        name: 'TodoChanged'
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await todosController.updateTodo(mockReq, mockRes);

    expect(mockUpdateTodo).toHaveBeenCalledTimes(1);
    expect(mockUpdateTodo).toHaveBeenCalledWith({
      id: 1,
      name: 'TodoChanged',
      deadline: undefined,
      userId: 1
    });
    expect(mockRes.statusCode).toBe(200);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({
      id: 1,
      name: 'TodoChanged',
      checked: false
    });
  });
  
  it('should send 400 error if no todo id provided', async () => {
    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1
    });
    const mockRes = httpMocks.createResponse<Response>();

    await todosController.updateTodo(mockReq, mockRes);

    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({ message: 'Todo ID is required.' });
  });

  it('should send 204 status code if no todo info provided', async () => {
    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      query: {
        id: 1
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await todosController.updateTodo(mockReq, mockRes);

    expect(mockRes.statusCode).toBe(204);
    expect(mockRes._isEndCalled()).toBeTruthy();
  });
  
  it('should send 404 error if some error occurred', async () => {
    const mockError = new Error('Mock Error');
    mockUpdateTodo.mockRejectedValue(mockError);

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      query: {
        id: 1
      },
      body: {
        name: 'TodoChanged'
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await todosController.updateTodo(mockReq, mockRes);

    expect(mockUpdateTodo).toHaveBeenCalledWith({
      id: 1,
      name: 'TodoChanged',
      deadline: undefined,
      userId: 1
    });
    expect(console.log).toHaveBeenLastCalledWith(mockError.message);
    expect(mockRes.statusCode).toBe(404);
    expect(mockRes._getJSONData()).toEqual({ message: 'An unexpected error occurred.' });
    expect(mockRes._isEndCalled()).toBeTruthy();
  });
});

describe('delete todo', () => {
  const mockDeleteTodo = jest.spyOn(todosController.todosService, 'deleteTodo');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete todo and send success message', async () => {
    mockDeleteTodo.mockResolvedValue({ message: 'Success'});

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      query: {
        id: 1
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await todosController.deleteTodo(mockReq, mockRes);

    expect(mockDeleteTodo).toHaveBeenCalled();
    expect(mockDeleteTodo).toHaveBeenCalledWith({
      id: 1,
      userId: 1
    });
    expect(mockRes.statusCode).toBe(200);
    expect(mockRes._getJSONData()).toEqual({ message: 'Success' });
    expect(mockRes._isEndCalled()).toBeTruthy();
  });

  it('should send 400 error if no todo id provided', async () => {
    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1
    });
    const mockRes = httpMocks.createResponse<Response>();

    await todosController.deleteTodo(mockReq, mockRes);

    expect(mockRes.statusCode).toBe(400);
    expect(mockRes._isEndCalled()).toBeTruthy();
    expect(mockRes._getJSONData()).toEqual({ message: 'Todo ID is required.' });
  });

  it('should send 404 error if some error occurred', async () => {
    const mockError = new Error('Mock Error');
    mockDeleteTodo.mockRejectedValue(mockError);

    const mockReq = httpMocks.createRequest<RequestWithUserId>({
      id: 1,
      query: {
        id: 1
      }
    });
    const mockRes = httpMocks.createResponse<Response>();

    await todosController.deleteTodo(mockReq, mockRes);

    expect(mockDeleteTodo).toHaveBeenCalled();
    expect(mockDeleteTodo).toHaveBeenCalledWith({
      id: 1,
      userId: 1
    });
    expect(console.log).toHaveBeenLastCalledWith(mockError.message);
    expect(mockRes.statusCode).toBe(404);
    expect(mockRes._getJSONData()).toEqual({ message: 'An unexpected error has occurred.' });
    expect(mockRes._isEndCalled()).toBeTruthy();
  });
});
