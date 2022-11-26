import KanbanAPI from "../api/KanbanAPI.js";

export default class DropZone{
    static createDropZone(){
        let range = document.createRange();

        range.selectNode(document.body);

        const dropZone = range.createContextualFragment(`
            <div class="kanban-dropzone"></div>
        `).children[0]

        // when dragging -> add an active class
        dropZone.addEventListener("dragover", e=>{
            e.preventDefault();
            dropZone.classList.add('kanban-dropzone-active');
        })

        // dragged but did not move a lot -> remove the active class
        dropZone.addEventListener("dragleave" , () => {
            dropZone.classList.remove('kanban-dropzone-active');
        })

        // dragged and able to drop -> update the items position
        dropZone.addEventListener("drop" , e=> {
            e.preventDefault();
            dropZone.classList.remove('kanban-dropzone-active');  

            // find the closest kanban column started from itself to its ancestor 
            const columnElement = dropZone.closest('.kanban-col') 
            // get the current column element id (1,2 or 3)
            const columnId = Number(columnElement.dataset.id);
            // get every dropzone from that column and put in in array
            const dropZonesInColumn = Array.from(columnElement.querySelectorAll('.kanban-dropzone'));
            // get which location that it is dropping 
            const droppedIndex = dropZonesInColumn.indexOf(dropZone);
            // get the data from that current object 
            const itemId = Number(e.dataTransfer.getData('text/plain'));

            // get the id that need to be drop and get the element 
            const droppedItemElement = document.querySelector(`[data-id="${itemId}"]`);

            //after selecting the parent element, where are we inserting 
            const insertAfter = dropZone.parentElement.classList.contains("kanban-col-item")? dropZone.parentElement : dropZone;

            // prevent dragging to your own column
            if( droppedItemElement.contains(dropZone)){
                return;
            }

            // the actual dropping
            insertAfter.after(droppedItemElement);

            KanbanAPI.updateItem(itemId, {
                columnId,
                newPosition: droppedIndex
            });

        })

        return dropZone;

    }

}