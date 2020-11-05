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
  /**

    이건 위에 미리 선언해놓고..
    var event = document.createEvent('Event');

    이건 ie 가 지원 못하는 버전이긴한데, 이걸 써야지 
    {target : originElement, isContainer: false...} 를 넣을 수 있다. 
    var event = new CustomEvent('build', { bubbles: true, detail: { name: 'wonhee', value: myTarget.innerText } });
    
    event.initEvent('drop', true, true);

    dnd.dropzone(selector); 할 때는 ... 
    selector 에다가 dropzone을 구분할 수 있는 속성을 넣어놔서 
    belowElements에서 dropzone을 꺼내야한다.

    꺼낸 dropzone에 이벤트를 발생시킨다.
    dropzone.dispatchEvent(event);
   */
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
