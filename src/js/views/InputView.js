import {setHTML} from '@/lib/helper';
import '@/styles/todo-list/input.scss';

export default class InputView {
  constructor(vm, root) {
    console.log('InputView constructor!');

    this.vm = vm;
    this.root = root;
  }

  // update view
  //   update(prop) {
  //   }

  // render
  render() {
    setHTML(this.root, this.getTemplate());
  }

  // view template
  getTemplate() {
    return `
      <input class="todo-input" placeholder="할 일을 입력하세요"/>
        `;
  }
}
