import KanbanAPI from "../api/KanbanAPI.js";
import Item from "./Item.js";
import DropZone from "./DropZone.js";

export default class Column{
    constructor(id, title){

        const topDropZone = DropZone.createDropZone(); 

        this.element = {}
        this.element.root = Column.createRoot();
        this.element.title = this.element.root.querySelector('.kanban-col-title');
        this.element.items = this.element.root.querySelector('.kanban-col-items');
        this.element.addItems = this.element.root.querySelector('.kanban-col-addBtn');

        this.element.root.dataset.id = id;
        this.element.title.textContent = title; 
        this.element.items.appendChild(topDropZone);

        this.element.addItems.addEventListener("click", ()=> {
            const newItem = KanbanAPI.insertItem(id, "");

            this.renderItem(newItem);
        })
        
        KanbanAPI.getItems(id).forEach(item => {
            this.renderItem(item); 
        })


    }

    // this is to create thet column element dynamically that we see in the html 
    static createRoot(){
        let range = document.createRange();

        range.selectNode(document.body);

        return range.createContextualFragment(
            `<div class="kanban-col">
                <h1 class="kanban-col-title"></h1>
                <div class="kanban-col-items"></div>
                <button class="kanban-col-addBtn">Add Task</button>
            </div>`
        ).children[0]

    }

    renderItem(data){
        const newItem = new Item(data.id, data.content);

        this.element.items.appendChild(newItem.element.root);

    }
}