import * as domutil from '@/lib/domutil';
import dnd from '@/lib/dnd';
import {setHTML, getElement} from '@/lib/helper';
import '@/styles/todo-list/list.scss';

export default class ListView {
  constructor(vm, root) {
    console.log('ListView constructor!');

    this.vm = vm;
    this.vm.addView(this);
    this.root = root;
  }

  // event binding
  bindEvent() {
    domutil.on('.todo-list', 'click', this.clickHandler.bind(this));

    const dropzone = dnd.dropzone('.todo-list');
    domutil.on(dropzone, 'drop', this.dropHandler.bind(this));

    dnd.draggable('.item');
  }
  clickHandler(e) {
    const el = e.target;
    if (el.classList.contains('check')) {
      const todoId = el.parentNode.getAttribute('data-id');
      const checked = el.checked;
      this.vm.updateTodo(todoId, checked);
    }
  }
  dropHandler(e) {
    console.dir(e);
    const todoId = e.detail.target.getAttribute('data-id');
    const index = this.getOrder(todoId);
    this.vm.updateTodoOrder(todoId, index);
  }
  getOrder(todoId) {
    return [...getElement('.todo-list').children].findIndex((todo) => todo.getAttribute('data-id') === todoId);
  }

  // update view
  update(prop) {
    this.render();
  }

  // render
  render() {
    setHTML(this.root, this.getTemplate());

    this.bindEvent();
  }

  // view template
  getTemplate() {
    const filteredTodoList = this.filterByViewType();
    const itemsTemplate = filteredTodoList.map((todo) => this.getTodoItemTemplate(todo));

    return `
    <div class="todo-list">
        ${itemsTemplate.join('')}
    </div>
        `;
  }
  filterByViewType() {
    const {todoList, viewType} = this.vm;
    return todoList.items.filter(({done}) => {
      switch (viewType) {
        case 'all':
          return true;
        case 'todo':
          return !done;
        case 'done':
          return done;
      }
    });
  }
  getTodoItemTemplate({id, content, done}) {
    return `
    <div class="item ${done ? 'done' : ''}" data-id="${id}">
      <span class="title">${content}</span>
      <input class="check" type="checkbox" ${done ? 'checked' : ''}/>
    </div>
    `;
  }
}
