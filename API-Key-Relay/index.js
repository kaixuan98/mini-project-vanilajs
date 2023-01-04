require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require('express-rate-limit');
const app = express();
const port = 3000; 

const unsplash = require("./unsplash");
const spoonacular = require("./spoonacular")
const formRequest = require('./form');
const googleBooks = require('./GoogleBooks');

app.use(express.json());

const whiteList = ['http://127.0.0.1','http://127.0.0.1:5500', 'http://127.0.0.1:3000', 'http://127.0.0.1:5500/Quote%20Generator/' ];
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

app.use(express.urlencoded({
    extended: true
}))

app.use("/unsplash", unsplash);
app.use("/spoonacular", spoonacular);
app.use("/form", formRequest);
app.use("/searchBook", googleBooks);

//test route
app.use('/', (req, res) => {
    res.status(200)
        .send('ok')
        .end();
});

app.listen(port , () => console.log(`App listening at port ${port}`));

