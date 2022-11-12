const URL = 'https://type.fit/api/quotes';
const PIC_URL = 'http://127.0.0.1:3000/unsplash/landscape/motivation'
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
            author.innerHTML = randomQuote.author !== null ? ("~ " + randomQuote.author + " ~"):("Unknown");
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
let imgCredit = document.getElementById('imgCreds');

function fetchBgImage(url){
    fetch(url)
        .then( (response) => response.json())
        .then (pictureMeta => {
            console.log(pictureMeta)
            bgImg.setAttribute("src", pictureMeta.urls.regular);
            imgCredit.setAttribute("href", pictureMeta.links.html);
            imgCredit.innerText = "Source: Unsplash - " + pictureMeta.user.name;
        })
}

fetchBgImage(PIC_URL);
bgImg.setAttribute("width", w);
bgImg.setAttribute("height", h);
bgDiv.appendChild(bgImg);

// implement the copy icon button 



// implement the refresh for new random quotes
let quoteBtn = document.getElementById("quoteRefresh");
quoteBtn.addEventListener('click', () => fetchQuotes(URL) )


// implement the refresh for bg img 
let imgBtn = document.getElementById("bgRefresh");
imgBtn.addEventListener('click', ()=> fetchBgImage(PIC_URL))