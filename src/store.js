import Todos from "./todos.js";

export const store = {
  state: {
    Todos,
  },
  addTodo(todoTitle) {
    this.state.Todos.push({
      id: this.state.Todos.length + 1,
      title: todoTitle,
      edit: false,
    });
  },
};
