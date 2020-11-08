import {getElement, isElement, isElements, insertNodeAfter, insertNodeBefore} from '@/lib/helper';
import '@/styles/dnd.ghost.scss';

const ERROR_CODE = {
  E01: 'dropzone이 아닙니다.'
};
let debounce = null;
let clickedLeft = 0;
let clickedTop = 0;
let originElement = null;
let ghost = null;
let ghostShadow = null;
let isContain = false;

export function make(selector, x, y) {
  create(selector, x, y).then(ready).then(execute);
}

async function create(selector, x, y) {
  originElement = getElement(selector);

  const {top, left} = originElement.getBoundingClientRect();
  clickedLeft = x - left;
  clickedTop = y - top;

  ghost = clone(originElement);
  ghostShadow = clone(originElement);

  initializeGhost();
  initializeGhostShadow();

  originElement.classList.add('dnd-hidden-origin');
}

async function ready() {
  ghost.addEventListener('mousedown', () => {
    document.body.append(ghost);
    ghost.addEventListener('mouseup', handleMouseUp);

    document.addEventListener('mousemove', setPosition);
  });
}

export function execute() {
  ghost.dispatchEvent(new Event('mousedown'));
}

function finish(event) {
  if (!isContain) throw Error(ERROR_CODE.E01);

  const dropzone = getDropzone(event.clientX, event.clientY);
  const dropEvent = getDropEvent();

  dropzone.replaceChild(originElement, ghostShadow); // ghostShadow를 originElement로 변경
  dropzone.dispatchEvent(dropEvent);

  destroy(); // ghost 초기화
}

function destroy() {
  originElement.classList.remove('dnd-hidden-origin');
  ghost.parentNode.removeChild(ghost);
  if (isElement(ghostShadow.parentNode)) ghostShadow.parentNode.removeChild(ghostShadow);

  originElement = null;
  ghost = null;
  ghostShadow = null;
}

function initializeGhost() {
  ghost.classList.add('dnd-ghost');
}

function initializeGhostShadow() {
  ghostShadow.classList.add('dnd-none');
  ghostShadow.classList.add('dnd-shadow');
}

function handleMouseUp(event) {
  document.removeEventListener('mousemove', setPosition);
  ghost.removeEventListener('mouseup', handleMouseUp);

  try {
    finish(event);
  } catch (error) {
    // dropzone이 아닌 곳에서 mouseup이 발생한 경우 drag 취소
    if (error.message === ERROR_CODE.E01) destroy();
  }
}

function setPosition(event) {
  const {pageX, pageY} = event;
  ghost.style.left = `${pageX - clickedLeft}px`;
  ghost.style.top = `${pageY - clickedTop}px`;

  const {top, left, width, height} = ghost.getBoundingClientRect();
  const belowGhostTopLeft = getDropzone(left, top);
  const belowGhostBottomRight = getDropzone(left + width, top + height - 5);

  isContain = isElements(belowGhostTopLeft, belowGhostBottomRight) && belowGhostTopLeft === belowGhostBottomRight;

  if (!isContain) {
    // 한번이라도 dropzone에 append 된 적 있어야 parentNode(dropzone)가 존재
    if (isElement(ghostShadow.parentNode)) ghostShadow.parentNode.removeChild(ghostShadow);
    ghostShadow.classList.add('dnd-none');
  } else {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const dropzone = belowGhostTopLeft;

      const item = getDraggableItem(left + width / 2, top + height / 2);

      if (isElement(item)) {
        // draggable 요소의 앞 또는 뒤
        insertBetweenDraggableItems(item, top);
      } else {
        // draggable 요소 사이에 공백이 있어서 draggable item이 안 잡히는 경우 모든 item을 확인
        const children = dropzone.children;
        const len = children.length;

        let i = 0;
        let child, childRect;
        if (len < 2) {
          child = children[i] || null;
          childRect = child && child.getBoundingClientRect();
          if (childRect && childRect.top < top) dropzone.prepend(ghostShadow);
          else dropzone.append(ghostShadow);
          hideGhost();
          return;
        }

        let nextChild, nextChildRect;
        for (i = 1; i < len; i++) {
          child = children[i];
          childRect = child.getBoundingClientRect();
          if (childRect.top > top) {
            dropzone.prepend(ghostShadow);
            break;
          }

          nextChild = children[i + 1] || null;
          nextChildRect = nextChild ? nextChild.getBoundingClientRect() : null;
          if (!nextChildRect) {
            dropzone.append(ghostShadow);
            break;
          }
          if (childRect.bottom <= top && nextChildRect.top > top) {
            insertNodeAfter(ghostShadow, child);
            break;
          }
        }
      }

      // drag할 위치가 drag하려는 요소의 원래 위치가 같으면 preview(ghost) 숨김
      hideGhost();
    }, 200);
  }
}

function hideGhost() {
  const {nextElementSibling, previousElementSibling, classList} = ghostShadow;

  if (!isOriginElement(nextElementSibling) && !isOriginElement(previousElementSibling)) {
    classList.remove('dnd-none');
  } else {
    if (!classList.contains('dnd-none')) classList.add('dnd-none');
  }
}

function insertBetweenDraggableItems(item, top) {
  const itemTop = item.getBoundingClientRect().top;

  if (itemTop <= top) {
    insertNodeAfter(ghostShadow, item);
  } else {
    insertNodeBefore(ghostShadow, item);
  }
}

function getDropzone(x, y) {
  const belowElements = document.elementsFromPoint(x, y);
  const dropzone = belowElements.find((el) => el.getAttribute('dropzone') === 'true');

  return dropzone;
}

function getDraggableItem(x, y) {
  const belowElements = document.elementsFromPoint(x, y);
  const draggableItem = belowElements.find(
    (el) => el.getAttribute('dnd-draggable') === 'true' && el !== ghostShadow && el !== ghost
  );
  return draggableItem;
}

function getDropEvent() {
  return new CustomEvent('drop', {bubbles: false, detail: {target: originElement, isContain}});
}

function isOriginElement(element) {
  return isElement(element) && element.classList.contains('dnd-hidden-origin');
}

function clone(element) {
  return element.cloneNode(true);
}
