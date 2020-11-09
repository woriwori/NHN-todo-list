import {getElement, getElements, isString, isEmptyString} from '@/lib/helper';
import * as domutil from '@/lib/domutil';
import * as ghost from '@/lib/dnd.ghost';

const dnd = {
  draggable(selector) {
    const elements = getElements(selector);

    elements.forEach((el) => {
      const dropzoneAttr = el.getAttribute('dropzone');
      if (isString(dropzoneAttr) && !isEmptyString(dropzoneAttr)) {
        throw Error('dropzone 요소에는 draggable을 설정할 수 없습니다.');
      }

      el.setAttribute('dnd-draggable', true);

      domutil.on(el, 'mousedown', (e) => {
        ghost.make(el, e.pageX, e.pageY);
      });
    });
  },
  dropzone(selector) {
    const element = getElement(selector);

    const draggableAttr = element.getAttribute('dnd-draggable');
    if (isString(draggableAttr) && !isEmptyString(draggableAttr)) {
      throw Error('draggable 요소에는 dropzone을 설정할 수 없습니다.');
    }

    element.setAttribute('dropzone', true);

    return element;
  }
};

export default dnd;
