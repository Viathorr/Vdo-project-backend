import { Todo } from "../../entity/todo.entity";
import { TodosFilter } from "./todosFilteringStrategy";

// Bridge & Strategy pattern
/**
 * Interface for defining todos sorting strategies.
 */
export interface TodosSortingStrategy {
    /**
     * Sets the filter to be applied before sorting.
     * @param filter The filter to be applied.
     */
    setFilter(filter: TodosFilter): void;

    /**
     * Sorts the given array of todos.
     * @param todos The array of todos to be sorted.
     * @returns The sorted array of todos.
     */
    sort(todos: Todo[]): Todo[];
}

/**
 * Abstract class representing a base implementation of the TodosSortingStrategy interface.
 */
abstract class ATodosSortingStrategy implements TodosSortingStrategy {
    protected todosFilter: TodosFilter | null;

     /**
     * Sets the filter to be applied before sorting.
     * @param filter The filter to be applied.
     */
    public setFilter(filter: TodosFilter): void {
        this.todosFilter = filter;
    }

    /**
     * Sorts the given array of todos.
     * @param todos The array of todos to be sorted.
     * @returns The sorted array of todos.
     */
    abstract sort(todos: Todo[]): Todo[];
}

/**
 * Implementation of TodosSortingStrategy for sorting todos by name.
 */
export class TodosSortingByNameStrategy extends ATodosSortingStrategy {
    /**
     * Sorts the given array of todos by name.
     * @param todos The array of todos to be sorted.
     * @returns The sorted array of todos.
     */
    public sort(todos: Todo[]): Todo[] {
        todos = this.todosFilter ? this.todosFilter.filter(todos) : todos;
        todos.sort((a: Todo, b: Todo) => a.name.localeCompare(b.name)); // sort in ascending order A...Z
        return todos;
    }
}

/**
 * Implementation of TodosSortingStrategy for sorting todos by date.
 */
export class TodosSortingByDateStrategy extends ATodosSortingStrategy {
    /**
     * Sorts the given array of todos by date.
     * @param todos The array of todos to be sorted.
     * @returns The sorted array of todos.
     */
    public sort(todos: Todo[]): Todo[] {
        todos = this.todosFilter ? this.todosFilter.filter(todos) : todos;
        todos.sort((a: Todo, b: Todo) => {
            if (a.checked && (!b.checked || b.checked)) {
                return -1; // a comes first if it's checked
            } else if (!a.checked && b.checked) {
                return 1; // b comes first if it's checked and a is not
            } else if (!a.deadline && (!b.deadline || b.deadline)) {
                return 1;
            } else if (a.deadline && !b.deadline) {
                return -1;
            } else {
                return !(a.deadline.getDate() - b.deadline.getDate())
                    ? a.deadline.getTime() - b.deadline.getTime()
                    : a.deadline.getDate() - b.deadline.getDate();
            }
        }
            
        );

        return todos;
    }
}
