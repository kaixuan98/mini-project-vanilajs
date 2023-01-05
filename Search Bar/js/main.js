// url to search books: https://www.googleapis.com/books/v1/volumes?q=${keywords}
// url to request a specific book: https://www.googleapis.com/books/v1/volumes/{data-id}
const mainPage = document.querySelector('#main');
const searchbar = document.querySelector('.search-bar');
const resultList = document.querySelector('.search-result__list');
const singleBook = document.querySelector('.book__wrapper')

let searchTerm = searchbar.value.trim(); 
// the debounce will pass down the event to the getbookresult
const debounceSearch = debounce( (e) => getBookResults(e.target.value) ); 

// when keyup is called, then debounce search will be call 
searchbar.addEventListener('keyup', debounceSearch)

// click event bubble to the main page and handle there
// if I click the input, need to show the list
main.addEventListener('click', (e) => {
    resultList.classList.toggle('search-result__list--showBg', searchTerm > 0 )
    resultList.classList.toggle('search-result__list--active', e.target.nodeName === 'INPUT')
    if(e.target.nodeName !== 'INPUT') {
        // if the target is the result card -> then show the details under that wrapper
        // clear out the input if user clicked outside of the input
        if(searchbar.value !== ''){
            searchbar.value = '';
        }
        // clear the result list since it is not using anymore
        while(resultList.childElementCount !== 0 ){
            resultList.removeChild(resultList.firstChild);
        }
    }


})



// helper functions
function debounce (func, timeout = 500){
    let timer; 
    // args are the arguments that are in debounce(args <-here)
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout( () => {func.apply(this, args)}, timeout);
    }
}

async function getBookResults(searchTerm){
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`;

    // if the search term is empty no point checking
    if(searchTerm.length > 0){
        const booksStream = await fetch(url);
        const bookData = await booksStream.json();
        // check is there any books suggestion in the result list - remove the list 
        while(resultList.childElementCount !== 0){ //THIS probably able to optimise
            resultList.removeChild(resultList.firstChild);
        }
        // only then will append new result to the list
        resultList.classList.toggle('search-result__list--showBg', searchTerm.length > 0 )
        resultList.appendChild(showBookResult(bookData));
        return bookData; 
    }else{
        resultList.classList.remove('search-result__list--showBg')
        while(resultList.childElementCount !== 0 ){
            resultList.removeChild(resultList.firstChild);
        }
    }
}

function showBookResult(bookData){
    const resultList = document.createDocumentFragment();

    bookData.items.forEach( (book) => {
        resultList.appendChild(showBookCard(book));
    })

    return resultList; 
}

function showBookCard(book){

    const bookCard = document.createDocumentFragment(); 

    const bookDiv = document.createElement('li'); // create a card for result 
    bookDiv.setAttribute('class', 'result-card'); // create a img div 
    const bookImgDiv = document.createElement('div');
    bookImgDiv.setAttribute('class', 'result-card__imgContainer'); 
    const bookContentDiv = document.createElement('div'); // create a content div for title and author
    bookContentDiv.setAttribute('class', 'result-card__contentContainer'); 

    // set the inner texts
    const title = book.volumeInfo.title; 
    const authors = book.volumeInfo.authors; 
    let img = book.volumeInfo.imageLinks?.smallThumbnail;
    const publisher = book.volumeInfo.publisher; 

    if(img === undefined || img === null){
        img = "https://via.placeholder.com/150.png?text='NoImage'"
    }

    const titleHTML = document.createElement('p');
    titleHTML.setAttribute('class', 'result-card__title');
    const authorsHTML = document.createElement('p');
    authorsHTML.setAttribute('class', 'result-card__authors');
    const publisherHTML = document.createElement('p');
    publisherHTML.setAttribute('class', 'result-card__pubs');
    const imgHTML = document.createElement('img'); 

    titleHTML.innerText = title; 
    authorsHTML.innerText = authors;
    publisherHTML.innerText = publisher; 
    imgHTML.setAttribute('src', img); 

    bookDiv.dataset.id = book.id; 

    // add click event on each result card
    // because the click event is inside this function
    // the scope of this event listener has all the parents variable!! 
    bookDiv.addEventListener('click', (e) => {
        const bookLink = `https://www.googleapis.com/books/v1/volumes/${book.id}`;
        fetch(bookLink)
            .then(res => res.json())
            .then( bookdetails => {
                let bookDet = showBookDetails(bookdetails);
                if(singleBook.childElementCount > 0){
                    singleBook.removeChild(singleBook.firstElementChild);
                }
                // bookDet.appendChild(showBookCategory(bookdetails.volumeInfo.categories))
                singleBook.appendChild(bookDet);
            })
    })

    // append to divs 
    bookContentDiv.appendChild(titleHTML);
    bookContentDiv.appendChild(publisherHTML);
    bookContentDiv.appendChild(authorsHTML);
    bookImgDiv.appendChild(imgHTML);
    bookDiv.appendChild(bookImgDiv);
    bookDiv.appendChild(bookContentDiv);
    bookCard.appendChild(bookDiv);   

    return bookCard;
}

function showBookDetails(bookData){
    const title = bookData.volumeInfo.title; 
    const thumbnail = bookData.volumeInfo.imageLinks.thumbnail ; // might not have image links TODO
    const authors = bookData.volumeInfo.authors; 
    const ibsn = bookData.volumeInfo.industryIdentifiers; // array have different types
    const descb = bookData.volumeInfo.description;
    const pub = bookData.volumeInfo.publisher;

    
    let range = document.createRange();
    
    range.selectNode(document.body);
    
    const bookTop = range.createContextualFragment(`
            <div class="book__top">
                <div class="book__img-container">
                <img src=${thumbnail} >
                </div>
            <div class="book__content-container">
                <p class="book__title">${title}</p>
                <p class="book__publisher">${pub}</p>
                <p class="book__isbn">IBSN: ${ibsn[0].identifier}</p>
                <p class="book__author"> <span>by </span>${authors}</p>
            </div>
            </div>
    `).children[0]

    const bookBottom = range.createContextualFragment(`
        <div class="book__bottom">
                
            <div class="book__description">
                <p>${descb}</p>
            </div>
        </div>
    `).children[0]

    bookBottom.appendChild(showBookCategory(bookData.volumeInfo.categories)); 

    const book = document.createElement('div');
    book.setAttribute('class', 'book')
    book.appendChild(bookTop);
    book.appendChild(bookBottom);

    return book; 
}

function showBookCategory(categories){

    const pills = document.createDocumentFragment();

    const pillsContainer = document.createElement('div');
    pillsContainer.setAttribute('class', 'book__categories-container'); 

    categories.forEach( cat => {
        let pill = document.createElement('div')
        pill.innerText = cat
        pill.setAttribute('class', 'book__category')
        pillsContainer.appendChild(pill);
    })

    pills.appendChild(pillsContainer);
    return pills;
}




