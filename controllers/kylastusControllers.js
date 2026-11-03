const fs = require('fs').promises;
const dateTimeET = require('../src/dateTimeET.js');

const regtextRef = 'public/txt/visits.txt';

//@desc home page for visitors
//@route GET /külastus
//@access public

const kylastus = (req, res)=> {
	res.render('regvisit');
};

//@desc home page for visitors
//@route POST /külastus
//@access public

const kylastusPost = async (req, res)=> {
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
	
};

//@desc home page for visitors
//@route GET /külastus
//@access public

const kylastusViimane = async (req, res)=> {
	try {
		const data = await fs.readFile(regtextRef, 'utf8');
		const visits = data.split(';');
		const lastVisit = visits[visits.length - 2];
		const visitParts = lastVisit.split(',');
		const name = visitParts[0];
		const date = visitParts[1];
		const time = visitParts[2];
		const lastVisitText = 'Viimati registreeritud külastus ' + date + ', kell ' + time + ', kelleks oli ' + name + '.';
		res.render('lastvisit', {lastVisit: lastVisitText});
	}
	catch (err) {
		console.log(err);
		res.render('lastvisit', {lastVisit: 'Külastust ei leitud!'});
	}
	
};

module.exports = {
	kylastus,
	kylastusPost,
	kylastusViimane
};
