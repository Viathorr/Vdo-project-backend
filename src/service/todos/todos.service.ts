import { TodoDto } from "../../dto/todo.dto";
import AppDataSource from "../../config/mysqlConn";
import { Todo } from "../../entity/todo.entity";
import { User } from "../../entity/user.entity";
import {TodosSortingStrategy} from "./todosSortingStrategy";
import {DeleteResult, InsertResult, Repository} from "typeorm";
 
export type getResult = {
  prevPage?: number,
  nextPage?: number,
  todos: Todo[]
};

/**
 * Service class for managing todo operations.
 */
class TodosService {
  private todoRepository: Repository<Todo> = AppDataSource.getRepository(Todo);
  private todosSortingStrategy: TodosSortingStrategy;
  
  /**
   * Sets the sorting strategy for todos.
   * @param sortingStrategy The sorting strategy to be set.
   */
  public setTodosSortingStrategy(sortingStrategy: TodosSortingStrategy): void {
    this.todosSortingStrategy = sortingStrategy;
  }

  /**
   * Retrieves all todos for a given user.
   * @param userId The ID of the user.
   * @param pageNum The page number.
   * @param limit The maximum number of todos to retrieve per page.
   * @returns An object containing todos and pagination information.
   * @throws Error if some error occurred during the database query processing.
   */
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
      throw new Error('An unexpected error occurred while processing your request.');
    }
  }

  /**
   * Adds a new todo.
   * @param todoData The todo DTO containing todo data to be added.
   * @returns A promise that resolves to the newly added todo.
   * @throws Error if some error occurred during the database query processing.
   */
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

  /**
   * Updates an existing todo.
   * @param todoData The todo DTO containing todo data to be updated.
   * @returns A promise that resolves to the updated todo.
   * @throws Error if no todo with the specified ID is found or user ID doesn't match or some error occurred during the database query processing.
   */
  public async updateTodo(todoData: TodoDto) {
    try {
      const todo: Todo | null = await this.todoRepository.findOne({
        where: {
          id: todoData.id,
          creator: { id: todoData.userId }
      }});
      if (!todo) {
        throw new Error(`No todo matches ID ${todoData.id}.`);
      }
 
      const user = await AppDataSource.getRepository(User).findOneBy({ id: todoData.userId });
      if (!user) {
        throw new Error(`User of ID ${todoData.userId} doesn't exist.`);
      }

      if (todoData.checked) {
        user.completed_todos++;
      } else {
        user.completed_todos--;
      }
      await AppDataSource.getRepository(User).save(user);

      this.todoRepository.merge(todo, todoData);
      
      return await this.todoRepository.save(todo);
    } catch (err) {
      throw err;
    }
  }

  /**
   * Deletes an existing todo.
   * @param todoData The todo DTO containing todo data to be deleted.
   * @returns A promise that resolves to the result of the deletion operation.
   * @throws Error if no todo with the specified ID is found or user ID doesn't match or some error occurred during the database query processing.
   */
  public async deleteTodo(todoData: TodoDto) {
    try {
      const todo: Todo | null = await this.todoRepository.findOne({
        where: {
          id: todoData.id,
          creator: { id: todoData.userId }
      }});
      if (!todo) {
        throw new Error(`No todo matches ID ${todoData.id}.`);
      }
      // @ts-ignore
      const result: DeleteResult = await this.todoRepository.delete(todoData.id);
      if (result.affected === 1) {
        return { message: 'Success' };
      } else {
        return { message: 'Fail' };
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export default TodosService;