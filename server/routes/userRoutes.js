const express = require('express');
const router = express.Router();
const { readFromDb, writeToDb, deleteFromDb } = require('../helpers/dbhelpers');

router.get('/allusers', async (req, res) => {
	try {
		const data = await readFromDb();

		res.status(200).json({ data });
	} catch (err) {
		console.log(err);
	}
});
router.get('/:userid', async (req, res) => {
	try {
		const data = await readFromDb('userid', req.params.userid);

		res.status(200).send({ message: `Retrieve user data for ${req.params.userid}`, data: data });
		// res.status(200).json({ key });
	} catch (err) {
		console.log(err);
	}
});

router.delete('/:userid', async (req, res) => {
	let key = req.params.userid;
	console.log('deleting...', key);
	try {
		deleteFromDb(key);
		res.status(202).send({ message: `${key} has been deleted` });
	} catch (err) {
		console.log(err);
	}
});

router.post('/register', async (req, res) => {
	// console.log("debug", req.body)
	// Object.keys(req).forEach(key => console.log(key))

	try {
		const reqBody = req.body;
		console.log('reqBody', req.body);
		const write = await writeToDb({
			userid: reqBody.userid,
			username: reqBody.username,
			firstname: reqBody.firstname || '',
			lastname: reqBody.lastname || '',
			location: reqBody.location || '',
			age: reqBody.age || 0,
			email: reqBody.email || '',
			linkssocial: reqBody.linkssocial || {},
			linksprojects: reqBody.linksprojects || {},
			userdescription: reqBody.userdescription || '',
			userswipes: reqBody.userswipes || {},
			recommendqueue: reqBody.recommendqueue || [],
			imageprofile: reqBody.imageprofile || ''
		});

		res.status(201).send({ message: `User ${reqBody.userid} registered`, updated: reqBody, data: write });
	} catch (err) {
		console.log(err);
	}
});

// app.put('/updateUser')
// app.delete('/deleteUser')

module.exports = router;
