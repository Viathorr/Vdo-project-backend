import { Todo } from "../../entity/todo.entity";
import { Request, Response } from "express";
import { AppDataSource } from "../../config/mysqlConn";


class TodosController {
  public async getTodos(req: Request, res: Response) {
    const todos: Todo[] = await Todo.find(); // we get an array of todos
    if (!todos?.length) {
      return res.status(204).json({ 'message': 'No todos were found.' });
    }
    return res.json(todos);
  }

  public async addTodo(req: Request, res: Response) {
    if (!req.body?.id || !req.body?.name) {
      return res.status(400).json({ 'message': 'Todo ID and name are required.' });
    }
    try {
      // 1st method (which one to use is up to you)
      // const todo = new Todo({
      //   id: req.body.id,
      //   name: req.body.name
      // });
      // await todo.save();

      // 2nd method
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

  public async updateTodo(req: Request, res: Response) {
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

  public async deleteTodo(req: Request, res: Response) {
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