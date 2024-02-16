import { CreateTodoDto, UpdateTodoDto } from "../dto/todo.dto";
import AppDataSource from "../config/mysqlConn";
import { Todo } from "../entity/todo.entity";


class TodosService {
  private todoRepository = AppDataSource.getRepository(Todo);

  public async getAllTodos(userId: number) {
    const todos = await this.todoRepository.createQueryBuilder('todos').where('user_id = :userId', { userId }).getMany();
    console.log(todos);
    return todos;
  }

  public async addTodo(todoData: CreateTodoDto) {
    try {
      const todo = await this.todoRepository.createQueryBuilder('todo').insert().into(Todo).values({
        name: todoData.name, creator: {
          id: todoData.userId
        }
      }).execute();
      return todo;
    } catch (err) {
      throw new Error('An unexpected error occurred while processing your request.');
    }
  }

  public async updateTodo(todoData: UpdateTodoDto) {
    const todo = await this.todoRepository.findOneBy({ id: todoData.id });
    if (!todo) {
      throw new Error(`No todo matches ID ${todoData.id}.`);
    }
    if ('checked' in todoData) {
      AppDataSource.getRepository(Todo).merge(todo, todoData);
    }

    const result = await AppDataSource.getRepository(Todo).save(todo);
    return result;
  }

  public async deleteTodo(todoData: UpdateTodoDto) {
    const todo = await AppDataSource.getRepository(Todo).findOneBy({ id: todoData.id });
    if (!todo) {
      throw new Error(`No todo matches ID ${todoData.id}.`);
    }

    const result = await AppDataSource.getRepository(Todo).delete(todoData.id);
    if (result.affected == 1) {
      return { 'status': 'Success' };
    } else {
      return { 'status': 'Fail' };
    }
  }
};

export default TodosService;