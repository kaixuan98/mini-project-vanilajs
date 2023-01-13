import Column from "./Column.js";
export default class Kanban{
    constructor(root){
        this.root = root; 

        // self instanciate
        Kanban.columns().forEach(column => {
            const colView = new Column(column.id, column.title);
            this.root.appendChild(colView.element.root)
        });
    }

    static columns(){
        return [
            {
                id: 1,
                title: 'Not Started'
            },
            {
                id: 2, 
                title: 'In Progress'
            },
            {
                id: 3,
                title: 'Completed'
            }
        ]
    }
}