const express = require('express');

const { signup, login } = require('../controllers/auth.js');

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Auth route is working!");
});

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;