const express = require('express');
const router = express.Router();
const { readFromDb, writeToDb, deleteFromDb } = require('../helpers/dbhelpers');

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
