const mysql = require('mysql2/promise');

//@desc home page for estonian film section
//@route GET /eestifilm
//@access public

const eestifilm = (req, res) => {
	res.render('eestifilm');
};

//@desc home page for people involved in Estonian film industry
//@route GET /eestifilm/inimesed
//@access public

const inimesed = async (req, res) => {
	console.log('Andmebaasiserver on: ' + process.env.DB_HOST);
	let conn;
	try {
			conn = await mysql.createConnection({
				host: process.env.DB_HOST,
				user: process.env.DB_USER,
				password: process.env.DB_PASS,
				database: process.env.DB_NAME,
			});
			//defineerime SQL päringu
			const sqlReq = 'SELECT * FROM person ORDER by last_name';
			const [sqlRes] = await conn.execute(sqlReq);
			//console.log(sqlRes);
			res.render('eestifilmiinimesed', {personList: sqlRes});
	}
	catch (err) {
			console.log('Andmebaasiga suhtlemise viga: ' + err);
			res.render('eestifilmiinimesed', {personList: []});
	}
	finally {
			if(conn){
					await conn.end();
			}
	}
};

//@desc home page for people involved in Estonian film industry
//@route GET /eestifilm/inimesed
//@access public

const inimesedAdd = (req, res) => {
    res.render('eestifilminimesed_lisa', {
        notice: 'Ootan sisestust!',
        firstName: null,
        lastName: null,
        born: null,
        deceased: null
    });
};

//@desc home page for people involved in Estonian film industry
//@route POST /eestifilm/inimesed
//@access public

const inimesedAddPost = async (req, res)=> {
	console.log('Andmebaasiserver on: ' + process.env.DB_HOST);
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
		});
		//defineerime SQL päringu
		const sqlReq = 'SELECT * FROM person ORDER by last_name';
		const [sqlRes] = await conn.execute(sqlReq);
		//console.log(sqlRes);
		res.render('eestifilminimesed', {personList: sqlRes});
	}
	catch (err) {
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('eestifilminimesed', {personList: []});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

//@desc home page for people involved in Estonian film industry
//@route POST /eestifilm/inimesed
//@access public

const inimesedAddPostAndmed = async (req, res)=> {
    console.log(req.body);
    const bornDate = new Date(req.body.bornInput);
    const timeNow = new Date();
    // Kontrollin sisestatud andmeid
    if(!req.body.firstNameInput || !req.body.lastNameInput ||
       !req.body.bornInput || isNaN(bornDate.getTime()) ||
       bornDate > timeNow){
        console.log("Andmed pole korrektsed!");
        return res.render('eestifilminimesed_lisa', {
            notice: 'Andmed pole korrektsed!',
            firstName: req.body.firstNameInput,
            lastName: req.body.lastNameInput,
            born: req.body.bornInput,
            deceased: req.body.deceasedInput
        });
    }
};

//@desc home page for people involved in Estonian film industry
//@route POST /eestifilm/inimesed
//@access public

const inimesedAddPostSurm = async (req, res)=> {
 // Kontrollime surmakuupäeva
    const deceasedDate = req.body.deceasedInput || null;
    const bornDate = new Date(req.body.bornInput);
    const timeNow = new Date();
    if(req.body.deceasedInput != ''){
        deceasedDate = new Date(req.body.deceasedInput);

        if(isNaN(deceasedDate.getTime()) ||
           deceasedDate > timeNow ||
           deceasedDate < bornDate){

            console.log("Surmakuupäev pole korrektne!");

            return res.render('eestifilminimesed_lisa', {
                notice: 'Surmakuupäev pole korrektne!',
                firstName: req.body.firstNameInput,
                lastName: req.body.lastNameInput,
                born: req.body.bornInput,
                deceased: req.body.deceasedInput
            });
        }

        deceasedDate = req.body.deceasedInput;
    }
};

//@desc home page for people involved in Estonian film industry
//@route POST /eestifilm/inimesed
//@access public

const inimesedAddPostAndmebaas = async (req, res)=> {
    // Salvestame inimese andmebaasi
    let conn;

    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });

        let sqlReq = 'INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)';
        await conn.execute(sqlReq, [
            req.body.firstNameInput,
            req.body.lastNameInput,
            req.body.bornInput,
            deceasedDate
        ]);

        res.render('eestifilminimesed_lisa', {
            notice: req.body.firstNameInput + ' ' +
                    req.body.lastNameInput + ' andmebaasi lisatud!',
            firstName: null,
            lastName: null,
            born: null,
            deceased: null
        });
    }
    catch (err) {
        console.log('Viga andmebaasiga suhtlemisel: ' + err);
        res.render('eestifilminimesed_lisa', {
            notice: 'Tekkis viga, midagi ei salvestatud!',
            firstName: req.body.firstNameInput,
            lastName: req.body.lastNameInput,
            born: req.body.bornInput,
            deceased: req.body.deceasedInput
        })
    }
    finally {
        if(conn){
            await conn.end();
        }
    }
};

