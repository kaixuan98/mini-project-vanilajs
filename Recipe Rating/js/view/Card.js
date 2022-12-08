import {removeTags} from "../utility/removeTags.js";
import {splitSentences} from '../utility/splitSentences.js'
import Stars from "./Stars.js";

export default class Card{
    constructor(id, content){

        this.element = {}; 
        this.rating = 0;
        this.totalStars = 5;
        this.element.root = Card.createRoot();
        this.element.img = this.element.root.querySelector('#recipe-img');
        this.element.title = this.element.root.querySelector('.recipe-title');
        this.element.source = this.element.root.querySelector('.recipe-source');
        this.element.summary = this.element.root.querySelector('.recipe-summary');
        this.element.button = this.element.root.querySelector('.recipe-detail-btn');

        this.element.root.dataset.id = id;
        this.element.title.textContent = content.title 
        this.element.source.textContent = content.sourceName;
        this.element.img.src = content.image;

        let cleanText = removeTags(content.summary);
        this.element.summary.textContent = splitSentences(cleanText).slice(0,2)

        // create star component when create card
        this.element.starContainer = this.element.root.querySelector('.recipe-star-rate-container');

        //if the container has no star then create starComponent
        if(this.element.starContainer.children.length === 0){
            const starComponent = new Stars(id, this.rating, this.totalStars);
            this.element.starContainer.appendChild(starComponent.element.root);
        }

        // get the star component
        this.element.starComponent = this.element.starContainer.children[0]; 

           // a function that will be used to update star component UI when clicked by adding an removing the star-filled class
        const updateStarComponent = (rating) => {
            for(let index = 0 ; index < parseInt(rating) ; index++){
                this.element.starComponent.children[index].classList.add('star-filled');
            }
            for( let index = parseInt(rating) ; index < this.totalStars ; index++){
                this.element.starComponent.children[index].classList.remove('star-filled');
            }

        }

        // if clicked on the star, if the new rating is different, then will send to update the UI 
        // only save the clicked Rating as new rating
        const onMouseClick = (e) => {
            let star = e.target?? e; 
            let isStar = star.classList.contains('star');
            if(isStar){ // make sure it is a star
                let newRating = parseInt(star.getAttribute('data-rating'))
                if(this.rating !== newRating){
                    updateStarComponent(newRating);
                    this.rating = newRating;
                }
            }

        }

        // when hover, the rating is not saved
        const onMouseOver = (e) => {
            let star = e.target?? e; 
            let isStar = star.classList.contains('star');
            if(isStar){ // make sure it is a star
                let hoverRating = parseInt(star.getAttribute('data-rating'))
                if(this.rating !== hoverRating){
                    updateStarComponent(hoverRating);
                }
            }

        }

        const onMouseLeave = () => {
            updateStarComponent(this.rating);
        }

        this.element.starComponent.addEventListener('mouseover', onMouseOver);
        this.element.starComponent.addEventListener('mouseleave', onMouseLeave);
        this.element.starComponent.addEventListener('click', onMouseClick);


        const onClick = () => {
            // TODO: request for the next page ( my own API )
        }

        this.element.button.addEventListener("click", onClick); 



        


    }

    static createRoot(){
        let range = document.createRange();
        range.selectNode(document.body);

        return range.createContextualFragment(`
            <div class="recipe-card-container">
                <div class="recipe-img-container">
                    <img id='recipe-img'>
                </div>
                <div class="recipe-content-container">
                    <h1 class="recipe-title"></h1>
                    <p class="recipe-source"></p>
                    <p class="recipe-summary"></p>
                    <div class="recipe-star-rate-container"></div>
                    <button class="recipe-detail-btn">Full Recipe</button>
                </div>
            </div>
        `).children[0]
    }



}