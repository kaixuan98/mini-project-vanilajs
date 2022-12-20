import RecipeAPI from "./api/RecipeAPI.js";
import Card from "./view/Card.js";

const url = `http://localhost:3000/spoonacular/random?num=10`;

// get the list in DOM 
const layoutContainer = document.querySelector('#layout')
const layout = layoutContainer.children[0];


// select layout when click (list or gallery)
const layoutSelections = document.querySelector('#btnGroup');
layoutSelections.addEventListener('click', (e) => {
    let layoutType = e.target?? e; 
    if(layoutType.dataset.view === 'gallery'){
        layout.classList.remove(layout.classList[0]);
        layout.classList.add('gallery');
    }else{
        layout.classList.remove(layout.classList[0]);
        layout.classList.add('list');
    }
})

// Card testing with sample data
// recipes.forEach( r => {
//     const card = new Card(r.id, r);
//     layout.appendChild(card.element.root);
// })

// // fetching from the public api and will return us a promise
const RequestRecipes = async (url) => {
    try{
        fetch(url)
            .then(response => response.json())
            .then(data => 
                data.recipes.forEach(r => {
                const card = new Card(r.id, r);
                layout.appendChild(card.element.root);
            })
            );
    }catch(e){
        console.log(e)
    }

}
RequestRecipes(url);

// await to fix the card's size

