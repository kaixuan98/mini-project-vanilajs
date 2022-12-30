const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/", (req, res) => {
    res.json({ success: "Hello Form Request!" });
});

router.post('/submit', (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
})

module.exports = router;