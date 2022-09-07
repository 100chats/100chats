const express = require("express");
const router = express.Router();
const { readFromDb, writeToDb, deleteFromDb } = require("../helpers/dbhelpers");
const Users = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const data = await readFromDb({ collection: Users });

    res.status(200).json({ data });
  } catch (err) {
    console.log(err);
  }
});
router.get("/:userid", async (req, res) => {
  let userid = req.params.userid;
  try {
    const data = await readFromDb({
      key: "userid",
      value: userid,
      collection: Users,
    });

    res
      .status(200)
      .json({ message: `Retrieve user data for ${userid}`, data: data });
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:userid", async (req, res) => {
  let key = req.params.userid;
  console.log("deleting...", key);
  try {
    deleteFromDb(key);
    res.status(202).json({ message: `${key} has been deleted` });
  } catch (err) {
    console.log(err);
  }
});

router.post("/register", async (req, res) => {
  try {
    const reqBody = req.body;
    console.log("reqBody", req.body);
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
      userswipes: reqBody.userswipes || {},
      recommendqueue: reqBody.recommendqueue || [],
      imageprofile: reqBody.imageprofile,
      collection: Users,
    });

    res.status(201).send({
      message: `User ${reqBody.userid} registered`,
      updated: reqBody,
      data: write,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
