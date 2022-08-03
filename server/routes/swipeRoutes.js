const express = require('express');
const router = express.Router();
const { readFromDb, writeToDb, deleteFromDb } = require('../helpers/dbhelpers');

router.post('/ismatch/:userid/:otherid', async (req, res) => {
	try {
		const userid = req.params.userid;
		const otherid = req.params.otherid;

		console.log('ismatch', userid, userid);

		const data = await readFromDb('userid', userid);
		let response = null;
		if (data.userswipes[otherid] !== undefined) {
			if (data.userswipes[otherid] === 'true') {
				response = true;
			} else if (data.userswipes[otherid] === 'false') {
				response = false;
			} else {
				res.status(400).send({
					message: `Something went wrong with user ${userid} and ${otherid} on /ismatch`,
					data: data,
					response: response
				});
			}
			const write = await writeToDb({ userid, userswipes: data.userswipes });
			res.status(200).send({
				message: `User ${userid} has user ${otherid} with value ${data.userswipes[otherid]}`,
				data: write,
				response: response
			});
		} else {
			res.status(404).send({ message: `User ${userid} does not have ${otherid}`, data: data, response: null });
		}
	} catch (err) {
		console.log(err);
	}
});

router.post('/:userid/:otherid/:bool', async (req, res) => {
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

module.exports = router;
