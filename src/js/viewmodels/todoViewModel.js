import ViewModel from '@/js/viewmodels/proxyViewModel';

export default class todoViewModel extends ViewModel {
  constructor() {
    super();
    this.setData();
    this.proxy = this.getProxy(this);
    return this.proxy;
  }
  setData() {
    this.addData('todoList', [], this.sortTodoList);
    this.addData('viewType', 'all');
  }

  // process data
  sortTodoList(todoList) {
    return todoList.sort((t1, t2) => t2.timestamp - t1.timestamp);
  }

  // data CRUD
  addItem(content) {
    const list = this.proxy.todoList;
    list.push({
      id: new Date().valueOf() + '',
      content,
      done: false,
      timestamp: new Date().valueOf()
    });
    this.proxy.todoList = list;
  }
}
