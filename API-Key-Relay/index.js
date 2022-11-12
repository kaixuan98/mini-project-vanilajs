require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require('express-rate-limit');
const app = express();
const port = 3000; 

const unsplash = require("./unsplash");

app.use(express.json());

const whiteList = ['https://127.0.0.1','https://127.0.0.1:5500', 'https://127.0.0.1:3000' ];
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

app.use("/unsplash", unsplash);

//test route
app.use('/', (req, res) => {
    res.status(200)
        .send('ok')
        .end();
});

// unsplash route 

app.listen(port , () => console.log(`App listening at port ${port}`));

