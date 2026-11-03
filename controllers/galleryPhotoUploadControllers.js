const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const sharp = require('sharp');
const originalPath = process.env.UPLOAD_ORIGINAL_PATH;
const resizedPath = process.env.UPLOAD_RESIZED_PATH;
const thumbnailPath = process.env.UPLOAD_THUMBNAIL_PATH;

//@desc page for uploading photos to gallery
//@route GET /galleryPhotoUpload
//@access public

const galleryPhotoUpload = (req, res) => {
	res.render('galleryphotoupload');
};

//@desc page for uploading photos to gallery
//@route POST /galleryPhotoUpload
//@access public

const galleryPhotoUploadPost = async (req, res) => {
	//console.log(req.file);
	//console.log(req.body);
	let conn;
	try {
		//genereerida oma failinime
		const fileName = 'vp_' + Date.now() + '.jpg';
		await fs.rename(req.file.path, originalPath + fileName);
		//pildi väiksemaks  muutmine
		const watermark = await sharp('./public/pic/vp_eve_watermark.png').resize({width: 80}).png().toBuffer();
		await sharp(originalPath + fileName).resize(800, 600).composite([{input: watermark, gravity: 'southeast'}]).jpeg({quality: 90}).toFile(resizedPath + fileName);
		//teeme ka pisipildi
		await sharp(originalPath + fileName).resize(100, 100).jpeg({quality: 90}).toFile(thumbnailPath + fileName);
		let sqlReq = 'INSERT INTO galleryphotos (filename, origname, alttext, privacy, userid) VALUES (?,?,?,?,?)';
		const userId = 1; //see on ajutine, kuni teeme kasutajakontod ja sisselogimise
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		const [result]  = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userId]);
		console.log('Salvestati foto kirje id: ' + result.insertId);
		res.render('galleryphotoupload');
	}
	catch (err) {
		console.log('Viga: ' + err);
		res.render('galleryphotoupload');
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

module.exports = {
	galleryPhotoUpload,
	galleryPhotoUploadPost
}