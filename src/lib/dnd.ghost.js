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
  ghost.addEventListener('mousedown', (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      originElement.parentNode.append(ghost);
      setPosition(e);

      ghost.addEventListener('mouseup', handleMouseUp);

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousemove', setPosition);
    }, 200);
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

  document.body.classList.remove('dnd-select-none ');

}

function initializeGhost() {
  ghost.classList.add('dnd-ghost');
  ghost.classList.add('dnd-select-none');
}

function initializeGhostShadow() {
  ghostShadow.classList.add('dnd-none');
  ghostShadow.classList.add('dnd-shadow');
  ghostShadow.classList.add('dnd-select-none');
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

function handleKeyDown(e) {
  if (e.keyCode === 27) {
    destroy();
  }
}

function setPosition(event) {
  document.body.classList.add('dnd-select-none');

  const {pageX, pageY} = event;
  ghost.style.left = `${pageX - clickedLeft}px`;
  ghost.style.top = `${pageY - clickedTop}px`;

  const {top, left, width, height} = ghost.getBoundingClientRect();

  if (!isContainGhost()) {
    hideGhostShadow();
    return;
  }

  clearTimeout(debounce);
  debounce = setTimeout(() => {
    const dropzone = getDropzone(left, top);

    const item = getDraggableItem(left + width / 2, top + height / 2);
    if (isElement(item)) {
      // draggable 요소의 앞 또는 뒤에 추가
      insertBetweenDraggableItems(item, top);

      // drag할 위치가 drag하려는 요소의 원래 위치가 같으면 preview(ghost) 숨김
      hideGhost();
      return;
    }

    // draggable 요소 사이에 공백이 있어서 draggable item이 안 잡히는 경우 모든 item을 확인
    const children = dropzone.children;
    const len = children.length;

    let child, childRect;
    if (len < 2) {
      child = children[0] || null;
      childRect = child && child.getBoundingClientRect();

      if (childRect && childRect.top > top) dropzone.prepend(ghostShadow);
      else dropzone.append(ghostShadow);

      hideGhost();
      return;
    }

    let i, nextChild, nextChildRect;
    for (i = 1; i < len; i++) {
      child = children[i];

      childRect = child.getBoundingClientRect();
      if (childRect.top > top) {
        dropzone.prepend(ghostShadow);
        break;
      }

      nextChild = children[i + 1] || null;
      if (!nextChild) {
        dropzone.append(ghostShadow);
        break;
      }

      nextChildRect = nextChild.getBoundingClientRect();
      if (childRect.bottom <= top && nextChildRect.top > top) {
        insertNodeAfter(ghostShadow, child);
        break;
      }
    }
    hideGhost();
  }, 100);
}

function hideGhost() {
  const {nextElementSibling, previousElementSibling, classList} = ghostShadow;

  let isNotOriginElements = !isOriginElement(nextElementSibling) && !isOriginElement(previousElementSibling);
  if (isElement(previousElementSibling) && !nextElementSibling) {
    // 마지막 item을 마지막 위치(현재 위치)로 드래그 시도하는 경우에 대한 가드 처리
    isNotOriginElements = isNotOriginElements && !isOriginElement(previousElementSibling.previousElementSibling);
  }

  if (isNotOriginElements) {
    classList.remove('dnd-none');
  } else {
    if (!classList.contains('dnd-none')) classList.add('dnd-none');
  }
}

function hideGhostShadow() {
  // 한번이라도 dropzone에 append 된 적 있어야 parentNode(dropzone)가 존재
  if (isElement(ghostShadow.parentNode)) ghostShadow.parentNode.removeChild(ghostShadow);
  ghostShadow.classList.add('dnd-none');
}

function isContainGhost() {
  const {top, left, width, height} = ghost.getBoundingClientRect();
  const belowGhostTopLeft = getDropzone(left, top);
  const belowGhostBottomRight = getDropzone(left + width, top + height - 5);

  isContain = isElements(belowGhostTopLeft, belowGhostBottomRight) && belowGhostTopLeft === belowGhostBottomRight;

  return isContain;
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

const getDropEvent = () => new CustomEvent('drop', {bubbles: false, detail: {target: originElement, isContain}});
const isOriginElement = (element) => isElement(element) && element.classList.contains('dnd-hidden-origin');
const clone = (element) => element.cloneNode(true);
