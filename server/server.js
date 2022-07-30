const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const port = process.env.PORT || 4000

app.listen(port, () => console.log(`listening on port: ${port}`))

// mongoose setup
mongoose.connect(process.env.DBSTRING);
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to db'));

app.get('/', async (req, res) => {
    try {
        res.send("Hello World");
    } catch (err) {
        console.log(err);
    }
});

