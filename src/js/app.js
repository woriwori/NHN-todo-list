import {InputView, HeaderView, ListView} from '@/js/views/index';
import todoViewModel from '@/js/viewmodels/todoViewModel';
import {getElement, setHTML} from '@/lib/helper';
import '@/styles/todo-list/app.scss';

export default class App {
  constructor() {
    this.render();
  }
  render() {
    setHTML(document.body, this.getTemplate());

    const vm = new todoViewModel();
    const input = getElement('#input');
    const header = getElement('#header');
    const list = getElement('#list');

    new InputView(vm, input).render();
    new HeaderView(vm, header).render();
    new ListView(vm, list).render();
  }
  getTemplate() {
    return `
      <div id="root" class="todo">
        <div id="input"></div>
        <div id="header"></div>
        <div id="list"></div>
      </div>
      `;
  }
}
