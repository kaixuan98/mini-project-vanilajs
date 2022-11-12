require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000; 

const unsplash = require('./unsplash/index.js');

app.use(express.json());
const rateLimit = require('express-rate-limit');

const whiteList = ['https://127.0.0.1','https://127.0.0.1:5500' ];

const corsOptions = {
    origin: (origin, callback) => {
        if(!origin || whiteList.indexOf(origin) !== -1){
                callback(null,true);
        }else{
                callback(new Error("Not Allowed by CORS")); 
        }
    },
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


const limiter = rateLimit({
    windowMs: 1000,
    max: 1
});

app.use(limiter);


//test route
app.get("/" , (req, res) => {success: "ok"});

// unsplash route 
app.get("/unsplash", unsplash)

app.listen(port , () => console.log(`App listening at port ${port}`));