import dnd from '@/lib/dnd';
import * as domutil from '@/lib/domutil';
import '@/styles/index.scss';
const str = `
    <div class="item"></div>   
    <div class="list">
    </div>
`;
document.body.innerHTML = str;

dnd.draggable('.item');

const dropzone = dnd.dropzone('.list');

domutil.on(dropzone, 'drop', (eventData) => {
  console.log(eventData);
});
