const express = require('express');

const { signup, login } = require('../controllers/auth.js');

const router = express.Router();

console.log("Auth.js loaded!");

router.get("/", (req, res) => {
    res.send("Auth route is working!");
});

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;