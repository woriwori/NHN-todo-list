import {getElement, isString, isEmptyString} from '@/lib/helper';
import * as domutil from '@/lib/domutil';
import CustomEvents from '@/lib/CustomEvents';
import * as ghost from '@/lib/dnd.ghost';

const dnd = {
  draggable(selector) {
    const dropzoneAttr = selector.getAttribute('dropzone');
    if (isString(dropzoneAttr) && !isEmptyString(dropzoneAttr)) {
      throw Error('dropzone 요소에는 draggable을 설정할 수 없습니다.');
    }

    selector.setAttribute('dnd-draggable', true);
    domutil.on(selector, 'mousedown', (e) => {
      ghost.make(selector, e.pageX, e.pageY);
    });
  },
  dropzone(selector) {
    const element = getElement(selector);

    const draggableAttr = element.getAttribute('dnd-draggable');
    if (isString(draggableAttr) && !isEmptyString(draggableAttr)) {
      throw Error('draggable 요소에는 dropzone을 설정할 수 없습니다.');
    }

    element.setAttribute('dropzone', true);
    CustomEvents.mixin(element);

    return element;
  }
};

export default dnd;