//@desc home page for people involved in Estonian film industry
//@route POST /eestifilm/seosed_lisa
//@access public

const seosedLisa = async (req, res) => {
    let conn;
    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        const [personList] = await conn.execute(
            'SELECT id, first_name, last_name FROM person ORDER BY last_name'
        );

        const [movieList] = await conn.execute(
            'SELECT id, title FROM movie ORDER BY title'
        );

        const [professionList] = await conn.execute(
            'SELECT id, title FROM profession ORDER BY title'
        );

        res.render('eestifilmseosedlisa', {
            personList: personList,
            movieList: movieList,
            professionList: professionList
        });

    } catch (err) {
        console.log('Andmebaasi viga: ' + err);
        res.status(500).send('Andmete lugemine ebaõnnestus!');
    } finally {
        if (conn) {
            await conn.end();
        }
    }
};

//@desc save new connection
//@route POST /eestifilm/seosed_lisa
//@access public

const seosedLisaPost = async (req, res) => {
    let conn;
    try {
        const personId = req.body.personInput;
        const movieId = req.body.movieInput;
        const professionId = req.body.professionInput;
        const characterName = req.body.characterInput?.trim() || null;
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });
        const [selected] = await conn.execute('SELECT(SELECT COUNT(*) FROM person WHERE id = ?) AS persons,(SELECT COUNT(*) FROM movie WHERE id = ?) AS movies,(SELECT title FROM profession WHERE id = ?) AS profession',[personId, movieId, professionId]
        );
        if (
            !selected[0].persons ||
            !selected[0].movies ||
            !selected[0].profession
        ) {
            return res.status(400).send('Vigane valik!');
        }
        const finalCharacterName =
            selected[0].profession.toLowerCase() === 'näitleja'
                ? characterName
                : null;
        const [existing] = await conn.execute(
            `SELECT id FROM person_in_movie
             WHERE person_id = ?
             AND movie_id = ?
             AND profession_id = ?
             AND character_name <=> ?`,
            [personId, movieId, professionId, finalCharacterName]
        );
        if (existing.length > 0) {
            return res.send('Selline seos on juba olemas!');
        }
        await conn.execute('INSERT INTO person_in_movie(person_id, movie_id, profession_id, character_name) VALUES (?, ?, ?, ?)', [personId, movieId, professionId, finalCharacterName]
        );
        res.redirect('/eestifilm/seosed');
    } catch (err) {
        console.log('Andmebaasi viga: ' + err);
        res.status(500).send('Seose lisamine ebaõnnestus!');
    } finally {
        if (conn) {
            await conn.end();
        }
    }
};

//@desc show all connections
//@route GET /eestifilm/seosed
//@access public

const seosed = async (req, res) => {
    let conn;

    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });

        const sqlReq = `
            SELECT
                person.first_name,
                person.last_name,
                movie.title AS movie_title,
                profession.title AS profession_title,
                person_in_movie.character_name
            FROM person_in_movie
            JOIN person
                ON person_in_movie.person_id = person.id
            JOIN movie
                ON person_in_movie.movie_id = movie.id
            JOIN profession
                ON person_in_movie.profession_id = profession.id
            ORDER BY movie.title, person.last_name
        `;

        const [sqlRes] = await conn.execute(sqlReq);

        res.render('eestifilmseosed', {
            seosedList: sqlRes
        });

    } catch (err) {
        console.log('Andmebaasi viga: ' + err);
        res.status(500).send('Seoste lugemine ebaõnnestus!');
    } finally {
        if (conn) {
            await conn.end();
        }
    }
};

//@desc page for list Estonian Films
//@route GET /eestifilm/filmid
//@access public

