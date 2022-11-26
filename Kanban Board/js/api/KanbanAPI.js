export default class KanbanAPI{
    // Given a columnId, we need to get back the items in the column
    static getItems(colId){
        const col = read().find(column => column.id === colId);

        if(!col){
            return [];
        }

        return col.items;
    }

    // insertItem - will return the added item as an object 
    static insertItem(colId, content){
        const data = read();
        const col = data.find(column => column.id === colId);
        const item = {
            id: Math.ceil(Math.random() * 100000),
            content: content
        }

        if(!col){
            return new Error("Column does not exists!")
        }

        col.items.push(item); 
        save(data);

        return item;
    }


    // updateItem
    // newProps: { columnId, newPosition, content}
    static updateItem(itemId, newProps){
        const data = read();

        // use the item to find the column 
        const [item, currentColumn] = (() => {
            for(const col of data){
                const item = col.items.find( item => item.id === itemId);

                if(item){
                    return [item, col]
                }
            }
        })()

        // no item found
        if(!item){
            return new Error("Item not found!");
        }

        // found item but we are changing the content, 
        item.content = newProps.content !== undefined ? newProps.content: item.content;  

        // update the position(Column and incolumn arrangement )
        if(newProps.columnId !== undefined && newProps.newPosition !== undefined){
            const targetColumn = data.find(col => col.id === newProps.columnId)

            if(!targetColumn){
                return new Error('Target Column Not Found!');
            }

            // add the element to the target column
            targetColumn.items.splice(newProps.newPosition, 0, item)

            // remove the element from current column 
            currentColumn.items.splice(currentColumn.items.indexOf(item), 1)
        }

        save(data);
    }

    
    // deleteItem
    static deleteItem(itemId){
        const data = read();
        for(const col of data){
            const item = col.items.find(item => item.id === itemId );

            if(item){
                col.items.splice(col.items.indexOf(item), 1);
            }
        }
        save(data);
    }
}

// utility function to access the local storage 
function read(){
    const data = localStorage.getItem('kanbanData');

    if(!data){
        return [
            {
                id: 1,
                items: []
            },
            {
                id: 2,
                items: []
            },
            {
                id: 3,
                items: []
            },
        ]
    };

    return JSON.parse(data); 

}

function save(data){
    localStorage.setItem('kanbanData', JSON.stringify(data));
}