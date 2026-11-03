const express = require('express');
const router = express.Router();

//kontrollerid
const{
signupPage,
signupPagePost} = require('../controllers/signupControllers.js');

router.get('/', signupPage);
router.post('/', signupPagePost);

module.exports = router;