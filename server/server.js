const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const port = process.env.PORT || 4000;
const Users = require('./models/user');
const { logger } = require('./helpers/helpers');
const bodyParser = require('body-parser');
const { readFromDb, writeToDb, deleteFromDb } = require('./helpers/dbhelpers');

const users = require('./routes/userRoutes');
const swipe = require('./routes/swipeRoutes');
const login = require('./routes/loginRoutes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
//both index.js and things.js should be in same directory
app.use('/users', users);
app.use('/swipe', swipe);
app.use('/login', login);

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
		res.status(200).send('Getting "/"  route');
	} catch (err) {
		console.log(err);
	}
});

// TODO: login routes
