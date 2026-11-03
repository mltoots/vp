const express = require('express');
const fs = require ('fs').promises;
//moodul POST päringute lahtiharutamiseks, parsimiskes
const bodyparser = require('body-parser');
require('dotenv').config();
//moodul andmebaasiga suhtlemiseks (koos async ehk ootamise osaga)
const mysql = require('mysql2/promise');
//moodul .env keskkonnam,uutujate lugemiseks


const dateTimeET = require("./src/dateTimeET.js");

const textRef = "public/txt/vanasonad.txt";
const regtextRef = "public/txt/visits.txt";

//käivitan funk. express() ja annan nimeks app
const app = express();
//määrame renderdus mootori: EJS
app.set('view engine', 'ejs');
//määrame avalikuna kasutatava kataloogi
app.use(express.static('public'));
//määrame vormide sisu parsimile
app.use(bodyparser.urlencoded({extended: false}));

//marsruudid
app.get('/', async (req, res)=>{
	const dayNow = dateTimeET.weekDay();
	const dateNow = dateTimeET.date(0);
	const timeNow = dateTimeET.time();
	let conn;
	let latestPhoto = null;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		const sqlReq = 'SELECT filename, alttext FROM galleryphotos WHERE id=(SELECT MAX(id) FROM galleryphotos WHERE privacy=? AND deleted IS NULL)';
		const [sqlRes] = await conn.execute(sqlReq, [3]);
		if (sqlRes.length > 0) {
			latestPhoto = sqlRes[0];
		}
	}
	catch (err) {
		console.log('Andmebaasiga suhtlemise viga: ' + err);
	}
	finally {
		if (conn) {
			await conn.end();
		}
	}
	res.render('index', {
		dayNow: dayNow,
		dateNow: dateNow,
		timeNow: timeNow,
		latestPhoto: latestPhoto
	});
});

app.get('/minust', (req, res)=>{
	res.render('minust');
});

//sisseloginud kasutajate avaleht
app.get('/home', (req, res) =>{
	res.render('home');
});

//valja logimine
app.get('/logout', (req, res) =>{
	res.redirect('/');
});

app.get('/vanasona', async (req, res)=>{
	try {
		const data = await fs.readFile(textRef, "utf8");
		const folkWisdom = data.split(';');
		res.render('vanasona', {wisdom: folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))]});
	}
	catch (err) {
		console.log(err);
		res.render('vanasona', {wisdom: 'Kahjuks ei leidnud ühtegi vanasõna!'});
	}
});

//külastuse marsruudid
const kylastusRouter = require('./routes/kylastusRoutes');
app.use('/visits', kylastusRouter);

//eesti filmi marsruudid
const eestiFilmRouter = require('./routes/eestifilmRoutes');
app.use('/eestifilm', eestiFilmRouter);

//galeriipiltide üleslaadimine
const galleryPhotoUploadRouter = require('./routes/galleryPhotoUploadRoutes');
app.use('/galleryPhotoUpload', galleryPhotoUploadRouter);

//fotogalerii
const galleryRouter = require('./routes/galleryRoutes');
app.use('/gallery', galleryRouter);

//fotogalerii
const signupRouter = require('./routes/signupRoutes');
app.use('/signup', signupRouter);

//sisselogimine
const signinRouter = require('./routes/signinRoutes');
app.use('/signin', signinRouter);

app.listen(5222);