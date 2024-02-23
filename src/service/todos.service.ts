import { TodoDto } from "../dto/todo.dto";
import AppDataSource from "../config/mysqlConn";
import { Todo } from "../entity/todo.entity";


class TodosService {
  private todoRepository = AppDataSource.getRepository(Todo);

  public async getAllTodos(userId: number) {
    const todos = await this.todoRepository.createQueryBuilder('todos').where('user_id = :userId', { userId }).getMany();
    return todos;
  }

  public async addTodo(todoData: TodoDto) {
    try {
      const todo = await this.todoRepository.createQueryBuilder('todo').insert().into(Todo).values({
        name: todoData.name, creator: {
          id: todoData.userId
        }
      }).execute();
      return todo.generatedMaps[0];
    } catch (err) {
      throw new Error('An unexpected error occurred while processing your request.');
    }
  }

  public async updateTodo(todoData: TodoDto) {
    const todo = await this.todoRepository.findOneBy({ id: todoData.id });
    if (!todo) {
      throw new Error(`No todo matches ID ${todoData.id}.`);
    }
    
    this.todoRepository.merge(todo, todoData);
    const result = await this.todoRepository.save(todo);
    return result;
  }
 
  public async deleteTodo(todoData: TodoDto) {
    const todo = await this.todoRepository.findOneBy({ id: todoData.id });
    if (!todo) {
      throw new Error(`No todo matches ID ${todoData.id}.`);
    }
    // @ts-ignore
    const result = await this.todoRepository.delete(todoData.id);
    if (result.affected == 1) {
      return { 'status': 'Success' };
    } else {
      return { 'status': 'Fail' };
    }
  }
};

export default TodosService;