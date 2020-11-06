import {getElement, isElement} from '@/lib/helper';

const ERROR_CODE = {
  E01: 'dropzone이 아닙니다.'
};
let originElement = null;
let ghost = null;

export async function make(selector) {
  originElement = getElement(selector);

  create().then(ready);
}

async function create() {
  ghost = originElement.cloneNode(true);

  ghost.style.position = 'fixed';
  ghost.style.zIndex = 1000;

  // TODO: originElement는 흐릿하게하던가 아니면 색깔을 주던가..
  // originElement.classList.add('dnd-hidden-origin');
}

function ready() {
  ghost.addEventListener('mousedown', () => {
    document.body.append(ghost);
    document.addEventListener('mousemove', setPosition);
    ghost.addEventListener('mouseup', handleMouseUp);
  });
}

export function execute() {
  ghost.dispatchEvent(new Event('mousedown'));
}

function finish(event) {
  const dropzone = getDropzone(event);
  const dropEvent = getDropEvent();

  dropzone.dispatchEvent(dropEvent);

  // originElement.classList.remove('dnd-hidden-origin');
  dropzone.appendChild(originElement);

  destroy();
}

function destroy() {
  ghost.parentNode.removeChild(ghost);
  ghost = null;
  originElement = null;
}

function setPosition(event) {
  const {offsetLeft, offsetTop} = originElement;
  const {pageX, pageY} = event;

  ghost.style.left = `${pageX - offsetLeft}px`;
  ghost.style.top = `${pageY - offsetTop}px`;
}

function handleMouseUp(event) {
  document.removeEventListener('mousemove', setPosition);
  ghost.removeEventListener('mouseup', handleMouseUp);

  try {
    finish(event);
  } catch (error) {
    // console.log(error);
    if (error.message === ERROR_CODE.E01) destroy();
  }
}

function getDropzone(event) {
  const {clientX, clientY} = event;
  const belowElements = document.elementsFromPoint(clientX, clientY);
  const dropzone = belowElements.find((el) => el.getAttribute('dropzone') === 'true');

  if (!isElement(dropzone)) throw Error(ERROR_CODE.E01);

  return dropzone;
}

function getDropEvent() {
  return new CustomEvent('drop', {bubbles: false, detail: {target: originElement, isContain: true}});
}
