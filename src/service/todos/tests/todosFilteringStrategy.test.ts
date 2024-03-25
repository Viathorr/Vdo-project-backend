import { Todo } from "../../../entity/todo.entity";
import { TodosActiveFilter, TodosCompletedFilter } from "../todosFiltering";

describe('active todos filtering', () => {
  const todosActiveFilter = new TodosActiveFilter();

  it('should filter todos by active state', () => {
    const todos = [
      {
        id: 1,
        name: "Todo1",
        checked: false
      } as Todo,
      {
        id: 2,
        name: "Todo2",
        checked: true
      } as Todo,
      {
        id: 3,
        name: "Todo3",
        checked: false
      } as Todo,
      {
        id: 4,
        name: "Todo4",
        checked: false
      } as Todo,
      {
        id: 5,
        name: "Todo5",
        checked: true
      } as Todo,
    ];

    const filteredTodos = todosActiveFilter.filter(todos);

    expect(filteredTodos).toEqual([
      {
        id: 1,
        name: "Todo1",
        checked: false
      },
      {
        id: 3,
        name: "Todo3",
        checked: false
      },
      {
        id: 4,
        name: "Todo4",
        checked: false
      }
    ]);
  });
});

describe('completed todos filtering', () => {
  const todosCompletedFilter = new TodosCompletedFilter();

  it('should filter todos by completed state', () => {
    const todos = [
      {
        id: 1,
        name: "Todo1",
        checked: false
      } as Todo,
      {
        id: 2,
        name: "Todo2",
        checked: true
      } as Todo,
      {
        id: 3,
        name: "Todo3",
        checked: false
      } as Todo,
      {
        id: 4,
        name: "Todo4",
        checked: false
      } as Todo,
      {
        id: 5,
        name: "Todo5",
        checked: true
      } as Todo,
    ];

    const filteredTodos = todosCompletedFilter.filter(todos);

    expect(filteredTodos).toEqual([
      {
        id: 2,
        name: "Todo2",
        checked: true
      },
      {
        id: 5,
        name: "Todo5",
        checked: true
      }
    ]);
  });
});