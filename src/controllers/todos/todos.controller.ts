import { Todo } from "../../entity/todo.entity";
import { Request, Response, Router } from "express";
import AppDataSource from "../../config/mysqlConn";
import Controller from "../../interfaces/controller.interface";
import RequestWithUserId from "../../interfaces/requestWithUserId.interface";
import TodosService from "../../service/todos.service";

// TODO create todosService to handle database interactions

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

  private async getTodos(req: RequestWithUserId, res: Response) {
    // const todos: Todo[] = await Todo.find(); // we get an array of todos
    const todos: Todo[] = await AppDataSource.getRepository(Todo).createQueryBuilder('todos').where('user_id = :userId', { userId: req.id }).getMany();
    console.log(todos);
    if (!todos?.length) {
      return res.status(204).json({ 'message': 'No todos were found.' });
    }
    return res.json(todos);
  }

  private async addTodo(req: RequestWithUserId, res: Response) {
    if (!req.body?.id || !req.body?.name) {
      return res.status(400).json({ 'message': 'Todo ID and name are required.' });
    }
    try {
      const todo = Todo.create({
        id: req.body.id,
        name: req.body.name
      });

      await todo.save();

      console.log(todo);
      return res.status(201).json(todo);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ 'message': 'An unexpected error occurred while processing your request.' });
    }
  }

  private async updateTodo(req: Request, res: Response) {
    // The only thing that can be changed is 'checked' property
    if (!req.params?.id) {
      return res.status(400).json({ 'message': 'Todo ID is required.' });
    }

    const todo = await AppDataSource.getRepository(Todo).findOneBy({ id: Number(req.params.id) });
    if (!todo) {
      return res.status(404).json({ 'message': `No todo matches ID ${req.params.id}.` });
    }

    if ('checked' in req.body) {
      // todo.checked = req.body.checked;
      AppDataSource.getRepository(Todo).merge(todo, req.body);
    }

    const result = await AppDataSource.getRepository(Todo).save(todo);
    return res.json(result);
  }

  private async deleteTodo(req: Request, res: Response) {
    if (!req.params?.id) {
      return res.status(400).json({ 'message': 'Todo ID is required.' });
    }

    const todo = await AppDataSource.getRepository(Todo).findOneBy({ id: Number(req.params.id) });
    if (!todo) {
      return res.status(404).json({ 'message': `No todo matches ID ${req.params.id}.` });
    }

    const result = await AppDataSource.getRepository(Todo).delete(req.params.id);
    return res.json(result);
  }
}

export default new TodosController();