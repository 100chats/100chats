const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const port = process.env.PORT || 4000
const Users = require('./models/user')


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




// app.get('/user')
app.get('/user/:userId', async (req, res) => {
    try {
        const data = await readFromDb("userId", req.params.userId);

        res.status(200).json({ data });
        // res.status(200).json({ key });
    } catch (err) {
        console.log(err);
    }
});

// app.post('/createUser')
app.post('/createUser', async (req, res) => {
    console.log("debug", req.body)
    Object.keys(req).forEach(key => console.log(key))

    // try {
    //     const reqBody = req.body;

    //     writeToDb(
    //         reqBody.userId || "",
    //         reqBody.userName || "",
    //         reqBody.firstName || "",
    //         reqBody.lastName || "",
    //         reqBody.location || "",
    //         reqBody.age || "",
    //         reqBody.email || "",
    //         reqBody.linksSocial || "",
    //         reqBody.linksProjects || "",
    //         reqBody.userDescription || "",
    //         reqBody.userSwipes || "",
    //         reqBody.imageProfile || "",
    //     );

    res.status(201).send("done");
    // } catch (err) {
    //     console.log(err);
    // }
});

// app.put('/updateUser')
// app.delete('/deleteUser')
// app.get('/allUsers')
app.get('/allUsers', async (req, res) => {
    try {
        const data = await readFromDb();

        res.status(200).json({ data });
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
const writeToDb = async (userName,
    userId,
    firstName,
    lastName,
    location,
    age,
    email,
    linksSocial,
    linksProjects,
    userDescription,
    userSwipes,
    imageProfile) => {
    console.log('write to db');
    const query = { userName: userName };
    const updated_at = Date.now();
    const update = {
        $set: {
            userName,
            userId,
            firstName,
            lastName,
            location,
            age,
            email,
            linksSocial,
            linksProjects,
            userDescription,
            userSwipes,
            imageProfile
        },
        updated_at
    };

    return await Users.findOneAndUpdate(query, update, { upsert: true });
};