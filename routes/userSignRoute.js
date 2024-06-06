const express = require('express');
const router = express.Router();
const { processSignUp , processLogin } = require('../controllers/userSign');


// User Registration
router.post('/register', processSignUp);

router.post('/login',processLogin);


module.exports = router;
