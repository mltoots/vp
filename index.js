const express = require('express');
const dateTimeET = require("./src/dateTimeET.js");
const textRef = "public/txt/vanasonad.txt";
const regtextRef = "public/txt/visits.txt";
const fs = require ('fs').promises;
//moodul POST päringute lahtiharutamiseks, parsimiskes
const bodyparser = require('body-parser');
//dateTimeET.weekDay() + ', ' + dateTimeET.date(Math.round(Math.random())) + ', kell oli lehe avamise hetkel: ' + dateTimeET.time()
//käivitan funk. express() ja annan nimeks app
const app = express();
//määrame renderdus mootori: EJS
app.set('view engine', 'ejs');
//määrame avalikuna kasutatava kataloogi
app.use(express.static('public'));
//määrame vormide sisu parsimile
app.use(bodyparser.urlencoded({extended: false}));

//marsruudid
app.get('/', (req, res)=>{
	const dayNow = dateTimeET.weekDay();
	const dateNow = dateTimeET.date(0);
	const timeNow = dateTimeET.time();
	//res.send('Express.js veeb läkski käima!');
	res.render('index', {dayNow: dayNow, dateNow: dateNow, timeNow: timeNow});
});

app.get('/minust', (req, res)=>{
	res.render('minust');
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

app.get('/regvisit', async (req, res)=>{
	res.render('regvisit');
})

app.post('/regvisit', async (req, res)=>{
	try {
		const dateNow = dateTimeET.date(0);
		const timeNow = dateTimeET.time();
		await fs.appendFile(regtextRef, req.body.inputName + ',' + dateNow + ',' + timeNow + ';');
		res.render('regvisit');
	}
	catch (err) {
		console.log(err);
		res.render('regvisit');
	}
	
});

app.get('/lastvisit', async (req, res)=>{
	try {
		const data = await fs.readFile(regtextRef, 'utf8');
		const visits = data.split(';');
		const lastVisit = visits[visits.length - 2];
		const visitParts = lastVisit.split(',');
		const name = visitParts[0];
		const date = visitParts[1];
		const time = visitParts[2];
		const lastVisitText = 'Viimati registreeritud külastus ' + date + ', kell ' + time + ', selleks oli ' + name + '.';
		res.render('lastvisit', {lastVisit: lastVisitText});
	}
	catch (err) {
		console.log(err);
		res.render('lastvisit', {lastVisit: 'Külastust ei leitud!'});
	}
	
});

app.listen(5222);