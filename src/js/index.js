import dnd from '@/lib/dnd';
import * as domutil from '@/lib/domutil';
import '@/styles/index.scss';
const str = `
    <div class="item">1</div>   
    <div class="item">2</div>   
    <div class="item">3</div>   
    <div class="item">4</div>
    <div style="display:flex">
      <div class="list">
      </div>
      <div class="list2">
      </div>
    </div>
`;
document.body.innerHTML = str;

// dnd.draggable('.item');
document.querySelectorAll('.item').forEach((el) => dnd.draggable(el));

const dropzone = dnd.dropzone('.list');
const dropzone2 = dnd.dropzone('.list2');

domutil.on(dropzone, 'drop', (eventData) => {
  console.log('eventData(dropzone) : ', eventData.detail);
});
domutil.on(dropzone2, 'drop', (eventData) => {
  console.log('eventData(dropzone2) : ', eventData.detail);
});
