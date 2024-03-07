import { Todo } from "../../entity/todo.entity";
import { Request, Response, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import RequestWithUserId from "../../interfaces/requestWithUserId.interface";
import TodosService from "../../service/todos/todos.service";
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
    
    this.router.route(`${this.path}/:id`)
      .put(this.updateTodo)
      .delete(this.deleteTodo);
  }

  // URL: http://localhost:3500/todos?page=:page&limit=:limit&s=:sort&f=:filter
  // you can access them by req.query property, e.x. const sortBy = req.query.s;
  private getTodos = async (req: RequestWithUserId, res: Response) => {
    console.log('Get todos request\n');
    const page: number = parseInt(req.query.page as string) || 0;
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

    const todos: Todo[] = await this.todosService.getAllTodos(req.id);
    if (!todos?.length) {
      return res.status(204).json({ 'message': 'No todos were found.' });
    }
    return res.json(todos);
  }

  private addTodo = async (req: RequestWithUserId, res: Response) => {
    console.log('Add todo request.\n');
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ 'message': 'Todo name is required.' });
    }
    try {
      const todo = await this.todosService.addTodo(
        this.todoDtoBuilder.addUserId(req.id).addName(name).build()
      );
      return res.status(201).json(todo);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ 'message': err instanceof Error ? err.message : 'An unexpected error occurred while processing your request.' });
    }
  }

  private updateTodo = async (req: Request, res: Response) => {
    console.log('Update todo request.\n');
    if (!req.params?.id) {
      return res.status(400).json({ 'message': 'Todo ID is required.' });
    }
    // The only thing that can be changed is 'checked' property
    // Later I'll add 'deadline' property, which can be changed as well
    if (!('checked' in req.body)) {
      return res.sendStatus(204);
    }
    try {
      const result = await this.todosService.updateTodo(
        this.todoDtoBuilder.addId(Number(req.params.id)).addChecked(req.body.checked).build()
      );

      return res.json(result);
    } catch (err) {
      console.log(err);
      return res.status(404).json({ 'message': err instanceof Error ? err.message : 'An unexpected error occurred.' });
    }
  }

  private deleteTodo = async (req: Request, res: Response) => {
    console.log('Delete todo request.\n');
    if (!req.params?.id) {
      return res.status(400).json({ 'message': 'Todo ID is required.' });
    }
    try {
      const result = await this.todosService.deleteTodo(
        this.todoDtoBuilder.addId(Number(req.params.id)).build()
      );
      return res.json(result);
    } catch (err) {
      return res.status(404).json({ 'message': err instanceof Error ? err.message : 'An unexpected error has occurred.' });
    }
  }
}

export default new TodosController();