const express = require('express');
const router = express.Router();

//kontrollerid
const{
signinPage,
signinPagePost} = require('../controllers/signinControllers.js');

router.get('/', signinPage);
router.post('/', signinPagePost);

module.exports = router;