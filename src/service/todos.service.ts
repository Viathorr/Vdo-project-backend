import CreateTodoDto from "../dto/todo.dto";
import AppDataSource from "../config/mysqlConn";
import { Todo } from "../entity/todo.entity";


class TodosService {
  private todoRepository = AppDataSource.getRepository(Todo);

  // public async getAllTodos(todoData: CreateTodoDto) {
  //   const todos = this.todoRepository.find({ where: { creator:}})
  // }
};

export default TodosService;