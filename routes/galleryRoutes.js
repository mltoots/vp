const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryControllers');

//fotogalerii leht
router.get('/', galleryController.gallery);

module.exports = router;