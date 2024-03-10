import { TodoDto } from "../../dto/todo.dto";
import AppDataSource from "../../config/mysqlConn";
import { Todo } from "../../entity/todo.entity";
import {TodosSortingStrategy} from "./todosSortingStrategy";
import {DeleteResult, InsertResult, Repository} from "typeorm";
 
export type getResult = {
  prevPage?: number,
  nextPage?: number,
  todos: Todo[]
};

class TodosService {
  private todoRepository: Repository<Todo> = AppDataSource.getRepository(Todo);
  private todosSortingStrategy: TodosSortingStrategy;
  
  public setTodosSortingStrategy(sortingStrategy: TodosSortingStrategy): void {
    this.todosSortingStrategy = sortingStrategy;
  }

  public async getAllTodos(userId: number, pageNum: number, limit: number) {
    try {
      let todos: Todo[] = await this.todoRepository.createQueryBuilder('todos').where('user_id = :userId',
          { userId }).getMany();
      let result: getResult = {
        todos
      };
      if (todos.length > 0) {
        todos = this.todosSortingStrategy.sort(todos);
        const startIndex: number = (pageNum - 1) * limit;
        const endIndex: number = pageNum * limit;
        if (startIndex > 0) {
          result.prevPage = pageNum - 1;
        }
        if (endIndex < todos.length) {
          result.nextPage = pageNum + 1;
        }
        result.todos = todos.slice(startIndex, endIndex);
      }
      return result;
    } catch (err) {
      console.log(err);
      throw new Error('An unexpected error occurred while processing your request.');
    }
  }

  public async addTodo(todoData: TodoDto) {
    try {
      const todo: InsertResult = await this.todoRepository.createQueryBuilder('todo').insert().into(Todo).values({
        name: todoData.name,
        deadline: todoData.deadline,
        creator: {
          id: todoData.userId
        }
      }).execute();
      return todo.generatedMaps[0];
    } catch (err) {
      console.log(err);
      throw new Error('An unexpected error occurred while processing your request.');
    }
  }

  // TODO add a checking for the user's id
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
      throw err;
    }
  }

  // TODO add a checking for the user's id
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
      throw err;
    }
  }
}

export default TodosService;