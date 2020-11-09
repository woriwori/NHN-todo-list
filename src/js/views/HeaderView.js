import {setHTML} from '@/lib/helper';
import '@/styles/todo-list/header.scss';

export default class HeaderView {
  constructor(vm, root) {
    console.log('HeaderView constructor!');

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
    <div class="todo-header">
      <div class="btns">
        <div class="btn">전체</div>
        <div class="btn" >완료 전</div>
        <div class="btn" >완료 후</div>
        <div class="line">
          <div class="btn-remove">전체 삭제</div>
        </div>
      </div>
      <div class="total">
        <span class="label">Total</span>
        <span>20</span>
      </div>
    </div>
      `;
  }
}
