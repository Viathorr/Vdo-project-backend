import { Todo } from "../../../entity/todo.entity";
import { TodosSortingByNameStrategy, TodosSortingByDateStrategy } from "../todosSortingStrategy";

describe('active todos filtering', () => {
  const todosSortingByNameStrategy = new TodosSortingByNameStrategy();

  it('should sort todos by name', () => {
    const todos = [
      {
        id: 1,
        name: "CTodo1",
        checked: false
      } as Todo,
      {
        id: 2,
        name: "DTodo2",
        checked: true
      } as Todo,
      {
        id: 3,
        name: "ATodo3",
        checked: false
      } as Todo,
      {
        id: 4,
        name: "ETodo4",
        checked: false
      } as Todo,
      {
        id: 5,
        name: "BTodo5",
        checked: true
      } as Todo,
    ];

    const sortedTodos = todosSortingByNameStrategy.sort(todos);

    expect(sortedTodos).toEqual([
      {
        id: 3,
        name: "ATodo3",
        checked: false
      },
      {
        id: 5,
        name: "BTodo5",
        checked: true
      },
      {
        id: 1,
        name: "CTodo1",
        checked: false
      },
      {
        id: 2,
        name: 'DTodo2',
        checked: true
      },
      {
        id: 4,
        name: 'ETodo4',
        checked: false
      }
    ]);
  });
});

describe('should sort todos by deadline date', () => {
  const todosSortingByDateStrategy = new TodosSortingByDateStrategy();

  it('should filter todos by completed state', () => {
    const todos = [
      {
        id: 1,
        name: "Todo1",
        checked: false,
        deadline: new Date(2024, 4, 13, 13, 0, 0, 0)
      } as Todo,
      {
        id: 2,
        name: "Todo2",
        checked: true
      } as Todo,
      {
        id: 3,
        name: "Todo3",
        checked: false,
        deadline: new Date(2024, 4, 14, 13, 0, 0, 0)
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

    const sortedTodos = todosSortingByDateStrategy.sort(todos);

    expect(sortedTodos).toEqual([
      {
        id: 5,
        name: "Todo5",
        checked: true
      },
      {
        id: 2,
        name: "Todo2",
        checked: true
      },
      {
        id: 1,
        name: "Todo1",
        checked: false,
        deadline: new Date(2024, 4, 13, 13, 0, 0, 0)
      }, 
      {
        id: 3,
        name: "Todo3",
        checked: false,
        deadline: new Date(2024, 4, 14, 13, 0, 0, 0)
      },
      {
        id: 4,
        name: "Todo4",
        checked: false
      }
    ]);
  });
});