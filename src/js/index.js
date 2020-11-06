import dnd from '@/lib/dnd';
import * as domutil from '@/lib/domutil';
const str = `
    <input value="button" type="button" style=" margin-top:10px;width:50px;height:30px"/>      
    <div id="red" class="red" style="margin-top:20px;background-color: red;width:100px;height:100px;">
    </div>
`;
document.body.innerHTML = str;

dnd.draggable('input');

const dropzone = dnd.dropzone('#red');

domutil.on(dropzone, 'drop', (eventData) => {
  console.log(eventData);
});
