import { Todo } from "../../entity/todo.entity";
import { Request, Response, Router } from "express";
import Controller from "../../interfaces/controller.interface";
import RequestWithUserId from "../../interfaces/requestWithUserId.interface";
import TodosService from "../../service/todos.service";
import { TodoDto, TodoDtoBuilder } from "../../dto/todo.dto";


class TodosController implements Controller {
  public path: string = '/todos';
  public router: Router = Router();
  private todosService: TodosService = new TodosService();
  private todosBuilder: TodoDtoBuilder = new TodoDtoBuilder();
  
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
      return res.status(400).json({ 'message': 'Todo name is required.' });
    }
    try {
      this.todosBuilder.addUserId(req.id);
      this.todosBuilder.addName(req.body.name);
      const newTodo: TodoDto = this.todosBuilder.build();
      const todo = await this.todosService.addTodo(newTodo);
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
      this.todosBuilder.addId(Number(req.params.id));
      this.todosBuilder.addChecked(req.body.checked);
      const updatedTodo: TodoDto = this.todosBuilder.build();
      const result = await this.todosService.updateTodo(updatedTodo);

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
      this.todosBuilder.addId(Number(req.params.id));
      const todoToDelete = this.todosBuilder.build();
      const result = await this.todosService.deleteTodo(todoToDelete);
      return res.json(result);
    } catch (err) {
      return res.status(404).json({ 'message': err instanceof Error ? err.message : 'An unexpected error has occurred.' });
    }
  }
}

export default new TodosController();