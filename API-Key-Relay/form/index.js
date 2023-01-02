const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const multer  = require('multer');
const upload = multer()

router.get("/", (req, res) => {
    res.json({ success: "Hello Form Request!" });
});

router.post('/submit',upload.none(), (req, res, next) => {
    console.log(req.body);
    res.sendStatus(200);
})

module.exports = router;