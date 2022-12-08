const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const fetchRandom = async (num) => {
    const url = `https://api.spoonacular.com/recipes/random?number=${num}&apiKey=${process.env.SPOONACULAR_API_KEY}`;
    try{
        const recipeStream = await fetch(url);
        const recipeJson = await recipeStream.json();
        return recipeJson;
    }catch(err){
        return {Error: err.stack};
    }
};

// fetch instructions 

router.get("/", (req, res) => {
    res.json({ success: "Hello Spoonacular!" });
});


// random with params as number 
router.get("/random", async (req, res) => {
    const num = req.query.num;
    const recipes = await fetchRandom(num);
    res.json(recipes);
});


// get instruction with id 

module.exports = router;