//app.get('/eestifilm/filmid', async (req, res)=>{
const filmid = async (req, res) => {
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
		});
		const sqlReq = 'SELECT * FROM movie ORDER BY title';
		const [sqlRes] = await conn.execute(sqlReq);
		res.render('eestifilmfilmid', {movieList: sqlRes});
	}
	catch(err){
		console.log('viga andmebaasist lugemisel: ' + err);
		res.render('eestifilmfilmid', {movieList: []});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

//@desc page for adding Estonian Films
//@route GET /eestifilm/filmid_add
//@access public

//app.get('/eestifilm/filmid_add', (req, res)=>{
const filmidAdd = (req, res) => {
	res.render('eestifilmfilmid_add', {notice: 'ootan sisestust', movieTitle: null, releaseYear: null, duration: null, description: null});
};

//@desc page for adding Estonian Films
//@route POST /eestifilm/filmid_add
//@access public

//app.post('/eestifilm/filmid_add', async (req, res)=>{
const filmidAddPost = async (req, res) => {
	const now = new Date();
	const year = Number(req.body.yearInput);
	const duration = Number(req.body.durationInput);

	if(!req.body.titleInput){
		return res.render('eestifilmfilmid_add', {notice: 'filmi pealkiri puudub', movieTitle: req.body.titleInput, releaseYear: req.body.yearInput, duration: req.body.durationInput, description: req.body.descriptionInput});
	}
	if(!Number.isInteger(year) || year < 1880 || year > now.getFullYear()){
		return res.render('eestifilmfilmid_add', {notice: 'valmimisaasta on vigane', movieTitle: req.body.titleInput, releaseYear: req.body.yearInput, duration: req.body.durationInput, description: req.body.descriptionInput});
	}
	if(!Number.isInteger(duration) || duration <= 0){
		return res.render('eestifilmfilmid_add', {notice: 'kestus on vigane', movieTitle: req.body.titleInput, releaseYear: req.body.yearInput, duration: req.body.durationInput, description: req.body.descriptionInput});
	}

	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
		});
		let sqlReq = 'INSERT INTO movie (title, release_year, duration_minutes, description) VALUES (?,?,?,?)';
		await conn.execute(sqlReq, [req.body.titleInput, year, duration, req.body.descriptionInput || null]);
		res.render('eestifilmfilmid_add', {notice: 'andmed salvestati', movieTitle: null, releaseYear: null, duration: null, description: null});
	}
	catch (err){
		console.log('viga andmebaasiga suhtlemisel: ' + err);
		res.render('eestifilmfilmid_add', {notice: 'andmebaasi suhtlus nurjus', movieTitle: req.body.titleInput, releaseYear: req.body.yearInput, duration: req.body.durationInput, description: req.body.descriptionInput});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

//@desc page listing professions related to film
//@route GET /eestifilm/ametid
//@access public

const ametid = async (req, res)=>{
    console.log('Andmebaasi server on: ' + process.env.DB_HOST);
    let conn;
    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });
        const sqlReq = 'SELECT * FROM profession ORDER by id';
        const [sqlRes] = await conn.execute(sqlReq);
        //console.log(sqlRes);
        res.render('eestifilmametid', {professionList: sqlRes});
    }
    catch (err){
        console.log('Viga andmebaasist lugemisel:' + err);
        res.render('eestifilmametid', {professionList: []})
    }
    finally {
        if(conn) {
            await conn.end();
        }
    }

};

//@desc page for adding professions related to film
//@route GET /eestifilm/ametid_add
//@access public

const ametidAdd = (req, res)=>{
    res.render('eestifilmametid_add', {
        notice: 'Ootan sisestust!',
        title: null,
        description: null,

    });
};

//@desc page for adding professions related to film
//@route POST /eestifilm/ametid_add
//@access public

const ametidAddPost = async (req, res) => {
    const { title, description} = req.body;

    // Abifunktsioon vormi uuesti kuvamiseks
    const showForm = (notice, clear = false) => {
        res.render('eestifilmametid_add', {
            notice: notice,
            title: clear ? null : title,
            description: clear ? null : description

        });
    };
    if (
        !title?.trim() ||
        !description?.trim()

    ) {
        return showForm('Ootan sisestust!');
    }
    let conn;

    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });

        const sqlReq = 'INSERT INTO profession (title, description) VALUES (?, ?)';

        await conn.execute(sqlReq, [
            title.trim(),
            description.trim()
        ]);

        // Eduka salvestamise järel tühjendame vormi
        showForm('Andmed salvestati! Ootan uut sisestust!', true);

    } catch (err) {
        console.log('Viga andmebaasiga suhtlemisel: ' + err);
        showForm('Tekkis viga, andmeid ei salvestatud!');
    } finally {
        if (conn) {
            await conn.end();
        }
    }
};

module.exports = {
	eestifilm,
	inimesed,
	inimesedAdd,
	inimesedAddPost, 
	inimesedAddPostAndmed, 
	inimesedAddPostSurm, 
	inimesedAddPostAndmebaas,
	seosedLisa,
	seosedLisaPost,
	seosed,
	filmid,
	filmidAdd,
	filmidAddPost,
	ametid,
	ametidAdd,
	ametidAddPost
};
