import dnd from '@/lib/dnd';
const str = `
    <input value="button" type="button" style=" margin-top:10px;"/>      
    <div id="red" class="red" style="margin-top:20px;background-color: red;width:100px;height:100px;">
    </div>
`;
document.body.innerHTML = str;

dnd.draggable('input');
