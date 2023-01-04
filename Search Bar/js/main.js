// url to search books: https://www.googleapis.com/books/v1/volumes?q=${keywords}
const mainPage = document.querySelector('#main');
const searchbar = document.querySelector('.search-bar');
const resultList = document.querySelector('.search-result__list')

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
    if(e.target.id === 'main'){
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





