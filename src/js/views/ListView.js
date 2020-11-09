import * as domutil from '@/lib/domutil';
import {setHTML} from '@/lib/helper';
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
  }
  clickHandler(e) {
    const el = e.target;
    if (el.classList.contains('check')) {
      const todoId = el.getAttribute('data-id');
      const checked = el.checked;
      this.vm.updateTodo(todoId, checked);
    }
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
    const itemsTemplate = this.vm.todoList.items.map((todo) => this.getTodoItemTemplate(todo));
    return `
    <div class="todo-list">
      <div class="scroll">
        ${itemsTemplate.join('')}
      </div>
    </div>
        `;
  }
  getTodoItemTemplate({id, content, done}) {
    return `
    <div class="item ${done ? 'done' : ''}">
      <span class="title">${content}</span>
      <input class="check" type="checkbox" data-id="${id}" ${done ? 'checked' : ''}/>
    </div>
    `;
  }
}
