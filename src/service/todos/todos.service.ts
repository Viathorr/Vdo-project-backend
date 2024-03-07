import { TodoDto } from "../../dto/todo.dto";
import AppDataSource from "../../config/mysqlConn";
import { Todo } from "../../entity/todo.entity";
import {TodosSortingStrategy} from "./todosSortingStrategy";
import {DeleteResult, InsertResult, Repository} from "typeorm";


class TodosService {
  private todoRepository: Repository<Todo> = AppDataSource.getRepository(Todo);
  private todosSortingStrategy: TodosSortingStrategy;
  
  public setTodosSortingStrategy(sortingStrategy: TodosSortingStrategy): void {
    this.todosSortingStrategy = sortingStrategy;
  }

  public async getAllTodos(userId: number): Promise<Todo[]> {
    try {
      const todos: Todo[] = await this.todoRepository.createQueryBuilder('todos').where('user_id = :userId', { userId }).getMany();
      this.todosSortingStrategy.sort(todos);
      return todos;
    } catch (err) {
      console.log(err);
      throw new Error('An unexpected error occurred while processing your request.');
    }
  }

  public async addTodo(todoData: TodoDto) {
    try {
      const todo: InsertResult = await this.todoRepository.createQueryBuilder('todo').insert().into(Todo).values({
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
    try {
      const todo: Todo | null = await this.todoRepository.findOneBy({ id: todoData.id });
      if (!todo) {
        throw new Error(`No todo matches ID ${todoData.id}.`);
      }
      
      this.todoRepository.merge(todo, todoData);
      return await this.todoRepository.save(todo);
    } catch (err) {
      console.log(err);
      throw new Error('An unexpected error occurred while processing your request.');
    }
  }
 
  public async deleteTodo(todoData: TodoDto) {
    try {
      const todo: Todo | null = await this.todoRepository.findOneBy({ id: todoData.id });
      if (!todo) {
        throw new Error(`No todo matches ID ${todoData.id}.`);
      }
      // @ts-ignore
      const result: DeleteResult = await this.todoRepository.delete(todoData.id);
      if (result.affected == 1) {
        return { 'status': 'Success' };
      } else {
        return { 'status': 'Fail' };
      }
    } catch (err) {
      console.log(err);
      throw new Error('An unexpected error occurred while processing your request.');
    }
  }
};

export default TodosService;