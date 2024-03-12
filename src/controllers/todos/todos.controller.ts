import { Todo } from "../../entity/todo.entity";
import { Request, Response, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import RequestWithUserId from "../../interfaces/requestWithUserId.interface";
import TodosService, {getResult} from "../../service/todos/todos.service";
import { TodoDtoBuilder } from "../../dto/todo.dto";
import {
  TodosSortingByDateStrategy,
  TodosSortingByNameStrategy,
  TodosSortingStrategy
} from "../../service/todos/todosSortingStrategy";
import { TodosActiveFilter, TodosCompletedFilter } from "../../service/todos/todosFilteringStrategy";


class TodosController implements Controller {
  public path: string = '/todos';
  public router: Router = Router();
  private todosService: TodosService = new TodosService();
  private todoDtoBuilder: TodoDtoBuilder = new TodoDtoBuilder();
  
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.route(this.path)
      // @ts-ignore
      .get(this.getTodos)
      // @ts-ignore
      .post(this.addTodo);
    
    this.router.route(this.path)
      // @ts-ignore
      .put(this.updateTodo)
      // @ts-ignore
      .delete(this.deleteTodo);
  }

  // URL: http://localhost:3500/todos?page=:page&limit=:limit&s=:sort&f=:filter
  // you can access them by req.query property, e.x. const sortBy = req.query.s;
  private getTodos = async (req: RequestWithUserId, res: Response) => {
    console.log('Get todos request\n');
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 6;
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

    const result: getResult = await this.todosService.getAllTodos(req.id, page, limit);
    if (!result.todos?.length) {
      return res.status(204).json({ 'message': 'No todos were found.' });
    }
    return res.json(result);
  }

  private addTodo = async (req: RequestWithUserId, res: Response) => {
    console.log('Add todo request.\n');
    console.log('user id:', req.id);
    const { name, deadline } = req.body;
    if (!name) {
      return res.status(400).json({ 'message': 'Todo name is required.' });
    }
    try {
      const todo = await this.todosService.addTodo(
        this.todoDtoBuilder.addUserId(req.id).addName(name).addDeadline(deadline).build()
      );
      return res.status(201).json(todo);
      // return res.sendStatus(201);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ 'message': err instanceof Error ? err.message : 'An unexpected error occurred while processing your request.' });
    }
  }

  // http://localhost:3000/todos?id=:id
  private updateTodo = async (req: RequestWithUserId, res: Response) => {
    console.log('Update todo request.\n');
    if (!req.query?.id) {
      return res.status(400).json({ 'message': 'Todo ID is required.' });
    }
    let todo;
    const { checked, name, deadline } = req.body;
    // Name, checked property or deadline can be changed
    if (!('checked' in req.body) && !name && !deadline) {
      return res.sendStatus(204);
    }

    if ('checked' in req.body) {
      // if todo was updated by clicking on checkbox, then the request will contain only 'checked' value
      todo = this.todoDtoBuilder.addId(Number(req.query.id)).addChecked(checked).addUserId(req.id).build();
    } else {
      // if todo info(name, deadline) was updated, then the request will contain only todo name and deadline with no 'checked' value
      todo = this.todoDtoBuilder.addId(Number(req.query.id)).addName(name).addDeadline(deadline).addUserId(req.id).build();
    }

    try {
      const result = await this.todosService.updateTodo(todo);

      return res.json(result);
    } catch (err) {
      return res.status(404).json({ 'message': err instanceof Error ? err.message : 'An unexpected error occurred.' });
    }
  }

  // http://localhost:3000/todos?id=:id
  private deleteTodo = async (req: RequestWithUserId, res: Response) => {
    console.log('Delete todo request.\n');
    if (!req.query?.id) {
      return res.status(400).json({ 'message': 'Todo ID is required.' });
    }
    try {
      const result = await this.todosService.deleteTodo(
        this.todoDtoBuilder.addId(Number(req.query.id)).addUserId(req.id).build()
      );
      return res.json(result);
    } catch (err) {
      return res.status(404).json({ 'message': err instanceof Error ? err.message : 'An unexpected error has occurred.' });
    }
  }
}

export default new TodosController();