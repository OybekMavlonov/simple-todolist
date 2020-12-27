<template>
  <div id="app">
    <div class="container">
      <div class="row">
        <div class="col-12 py-3">
          <h1 class="text-center">My to-dos</h1>
        </div>
      </div>

      <div class="row mb-3 justify-content-center">
        <div class="add-todo col-12 col-sm-10 col-md-8 cl-lg-6">
          <input
            type="text"
            class="text form-control"
            placeholder="Todos"
            v-model="title"
            required
            @keyup.enter="createTodo(title)"
          />
          <button class="submit btn" @click="createTodo(title)">+</button>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-sm-10 col-lg-6">
          <div class="todo-wrapper">
            <h3 class="mb-2 text-center">Uncompleted To-dos</h3>
            <p class="status text-center">
              You have {{ uncompleted.length }} uncompleted task<span v-if="todos.length > 1">s</span>
            </p>
            <transition-group name="todo-item" tag="ul" class="list-group">
              <li
                class="d-flex align-items-center list-group-item"
                v-for="item in uncompleted"
                :key="item.id"
              >
                <span class="todo-text">{{ item.task }}</span>
                <template v-if="item.edit">
                  <input
                    type="text"
                    class="form-control"
                    :placeholder="item.task"
                    v-model="newTitle"
                    @keyup.enter="update(item.id, newTitle)"
                  />
                  <img
                    src="../src/assets/recycle.svg"
                    alt="update"
                    class="update-btn"
                    @click="update(item.id, newTitle)"
                  />
                </template>
                <template v-else>
                  <input
                    class="todo-checkbox"
                    v-bind:id="'item_' + item.id"
                    v-model="item.done"
                    type="checkbox"
                  />
                  <label v-bind:for="'item_' + item.id"></label>
                  <img
                    src="../src/assets/edit.svg"
                    alt="edit"
                    class="edit-btn"
                    @click="edit(item.id)"
                  />

                  <img
                    src="../src/assets/delete.png"
                    alt="delete"
                    class="delete-btn"
                    @click="remove(item.id)"
                  />
                </template>
              </li>
            </transition-group> 
          </div>
        </div>
        <div class="col-12 col-sm-10 col-lg-6" v-if="completed.length >= 0">
          <div class="todo-wrapper">
            <h3 class="mb-2 text-center">Completed To-dos</h3>
            <p class="status text-center">{{ completedPercentage }} tasks completed</p>
            <transition-group name="todo-item" tag="ul" class="list-group archived">
              <li
                class="d-flex align-items-center list-group-item"
                v-for="todo in completed"
                :key="todo.id"
              >
                <span class="todo-text done">{{ todo.task }}</span>
                <input
                  class="todo-checkbox"
                  v-bind:id="'item_' + todo.id"
                  v-model="todo.done"
                  type="checkbox"
                />
                <label v-bind:for="'item_' + todo.id"></label>
                <img
                  src="../src/assets/delete.png"
                  alt="delete"
                  class="delete-btn"
                  @click="remove(todo.id)"
                />
              </li>
            </transition-group>  
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      title: "",
      newTitle: "",
      todos: [
        {
          id: 0,
          task: "Learn Node",
          edit: false,
          done: false
        },
        {
          id: 1,
          task: "Learn Loopback",
          edit: false,
          done: false
        }
      ],
      // completedTodos: []
    };
  },
  mounted() {
    this.getTodos();
  },
  watch: {
    todos: {
      handler(updatedList) {
        localStorage.setItem('todo-list', JSON.stringify(updatedList));
      },
      deep: true
    }
  },
  computed: {
    uncompleted: function() {
      return this.todos.filter(function(task) {
        return !task.done;
      });
    },
    completed: function() {
      return this.todos.filter(function(task) {
        return task.done;
      });
    },
    completedPercentage: function() {
      if (this.completed.length > 0) {
        return (
          Math.floor((this.completed.length / this.todos.length) * 100) + "%"
        );
      }
      else {
        return 0;
      }
    }
  },
  methods: {
    // get all todos when loading the page
    getTodos() {
      if (localStorage.getItem('todo-list')) {
        this.todos = JSON.parse(localStorage.getItem('todo-list'));
      }
    },
    createTodo(todoTitle) {
      if (todoTitle != "") {
        this.todos.push({
          id: this.todos.length,
          task: todoTitle,
          edit: false,
          done: false
        });
        this.title = "";
      }
    },
    edit(taskId) {
      const index = this.todos.findIndex(task => task.id === taskId);
      this.todos[index].edit = true;
    },
    update(taskId, taskTitle) {
      const index = this.todos.findIndex(task => task.id === taskId);
      if (taskTitle != "") {
        this.todos[index].task = taskTitle;
        this.todos[index].edit = false;
      }
      this.newTitle = "";
    },
    remove(taskId) {
      const taskIndex = this.todos.findIndex(task => task.id === taskId);
      // this.todos.splice(taskIndex, 1); in Javascript
      this.$delete(this.todos, taskIndex);
    }
  }
};
</script>

