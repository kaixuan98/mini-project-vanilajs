import RecipeAPI from "./api/RecipeAPI.js";
import Card from "./view/Card.js";

const url = `http://localhost:3000/spoonacular/random?num=3`;



// get the list in DOM 
const list = document.querySelector('#list');

// // fetching from the public api and will return us a promise
const RequestRecipes = async (url) => {
    try{
        fetch(url)
            .then(response => response.json())
            .then(data => data.recipes.forEach(r => {
                const card = new Card(r.id, r);
                list.append(card.element.root);
            }));
    }catch(e){
        console.log(e)
    }

}
RequestRecipes(url);

