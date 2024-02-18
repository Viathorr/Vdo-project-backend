import { Todo } from "../../entity/todo.entity";
import { Request, Response, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import RequestWithUserId from "../../interfaces/requestWithUserId.interface";
import TodosService from "../../service/todos.service";


class TodosController implements Controller {
  public path: string = '/todos';
  public router: Router = Router();
  private todosService = new TodosService();
  
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.route(this.path)
      // @ts-ignore
      .get(this.getTodos)
      // @ts-ignore
      .post(this.addTodo);
    
    this.router.route(`${this.path}/:id`)
      .put(this.updateTodo)
      .delete(this.deleteTodo);
  }

  private getTodos = async (req: RequestWithUserId, res: Response) => {
    console.log('Get todos request\n');
    const todos: Todo[] = await this.todosService.getAllTodos(req.id);
    if (!todos?.length) {
      return res.status(204).json({ 'message': 'No todos were found.' });
    }
    return res.json(todos);
  }

  private addTodo = async (req: RequestWithUserId, res: Response) => {
    console.log('Add todo request.\n');
    if (!req.body?.name) {
      return res.status(400).json({ 'message': 'Todo name are required.' });
    }
    try {
      const todo = this.todosService.addTodo({ ...req.body, userId: req.id });
      return res.status(201).json(todo);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ 'message': err instanceof Error ? err.message : 'An unexpected error occurred while processing your request.' });
    }
  }

  private updateTodo = async (req: Request, res: Response) => {
    console.log('Update todo request.\n');
    // The only thing that can be changed is 'checked' property
    if (!req.params?.id) {
      return res.status(400).json({ 'message': 'Todo ID is required.' });
    }

    try {
      const result = await this.todosService.updateTodo({ id: Number(req.params.id), ...req.body });

      return res.json(result);
    } catch (err) {
      console.log(err);
      return res.status(404).json({ 'message': err instanceof Error ? err.message : 'An unexpected error occured.' });
    }
  }

  private deleteTodo = async (req: Request, res: Response) => {
    console.log('Delete todo request.\n');
    if (!req.params?.id) {
      return res.status(400).json({ 'message': 'Todo ID is required.' });
    }
    try {
      // @ts-ignore
      const result = await this.todosService.deleteTodo({ id: Number(req.params.id) });
      return res.json(result);
    } catch (err) {
      return res.status(404).json({ 'message': err instanceof Error ? err.message : 'An unexpected error has occurred.' });
    }
  }
}

export default new TodosController();