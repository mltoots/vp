const express = require('express');
const router = express.Router();

//kasutatavad controllerid
const {
	eestifilm,
	inimesed,
	inimesedAdd,
	inimesedAddPost, 
	inimesedAddPostAndmed, 
	inimesedAddPostSurm, 
	inimesedAddPostAndmebaas,
	filmidAdd,
	seosedLisa,
	seosedLisaPost,
	seosed,
	ametid,
    ametidAdd,
    ametidAddPost} = require('../controllers/eestifilmControllers');

router.route('/').get(eestifilm);
router.route('/inimesed').get(inimesed);
router.route('/inimesed_lisa').get(inimesedAdd);
router.route('/inimesed_lisa').post(inimesedAddPost);
router.route('/inimesed_lisa').post(inimesedAddPostAndmed);
router.route('/inimesed_lisa').post(inimesedAddPostSurm);
router.route('/inimesed_lisa').post(inimesedAddPostAndmebaas);
router.route('/filmid_lisa').get(filmidAdd);
router.route('/seosed_lisa').get(seosedLisa);
router.route('/seosed_lisa').post(seosedLisaPost);
router.route('/seosed').get(seosed);
router.route('/ametid').get(ametid);
router.route('/ametid_add').get(ametidAdd);
router.route('/ametid_add').post(ametidAddPost);
module.exports = router;