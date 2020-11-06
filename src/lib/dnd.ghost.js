import {getElement, isElement, getSize, getPosition, isElements, insertNodeAfter, insertNodeBefore} from '@/lib/helper';
import '@/styles/dnd.ghost.scss';

const ERROR_CODE = {
  E01: 'dropzone이 아닙니다.'
};
let debounce = null;
let clickedLeft = 0;
let clickedTop = 0;
let originElement = null;
let ghost = null;
let ghostWidth = 0;
let ghostHeight = 0;
let ghostShadow = null;
let isContain = false;

export function make(selector, x, y) {
  create(selector, x, y).then(ready).then(execute);
}

async function create(selector, x, y) {
  originElement = getElement(selector);

  const {top, left} = getPosition(originElement);
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
  const {width, height} = getSize(originElement);

  ghostWidth = width;
  ghostHeight = height;
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

  const {top, left} = getPosition(ghost);
  const belowGhostTopLeft = getDropzone(left, top);
  const belowGhostBottomRight = getDropzone(left + ghostWidth, top + ghostHeight - 5);

  isContain = isElements(belowGhostTopLeft, belowGhostBottomRight) && belowGhostTopLeft === belowGhostBottomRight;

  if (!isContain) {
    // 한번이라도 dropzone에 append 된 적 있어야 parentNode(dropzone)가 존재
    if (isElement(ghostShadow.parentNode)) ghostShadow.parentNode.removeChild(ghostShadow);
    ghostShadow.classList.add('dnd-none');
  } else {
    const dropzone = belowGhostTopLeft;

    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const item = getDraggableItem(left + ghostWidth / 2, top + ghostHeight / 2);

      if (isElement(item)) {
        // draggable 요소의 앞 또는 뒤
        insertBetweenDraggableItems(item, top);
      } else {
        // dropzone 내에서의 맨 앞 또는 뒤
        insertIntoDropzone(dropzone, top);
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
  const itemTop = getPosition(item).top;

  if (itemTop <= top) {
    insertNodeAfter(ghostShadow, item);
  } else {
    insertNodeBefore(ghostShadow, item);
  }
}

function insertIntoDropzone(dropzone, top) {
  const dropzoneTop = getPosition(dropzone).top;
  const dropzoneBottom = dropzoneTop + getSize(dropzone).height;

  if (Math.abs(dropzoneTop - top) < Math.abs(dropzoneBottom - top)) {
    dropzone.prepend(ghostShadow);
  } else {
    dropzone.append(ghostShadow);
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
