const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

// fetch all the results
const fetchBooks = async (keywords) =>{
    const url = `https://www.googleapis.com/books/v1/volumes?q=${keywords}`
    console.log(url)
    try{
        const booksearchStream = await fetch(url);
        const bookJson = await booksearchStream.json();
        return bookJson;
    }
    catch(e){
        console.log(e)
    }
}

// autofill suggestions function
function suggest(substr){

}

router.get("/", (req, res) => {
    res.json({ success: "Hello Google Books!" });
});

router.get("/:keyword", async (req, res) => {
    const keyword = req.params.keyword;
    const result = await fetchBooks(keyword);
    res.json(result);
});

module.exports = router;