import KanbanAPI from '../api/KanbanAPI.js';
import DropZone from './DropZone.js';

export default class Item{
    constructor(id, content){
        const bottomDropZone = DropZone.createDropZone();

        this.element = {};
        this.element.root = Item.createRoot();
        this.element.input = this.element.root.querySelector('.kanban-col-itemInput');

        this.element.root.dataset.id = id; 
        this.element.input.textContent = content; 
        this.content = content; 
        this.element.root.appendChild(bottomDropZone);

        const onBlur= () => {
            const newContent = this.element.input.textContent.trim();

            // WHY? this.content is the original one when we save
            if(newContent == this.content){
                return;
            }
            this.content = newContent; 

            KanbanAPI.updateItem(id, {content: this.content})
        } 

        this.element.input.addEventListener("blur", onBlur)
        this.element.root.addEventListener('dblclick', ()=>{
            const check = confirm("Do you want to delete this task?")

            if(check){
                KanbanAPI.deleteItem(id);
                this.element.input.removeEventListener("blur", onBlur);
                this.element.root.parentElement.removeChild(this.element.root)
            }
        })

        this.element.root.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", id); // hold the data that is being dragged
        });

        // prevent the default behaviour: copy and paste when drag 
        this.element.input.addEventListener("drop", e=> {
            e.preventDefault();
        })
    }


    static createRoot(){
        let range = document.createRange();
        range.selectNode(document.body);

        return range.createContextualFragment(`
            <div class="kanban-col-item" draggable="true">
                <div class="kanban-col-itemInput" contenteditable></div>
            </div>
        `).children[0]
    }
}