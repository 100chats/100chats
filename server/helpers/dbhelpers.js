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

module.exports = { readFromDb, writeToDb, deleteFromDb };
