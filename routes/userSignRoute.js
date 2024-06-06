const express = require('express');
const router = express.Router();

const {processSignUp, processLogin } = require('../controllers/userSign');

router.post('/signup',processSignUp);
router.post('/login',processLogin);

module.exports = router;