import ViewModel from '@/js/viewmodels/proxyViewModel';
import {sortAscBy, sortDescBy} from '@/lib/helper';

export default class todoViewModel extends ViewModel {
  constructor() {
    super();
    this.setData();
    this.proxy = this.getProxy(this);
    return this.proxy;
  }
  setData() {
    this.addData('todoList', {items: [], length: 0}, this.sortTodoList);
    this.addData('viewType', 'all');
  }

  // process data
  sortTodoList(todoList) {
    const todos = [];
    const completedTodos = [];
    todoList.items.forEach((todo) => {
      if (todo.done) completedTodos.unshift(todo);
      else todos.push(todo);
    });

    return {
      ...todoList,
      items: [...todos, ...completedTodos]
    };
  }

  // data CRUD
  addTodo(content) {
    const {items} = this.proxy.todoList;
    items.push({
      id: new Date().valueOf() + '',
      content,
      done: false,
      created: new Date().valueOf(),
      updated: 0
    });
    this.proxy.todoList = {
      items,
      length: items.length
    };
  }
  updateTodo(id, done) {
    let {items} = this.proxy.todoList;
    items = items.map((todo) => {
      if (todo.id === id) {
        todo = {...todo, done, updated: new Date().valueOf()};
      }
      return todo;
    });
    this.proxy.todoList = {
      items,
      length: items.length
    };
  }
  removeCompletedTodo() {
    let {items} = this.proxy.todoList;
    items = items.filter((todo) => !todo.done);
    this.proxy.todoList = {
      items,
      length: items.length
    };
  }
  updateViewType(type) {
    this.proxy.viewType = type;
  }
  updateTodoOrder(todoId, index) {
    const todo = this.getTodo(todoId);
    let {items} = this.proxy.todoList;
    items = items.filter((todo) => todo.id !== todoId);
    items.splice(index, 0, todo);
    this.proxy.todoList = {
      items,
      length: items.length
    };
  }
  getTodo(todoId) {
    return this.proxy.todoList.items.find((todo) => todo.id === todoId);
  }
}
