import { Todo } from "../../entity/todo.entity";
import { TodosFilter } from "./todosFilteringStrategy";

// Bridge & Strategy pattern
export interface TodosSortingStrategy {
    setFilter(filter: TodosFilter): void;
    sort(todos: Todo[]): Todo[];
}


abstract class ATodosSortingStrategy implements TodosSortingStrategy {
    protected todosFilter: TodosFilter | null;

    public setFilter(filter: TodosFilter): void {
        this.todosFilter = filter;
    }

    abstract sort(todos: Todo[]): Todo[];
}


export class TodosSortingByNameStrategy extends ATodosSortingStrategy {
    public sort(todos: Todo[]): Todo[] {
        todos = this.todosFilter ? this.todosFilter.filter(todos) : todos;
        todos.sort((a: Todo, b: Todo) => a.name.localeCompare(b.name)); // sort in ascending order A...Z
        return todos;
    }
}


export class TodosSortingByDateStrategy extends ATodosSortingStrategy {
    public sort(todos: Todo[]): Todo[] {
        todos = this.todosFilter ? this.todosFilter.filter(todos) : todos;
        todos.sort((a: Todo, b: Todo) => !(a.deadline.getDate() - b.deadline.getDate())
            ? a.deadline.getTime() - b.deadline.getTime()
            : (a.deadline.getDate() - b.deadline.getDate())
        );

        return todos;
    }
}
