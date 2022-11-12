const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const fetchPicture = async (orientation, query) => {
    const url = `https://api.unsplash.com/photos/random/?client_id=${process.env.UNSPLASH_ACCESS_KEY}&orientation=${orientation}&query=${query}`;

    try{
        const unsplashStream = await fetch(url);
        const unsplashJson = await unsplashStream.json();
        return unsplashJson;
    }catch(err){
        return {Error: err.stack};
    }
    
};

router.get("/", (req,res) => {
    res.json({success: "Unsplash API Route"});
})

router.get("/randomImg/:orientation/:query", async  (req,res) => {
    const orientation = req.params.orientation;
    const query = req.params.query;
    const picData = await fetchPicture(orientation, query);
    res.json(picData);
})

module.exports = router;