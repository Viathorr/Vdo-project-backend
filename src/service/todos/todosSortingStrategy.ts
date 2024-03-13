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
