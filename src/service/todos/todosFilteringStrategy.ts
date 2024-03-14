import { Todo } from "../../entity/todo.entity";

// Bridge pattern
/**
 * Interface for defining todos filter method.
 */
export interface TodosFilter {
    /**
     * Filters the given array of todos based on specific criteria.
     * @param todos The array of todos to filter.
     * @returns An array of filtered todos.
     */
    filter(todos: Todo[]): Todo[];
}

/**
 * Implementation of the TodosFilter interface for filtering active todos.
 */
export class TodosActiveFilter implements TodosFilter {
    /**
     * Filters active todos from the given array.
     * @param todos The array of todos to filter.
     * @returns An array containing active todos.
     */
    public filter(todos: Todo[]): Todo[] {
        return todos.filter(todo => !todo.checked);
    }
}
 
/**
 * Implementation of the TodosFilter interface for filtering completed todos.
 */
export class TodosCompletedFilter implements TodosFilter {
    /**
     * Filters completed todos from the given array.
     * @param todos The array of todos to filter.
     * @returns An array containing completed todos.
     */
    public filter(todos: Todo[]): Todo[] {
        return todos.filter(todo => todo.checked);
    }
}