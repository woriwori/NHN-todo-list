import dnd from '@/lib/dnd';
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

document.querySelectorAll('.item').forEach((el) => dnd.draggable(el));

const dropzone = dnd.dropzone('.list');
const dropzone2 = dnd.dropzone('.list2');

dropzone.on('drop', (eventData) => {
  console.log(eventData.target); // 드롭 된 엘리먼트
  console.log(eventData.isContain); // 완전 포함 여부
});
dropzone2.on('drop', (eventData) => {
  console.log(eventData.target); // 드롭 된 엘리먼트
  console.log(eventData.isContain); // 완전 포함 여부
});
