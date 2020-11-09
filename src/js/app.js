import {InputView, HeaderView, ListView} from '@/js/views/index';
import {getElement, setHTML} from '@/lib/helper';
import '@/styles/todo-list/app.scss';

export default class App {
  constructor() {
    this.render();
  }
  render() {
    setHTML(document.body, this.getTemplate());

    const input = getElement('#input');
    const header = getElement('#header');
    const list = getElement('#list');

    new InputView(null, input).render();
    new HeaderView(null, header).render();
    new ListView(null, list).render();
  }
  getTemplate() {
    // const root = getElement('#root');
    return `
      <div id="root" class="todo">
        <div id="input"></div>
        <div id="header"></div>
        <div id="list"></div>
      </div>
      `;
  }
}
