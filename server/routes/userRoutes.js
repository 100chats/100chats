const express = require("express");
const router = express.Router();
const {
  readFromDb,
  writeToDb,
  deleteFromDb,
  getAUser,
  registerUser,
} = require("../helpers/dbhelpers");
const Users = require("../models/user");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

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
    const data = await getAUser({ userid });
    res.status(200).json({ message: data.message, data: data.data });
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:userid", async (req, res) => {
  let key = req.params.userid;
  console.log("deleting...", key);
  try {
    deleteFromDb({ userid: key, collection: Users });
    res.status(202).json({ message: `${key} has been deleted` });
  } catch (err) {
    console.log(err);
  }
});

router.post("/register", async (req, res) => {
  try {
    const reqBody = req.body;
    console.log("reqBody", req.body);
    const { write } = reqBody.userid ? await registerUser({ reqBody }) : null;
    res.status(201).send({
      message: `User ${reqBody.userid} registered`,
      updated: reqBody,
      data: write,
    });
  } catch (err) {
    console.log(err);
  }
});
router.post("/profileimage", upload.single("image"), async (req, res) => {
  try {
    const reqBody = req.body;
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    // Create new user

    const write = await writeToDb({
      userid: reqBody.userid,
      profile_img: result.secure_url,
      cloudinary_id: result.public_id,
      collection: Users,
    });
    // save user details in mongodb

    res.status(201).send({
      message: `User ${reqBody.userid} uploaded an image`,
      data: write,
      result: result,
    });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
