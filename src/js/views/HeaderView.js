import * as domutil from '@/lib/domutil';
import {setHTML} from '@/lib/helper';
import '@/styles/todo-list/header.scss';

export default class HeaderView {
  constructor(vm, root) {
    console.log('HeaderView constructor!');

    this.vm = vm;
    this.vm.addView(this);
    this.root = root;
  }

  // event binding
  bindEvent() {
    domutil.on('.btns', 'click', this.clickHandler.bind(this));
  }
  clickHandler(e) {
    const type = e.target.getAttribute('data-type');
    switch (type) {
      case 'all':
      case 'todo':
      case 'done':
        this.vm.updateViewType(type);
        break;
      case 'remove':
        if (confirm('완료된 항목을 모두 삭제하시겠습니까?')) {
          this.vm.removeCompletedTodo();
        }
        break;
    }
  }

  // update view
  update() {
    this.render();
  }

  // render
  render() {
    setHTML(this.root, this.getTemplate());

    this.bindEvent();
  }

  // view template
  getTemplate() {
    const {viewType, todoList} = this.vm;
    const {length} = todoList;
    const completedLength = this.vm.getCompletedTodoListLength();
    console.log(completedLength);
    return `
    <div class="todo-header">
      <div class="btns">
        <div class="btn ${viewType === 'all' ? 'active' : ''}" data-type="all">전체</div>
        <div class="btn ${viewType === 'todo' ? 'active' : ''}" data-type="todo">완료 전</div>
        <div class="btn ${viewType === 'done' ? 'active' : ''}" data-type="done">완료 후</div>
        <div class="line ${viewType === 'done' ? '' : 'hide'} ">
          <div class="btn-remove ${completedLength === 0 ? 'disable' : ''}" data-type="remove">전체 삭제</div>
        </div>
      </div>
      <div class="total">
        <span class="label">Total</span>
        <span>${length}</span>
      </div>
    </div>
      `;
  }
}
