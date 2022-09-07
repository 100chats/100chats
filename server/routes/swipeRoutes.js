const express = require("express");
const router = express.Router();
const Users = require("../models/user");
const {
  readFromDb,
  writeToDb,
  deleteFromDb,
  getRandomUsers,
  getSwipedUsers,
  getRecommendations,
} = require("../helpers/dbhelpers");

router.post("/ismatch", async (req, res) => {
  try {
    const userid = req.body.userid;
    const otherid = req.body.otherid;

    console.log("ismatch", userid, userid);

    const data = await readFromDb({
      key: "userid",
      value: userid,
      collection: Users,
    });
    let response = null;
    if (data.userswipes[otherid] !== undefined) {
      if (data.userswipes[otherid].swipe === "true") {
        response = true;
      } else if (data.userswipes[otherid].swipe === "false") {
        response = false;
      } else {
        res.status(400).json({
          message: `Something went wrong with user ${userid} and ${otherid} on /ismatch`,
          data: data,
          response: response,
        });
      }
      const write = await writeToDb({
        userid,
        userswipes: data.userswipes,
        collection: Users,
      });
      res.status(200).json({
        message: `User ${userid} has user ${otherid} with value ${data.userswipes[otherid]}`,
        data: write,
        response: response,
      });
    } else {
      res.status(404).json({
        message: `User ${userid} does not have ${otherid}`,
        data: data,
        response: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// app.get('/nextUser')
router.post("/nextuser", async (req, res) => {
  try {
    const userid = req.body.userid;
    let nextuser = 0;
    let write = null;

    const data = await readFromDb({
      key: "userid",
      value: userid,
      collection: Users,
    });

    if (data.recommendqueue.length > 0) {
      nextuser = data.recommendqueue.shift();
      write = await writeToDb({
        userid,
        recommendqueue: data.recommendqueue,
        collection: Users,
      });
    } else {
      //   nextuser = 0;
      //   write = null;
      //   get more users
    }

    res.status(200).json({
      message: `User ${userid}'s next user in queue is ${nextuser} and has ${data.recommendqueue.length} recommendations left`,
      data: write,
      response: nextuser,
    });
  } catch (err) {
    console.log(err);
  }
});
router.post("/recommendation", async (req, res) => {
  try {
    const userid = req.body.userid;
    const count = Number(req.body.count || 20);

    if (typeof count === "number") {
      const { listOfUsers, write, data } = await getRecommendations({
        userid,
        count,
      });

      res.status(200).json({
        message: `User ${userid} queue addition successful: added ${data.recommendqueue.length} recommendations`,
        data: write,
        added: listOfUsers,
      });
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/swipe", async (req, res) => {
  try {
    const userid = req.body.userid;
    const otherid = req.body.otherid;
    let bool = req.body.bool;

    if (bool === "true" || bool === true) {
      bool = true;
    } else if (bool === "false" || bool === false) {
      bool = false;
    } else {
      res.status(400).json({ message: "Bad request" });
    }

    const data = await readFromDb({
      key: "userid",
      value: userid,
      collection: Users,
    });

    data.userswipes[otherid] = {
      swipe: bool,
      time: new Date().toISOString(),
    };

    const write = await writeToDb({
      userid,
      userswipes: data.userswipes,
      collection: Users,
    });

    res.status(200).json({
      message: `Swipe by ${userid} successful: ${bool} on ${otherid}`,
      data: write,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
