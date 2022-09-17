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
  swipe,
  recommendation,
  nextUser,
  isMatch,
} = require("../helpers/dbhelpers");

router.post("/ismatch", async (req, res) => {
  try {
    const userid = req.body.userid;
    const otherid = req.body.otherid;
    const { message, response, data } = await isMatch({ userid, otherid });
    res.status(200).json({ message, response, data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
});

router.post("/nextuser", async (req, res) => {
  try {
    const userid = req.body.userid;
    const { message, data, write, response } = await nextUser({
      userid: userid,
    });
    res.status(200).json({ message, response, data, write });
  } catch (err) {
    console.log(err);
  }
});

router.post("/recommendation", async (req, res) => {
  try {
    const userid = req.body.userid;
    const count = Number(req.body.count || 20);
    const { message, data, added } = await recommendation({ count, userid });
    res.status(200).json({ message, data, added });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
});

router.post("/swipe", async (req, res) => {
  try {
    const userid = req.body.userid;
    const otherid = req.body.otherid;
    let bool = req.body.bool;

    const swipeData = await swipe({ userid, otherid, direction: bool });
    res.status(200).json({
      message: swipeData.message,
      data: swipeData.write,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
