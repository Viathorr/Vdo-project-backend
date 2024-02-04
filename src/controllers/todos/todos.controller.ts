import Todo from "../../model/Todo";
import { Request, Response } from "express";


class TodosController {
  public async getTodos(req: Request, res: Response) {
    const todos = await Todo.find(); // we get an array of todos
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
      const result = await Todo.create({
        id: req.body.id,
        name: req.body.name
      });

      console.log(result);
      return res.status(201).json(result);
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

    const todo = await Todo.findOne({ id: req.params.id }).exec();
    if (!todo) {
      return res.status(404).json({ 'message': `No todo matches ID ${req.params.id}.` });
    }

    if ('checked' in req.body) {
      todo.checked = req.body.checked;
    }

    const result = await todo.save();
    return res.json(result);
  }

  public async deleteTodo(req: Request, res: Response) {
    if (!req.params?.id) {
      return res.status(400).json({ 'message': 'Todo ID is required.' });
    }

    const todo = await Todo.findOne({ id: req.params.id }).exec();
    if (!todo) {
      return res.status(404).json({ 'message': `No todo matches ID ${req.params.id}.` });
    }

    const result = await todo.deleteOne({ id: req.params.id });
    return res.json(result);
  }
}

export default new TodosController();