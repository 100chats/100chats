const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const port = process.env.PORT || 4000;
const Users = require('./models/user');
const { logger } = require('./helpers/helpers');
const bodyParser = require('body-parser');

app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.use(express.json());
app.use(logger);
app.set('json spaces', 2);
app.listen(port, () => console.log(`listening on port: ${port}`));

// mongoose setup
mongoose.connect(process.env.DBSTRING);
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to db'));

app.get('/', async (req, res) => {
	try {
		res.send('Hello World');
	} catch (err) {
		console.log(err);
	}
});

// app.get('/user')
app.get('/user/:userId', async (req, res) => {
	try {
		const data = await readFromDb('userId', req.params.userId);

		res.status(200).json({ data });
		// res.status(200).json({ key });
	} catch (err) {
		console.log(err);
	}
});

// app.post('/register')
app.post('/register', async (req, res) => {
	// console.log("debug", req.body)
	// Object.keys(req).forEach(key => console.log(key))

	try {
		const reqBody = req.body;
		console.log('reqBody', req.body);
		const write = await writeToDb({
			userid: reqBody.userid,
			username: reqBody.username,
			firstname: reqBody.firstname,
			lastname: reqBody.lastname,
			location: reqBody.location,
			age: reqBody.age,
			email: reqBody.email,
			linkssocial: reqBody.linkssocial,
			linksprojects: reqBody.linksprojects,
			userdescription: reqBody.userdescription,
			userswipes: reqBody.userswipes,
			imageprofile: reqBody.imageprofile
		});

		res.status(201).send({ message: `User ${reqBody.userid} registered`, updated: reqBody, data: write });
	} catch (err) {
		console.log(err);
	}
});

// app.put('/updateUser')
// app.delete('/deleteUser')
app.delete('/deleteuser/:id', async (req, res) => {
	let key = req.params.id;
	console.log('deleting...', key);
	try {
		deleteFromDb(key);
		res.status(202).send({ message: `${key} has been deleted` });
	} catch (err) {
		console.log(err);
	}
});
// app.get('/allUsers')
app.get('/allusers', async (req, res) => {
	try {
		const data = await readFromDb();

		res.status(200).json({ data });
	} catch (err) {
		console.log(err);
	}
});

app.post('/swipe/:userid/:otherid/:bool', async (req, res) => {
	try {
		const bool = req.params.bool;
		const userid = req.params.userid;
		const otherid = req.params.otherid;

		console.log('swipe', userid, userid, bool, typeof bool);
		if (bool === 'true' || bool === 'false') {
			const data = await readFromDb('userid', userid);
			data.userswipes[otherid] = bool;
			const write = await writeToDb({ userid, userswipes: data.userswipes });

			res.status(200).send({ message: `Swipe by ${userid} successful: ${bool} on ${otherid}`, data: write });
		} else {
			res.status(400).send({ message: 'Bad request' });
		}
	} catch (err) {
		console.log(err);
	}
});
// app.get('/nextUser')
// app.get('/isMatch')

// TODO: login routes

// read all documents from db
const readFromDb = async (key, value) => {
	console.log('read from db');
	if (key != undefined && value != undefined) {
		return await Users.findOne({ [key]: value });
	} else {
		return await Users.find().lean();
	}
};

// helps to write to db. Upsert helps with adding if not found, or update if found.
const writeToDb = async ({
	userid,
	username,
	firstname,
	lastname,
	location,
	age,
	email,
	linkssocial,
	linksprojects,
	userdescription,
	userswipes,
	imageprofile
}) => {
	console.log('write to db');
	const query = { userid: userid };
	const updatedat = Date.now();
	const update = {
		$set: {
			userid,
			username,
			firstname,
			lastname,
			location,
			age,
			email,
			linkssocial,
			linksprojects,
			userdescription,
			userswipes,
			imageprofile
		},
		updatedat
	};

	return await Users.findOneAndUpdate(query, update, { upsert: true });
};

const deleteFromDb = async (userid) => {
	console.log(`delete ${userid} from db`);
	const query = { userid: userid };
	return await Users.findOneAndDelete(query);
};
