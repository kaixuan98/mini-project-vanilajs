
// exmaple obj : Stars{id: ... , rating: 0-5 , element:{}}

export default class Stars{

    // constructor to create the component 
    constructor(id, rating, totalStars){
        this.id = id; 
        this.rating = rating; 
        this.totalStars = totalStars; 

        this.element = {};
        this.element.root = Stars.createStarComponent(this.rating , this.totalStars);
    }

    static createStarComponent(rating, totalStars){

        let range = document.createRange(); 

        range.selectNode(document.body);

        const starComponent = range.createContextualFragment(`
                <ul class="stcomp">
                </ul>
            `).children[0]

        // for loop to create each stars - with index as the datarating
        for (let i = 0; i < totalStars; i++) {
            const li = document.createElement("li");
            li.setAttribute("data-rating", i + 1);
            li.className = "star";
            starComponent.appendChild(li);
        }

        return  starComponent;
    }

}