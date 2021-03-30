import * as domutil from '@/lib/domutil';
import {setHTML} from '@/lib/helper';
import '@/styles/todo-list/input.scss';

export default class InputView {
  constructor(vm, root) {
    this.vm = vm;
    this.vm.addView(this);
    this.root = root;
  }

  // update view
  update(updatedProp) {}

  // render
  render() {
    setHTML(this.root, this.getTemplate());

    this.bindEvent();
  }

  // event binding
  bindEvent() {
    domutil.on('.todo-input', 'keydown', this.inputHandler.bind(this));
  }
  inputHandler(e) {
    if (e.keyCode === 13) {
      this.vm.addTodo(e.target.value.trim());
      e.target.value = ''; // clear
    }
  }

  // view template
  getTemplate() {
    return `
      <input class="todo-input" placeholder="할 일을 입력하세요"/>
        `;
  }
}
