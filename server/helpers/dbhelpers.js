const Users = require('../models/user');
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
	recommendqueue,
	imageprofile
}) => {
	console.log('write to db');
	const query = { userid };
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
			recommendqueue,
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

const getRandomUsers = async (count, userid) => {
	return await Users.aggregate([ { $match: { userid: { $not: { $eq: userid } } } }, { $sample: { size: 3 } } ]);
};

module.exports = { readFromDb, writeToDb, deleteFromDb, getRandomUsers };