<style lang="scss">
.buttons {
  cursor: pointer;
  height: 25px;
  width: 30px;
  &:hover {
    animation: fadeInUpMy 1s linear infinite;
  }
}
body {
  font-size: 15px;
  font-family: "Open Sans", sans-serif;
  color: #444;
  background-color: #fefefe;
  background-image: linear-gradient(#fc6c48 0%, #ef5081 100%);
  background-repeat: no-repeat;
  background-size: cover;
  padding: 20px;
  margin: 0;
  min-height: 100vh;
  position: relative;
}
.todo-item-enter-active, .todo-item-leave-active {
  transition: opacity ease 0.25s, transform ease-in-out 0.3s;
  transform-origin: left center;
}

/* .todo-item-leave-active below version 2.1.8 */
.todo-item-enter, .todo-item-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

 
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}
/* .slide-fade-leave-active below version 2.1.8 */
.slide-fade-enter, .slide-fade-leave-to {  
  transform: scale(1.1);
  opacity: 0;
}


h1 {
  font-size: 2.5rem;
}
.add-todo {
  display: flex;
  .text {
    font-size: 16px;
    height: 40px;

    &::placeholder {
      color: #aaa;
    }
    &:focus {
      outline: none;
      border: 1px solid #a3b1ff;
      box-shadow: none;
    }
  }
  .number {
    background: #225908;
  }

  .submit {
    width: 50px;
    height: 40px;
    border: none;
    outline: none;
    cursor: pointer;
    background-color: #24a484;
    color: #f3f3f3;
    font-size: 24px;
    line-height: 40px;
    padding: 0;
    margin-left: 13px;

    &:hover {
      background-color: darken($color: #24a484, $amount: 5);
    }

    &:active {
      background-color: lighten($color: #24a484, $amount: 5);
    }
  }
}

.todo-wrapper {
  max-width: 100%;
  min-height: 500px;
  margin: 20px auto 40px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 20px;
  -webkit-box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.05);
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.05);
  background-color: #f4f7fc;
  overflow: hidden;
  position: relative;

  .list-group-item {
    margin: 10px 0;
    padding: 3px;

    .todo-text {
      flex-grow: 1;
      padding: 0 8px;
    }
    .done {
      color: #888;
      text-decoration: line-through;
    }
    .todo-checkbox {
      position: absolute;
      opacity: 0;
      display: none;
    }

    .todo-checkbox + label {
      cursor: pointer;
      margin: 0;
      position: relative;
      width: 20px;
      height: 20px;
      border-radius: 2px;
      border: 1px solid #cfdcec;
      background-color: #fff;
    }

    .todo-checkbox:checked + label:after {
      position: absolute;
      content: "";
      top: 30%;
      left: 50%;
      height: 5px;
      width: 9px;
      border: solid #fc6c48;
      border-width: 0 0 2px 2px;
      transform-origin: center center;
      transform: rotate(-45deg) translate(-50%, -50%);
    }
    .edit-btn {
      margin: 4px 4px 4px 12px;
      @extend .buttons;
    }
    .update-btn {
      margin: 4px 4px 4px 12px;
      @extend .buttons;
    }
    .delete-btn {
      margin: 4px;
      @extend .buttons;

      @keyframes fadeInUpMy {
        from {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
        to {
          transform: scale(1);
        }
      }
    }
  }
}
</style>
