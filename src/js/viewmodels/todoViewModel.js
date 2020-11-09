import ViewModel from '@/js/viewmodels/proxyViewModel';

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
    return {
      ...todoList,
      items: todoList.items.sort((t1, t2) => t2.timestamp - t1.timestamp)
    };
  }

  // data CRUD
  addItem(content) {
    const {items} = this.proxy.todoList;
    items.push({
      id: new Date().valueOf() + '',
      content,
      done: false,
      timestamp: new Date().valueOf()
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
}
