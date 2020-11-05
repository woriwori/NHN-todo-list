import {getElement} from '@/lib/helper';

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
}

function ready() {
  ghost.addEventListener('mousedown', (event) => {
    document.body.append(ghost);
    document.addEventListener('mousemove', setPosition);
    ghost.addEventListener('mouseup', handleMouseUp);
  });
}

export function execute() {
  ghost.dispatchEvent(new Event('mousedown'));
}

function finish(event) {
  const {clientX, clientY} = event;
  const belowElements = document.elementsFromPoint(clientX, clientY);
  const dropzone = belowElements[1];
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

  finish(event);
}
