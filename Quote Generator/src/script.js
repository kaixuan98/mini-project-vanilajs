

const URL = 'https://type.fit/api/quotes';
// const PIC_URL = `https://api.unsplash.com/photos/random/?client_id=${config.ACCESS_KEY}&orientation=landscape&query='landscape'`
var w = window.innerWidth;
var h = window.innerHeight;

// fetch the quotes and place it into class="quote" and "author"
let quote = document.getElementsByClassName('quote')[0];
let author = document.getElementsByClassName('author')[0];

function fetchQuotes(url) {
    fetch(url)
        .then( (response) => response.json())
        .then( quotes => {

            var randomQuote = getRandomQuotes(quotes);
            quote.innerHTML = randomQuote.text;
            author.innerHTML = randomQuote.author !== null ? (randomQuote.author):("Unknown");

        })
}

function getRandomQuotes(quotes){

    var randomIndex = Math.floor(Math.random() * 1643)
    return quotes[randomIndex]; 

}

fetchQuotes(URL);

// fetch the background and place it into class="background"
let bgDiv = document.getElementById('background');
let bgImg = document.createElement("img");
let imgCredit = document.createElement("p");
let imgUrl = document.createElement("a");

function fetchBgImage(url){
    fetch(url)
        .then( (response) => response.json())
        .then (pictureMeta => {
            bgImg.setAttribute("src", pictureMeta.urls.regular);
            imgCredit.innerText = pictureMeta.user.name;
            imgUrl.setAttribute("href", pictureMeta.links.html);
        })
}

//fetchBgImage(PIC_URL);
bgImg.setAttribute("width", w);
bgImg.setAttribute("height", h);
imgCredit.setAttribute("id", "credit");
imgUrl.innerText = "Source:Unsplash";
bgDiv.appendChild(bgImg);
bgDiv.appendChild(imgCredit);
bgDiv.appendChild(imgUrl);

// implement the copy icon button 



// implement the refresh for new random quotes
let quoteBtn = document.getElementById("quoteRefresh");
quoteBtn.addEventListener('click', () => fetchQuotes(URL) )


// implement the refresh for bg img 
let imgBtn = document.getElementById("bgRefresh");
imgBtn.addEventListener('click', ()=> fetchBgImage(PIC_URL))