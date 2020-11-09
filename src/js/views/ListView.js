import {setHTML} from '@/lib/helper';
import '@/styles/todo-list/list.scss';

export default class ListView {
  constructor(vm, root) {
    console.log('ListView constructor!');

    this.vm = vm;
    this.root = root;
  }

  // update view
  update(prop) {
    // switch (prop) {
    //   case 'todoList':
    //     this.renderTotal();
    //     break;
    //   case 'viewType':
    //     this.renderBtns();
    //     break;
    // }
  }

  // render
  render() {
    setHTML(this.root, this.getTemplate());
  }

  // view template
  getTemplate() {
    return `
    <div class="todo-list">
      <div class="scroll">
        <div class="item">
          <span class="title">Title</span>
          <input class="check" type="checkbox"/>
        </div>
        <div class="item done">
          <span class="title">Title</span>
          <input class="check" type="checkbox"/>
        </div>
        <div class="item">
          <span class="title">Title</span>
          <input class="check" type="checkbox"/>
        </div>
      </div>
    </div>
        `;
  }
}
