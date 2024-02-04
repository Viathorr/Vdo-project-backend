import { Router } from "express";
import todosController from "../../controllers/todos/todos.controller";

const todosRouter: Router = Router();

todosRouter.route('/')
  .get(todosController.getTodos)
  .post(todosController.addTodo);
 
todosRouter.route('/:id')
  .put(todosController.updateTodo)
  .delete(todosController.deleteTodo);

export default todosRouter;