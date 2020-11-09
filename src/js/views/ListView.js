import {setHTML} from '@/lib/helper';
import '@/styles/todo-list/list.scss';

export default class ListView {
  constructor(vm, root) {
    console.log('ListView constructor!');

    this.vm = vm;
    this.vm.addView(this);
    this.root = root;
  }

  // update view
  update(prop) {
    this.render();
  }

  // render
  render() {
    setHTML(this.root, this.getTemplate());
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
  getTodoItemTemplate({content, done}) {
    return `
    <div class="item">
      <span class="title">${content}</span>
      <input class="check" type="checkbox" ${done ? 'checked' : ''}/>
    </div>
    `;
  }
}
