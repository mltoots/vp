const express = require('express');
const router = express.Router();

//kasutatavad controllerid
const {
	kylastus,
	kylastusPost,
	kylastusViimane} = require('../controllers/kylastusControllers');
	
router.route('/').get(kylastus);
router.route('/regvisit').get(kylastus);
router.route('/regvisit').post(kylastusPost);
router.route('/lastvisit').get(kylastusViimane);
module.exports = router;