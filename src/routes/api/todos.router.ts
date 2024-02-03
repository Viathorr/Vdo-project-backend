import { Router } from "express";
import todosController from "../../controllers/todos/todos.controller";

const todosRouter: Router = Router();

todosRouter.route('/')
  .get()
  .post()
  .delete();

todosRouter.route('/:id')
  .put();

export default todosRouter;