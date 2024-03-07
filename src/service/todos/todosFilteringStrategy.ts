import { Todo } from "../../entity/todo.entity";

// Bridge pattern
export interface TodosFilter {
    filter(todos: Todo[]): Todo[];
}


export class TodosActiveFilter implements TodosFilter {
    public filter(todos: Todo[]): Todo[] {
        return todos.filter(todo => !todo.checked);
    }
}


export class TodosCompletedFilter implements TodosFilter{
    public filter(todos: Todo[]): Todo[] {
        return todos.filter(todo => todo.checked);
    }
}