import { Response, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import RequestWithUserId from "../../interfaces/requestWithUserId.interface";
import TodosService, {getResult} from "../../service/todos/todos.service";
import { TodoDtoBuilder } from "../../dto/todo.dto";
import {
  TodosSortingByDateStrategy,
  TodosSortingByNameStrategy,
  TodosSortingStrategy
} from "../../service/todos/todosSortingStrategy";
import { TodosActiveFilter, TodosCompletedFilter } from "../../service/todos/todosFiltering";

/**
 * Controller for handling todo-related operations.
 */
export class TodosController implements Controller {
  public path: string = '/todos';
  public router: Router = Router();
  public todosService: TodosService = new TodosService();
  private todoDtoBuilder: TodoDtoBuilder = new TodoDtoBuilder();
  
  /**
   * Creates an instance of TodosController.
   * Initializes routes.
   */
  constructor() {
    this.initializeRoutes();
  }

  /**
   * Initializes routes for todo operations.
   */
  private initializeRoutes(): void {
    this.router.route(this.path)
      // @ts-ignore
      .get(this.getTodos)
      // @ts-ignore
      .post(this.addTodo)
      // @ts-ignore
      .put(this.updateTodo)
      // @ts-ignore
      .delete(this.deleteTodo);
  }

  /**
   * Handles GET request to retrieve todos.
   * @param req Request object containing user ID, page, limit, sorting, and filtering parameters.
   * @param res Response object for sending the retrieved todos.
   * @returns Resolves with todos data or sends appropriate status codes.
   */
  // URL: http://localhost:3500/todos?page=:page&limit=:limit&s=:sort&f=:filter
  public getTodos = async (req: RequestWithUserId, res: Response) => {
    console.log('Get todos request\n');
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 5;
    const sort: string = req.query.s as string || 'name';
    const filter: string = req.query.f as string || 'all';

    let sortingStrategy: TodosSortingStrategy;
    if (sort === 'name') {
      sortingStrategy = new TodosSortingByNameStrategy();
    } else {
      sortingStrategy = new TodosSortingByDateStrategy();
    }

    if (filter === 'active') {
      sortingStrategy.setFilter(new TodosActiveFilter());
    } else if (filter === 'completed') {
      sortingStrategy.setFilter(new TodosCompletedFilter());
    }

    this.todosService.setTodosSortingStrategy(sortingStrategy);
 
    try {
      const result: getResult = await this.todosService.getAllTodos(req.id, page, limit);
      if (!result.todos?.length) {
        return res.sendStatus(204);
      }
      return res.json(result);
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.sendStatus(404);
    }
  }

  /**
   * Handles POST request to add a new todo.
   * @param req Request object containing user ID and todo details.
   * @param res Response object for sending the added todo.
   * @returns Resolves with the added todo or sends appropriate status codes.
   */
  public addTodo = async (req: RequestWithUserId, res: Response) => {
    console.log('Add todo request.\n');
    const { name, deadline } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Todo name is required.' });
    }
    try {
      const todo = await this.todosService.addTodo(
        this.todoDtoBuilder.addUserId(req.id).addName(name).addDeadline(deadline).build()
      );
      return res.status(201).json(todo);
      // return res.sendStatus(201);
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.status(500).json({ message: err instanceof Error ? err.message : 'An unexpected error occurred while processing your request.' });
    }
  }

  /**
   * Handles PUT request to update an existing todo.
   * @param req Request object containing user ID, todo ID, and updated todo details.
   * @param res Response object for sending the updated todo.
   * @returns Resolves with the updated todo or sends appropriate status codes.
   */
  // http://localhost:3000/todos?id=:id
  public updateTodo = async (req: RequestWithUserId, res: Response) => {
    console.log('Update todo request.\n');
    if (!req.query?.id) {
      return res.status(400).json({ message: 'Todo ID is required.' });
    }
    let todo;
    const { checked, name, deadline } = req.body;
    // Name, checked property or deadline can be changed
    if (!('checked' in req.body) && !name && !deadline) {
      return res.sendStatus(204);
    }

    this.todoDtoBuilder.addId(Number(req.query.id)).addUserId(req.id);

    if ('checked' in req.body) {
      // if todo was updated by clicking on checkbox, then the request will contain only 'checked' value
      this.todoDtoBuilder.addChecked(checked);
    } else {
      // if todo info(name, deadline) was updated, then the request will contain only todo name and deadline with no 'checked' value
      this.todoDtoBuilder.addName(name).addDeadline(deadline);
    }

    todo = this.todoDtoBuilder.build();

    try {
      const result = await this.todosService.updateTodo(todo);

      return res.json(result);
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.status(404).json({ message: 'An unexpected error occurred.' });
    }
  }

  /**
   * Handles DELETE request to delete a todo.
   * @param req Request object containing user ID and todo ID to be deleted.
   * @param res Response object for sending the result of the deletion operation.
   * @returns Resolves with the result of the deletion or sends appropriate status codes.
   */
  // http://localhost:3000/todos?id=:id
  public deleteTodo = async (req: RequestWithUserId, res: Response) => {
    console.log('Delete todo request.\n');
    if (!req.query?.id) {
      return res.status(400).json({ message: 'Todo ID is required.' });
    }
    try {
      const result = await this.todosService.deleteTodo(
        this.todoDtoBuilder.addId(Number(req.query.id)).addUserId(req.id).build()
      );
      return res.json(result);
    } catch (err) {
      console.log(err instanceof Error ? err.message : err);
      return res.status(404).json({ message: 'An unexpected error has occurred.' });
    }
  }
}

export default new TodosController();