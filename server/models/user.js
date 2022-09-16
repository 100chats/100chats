const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String },
  userid: { type: String, required: true },
  firstname: { type: String },
  lastname: { type: String },
  location: { type: String },
  profile_img: { type: String },
  cloudinary_id: { type: String },
  age: { type: Number },
  email: { type: String },
  linkssocial: { type: Object },
  linksprojects: { type: Object },
  userdescription: { type: String },
  userswipes: { type: Object },
  recommendqueue: { type: Array },
  imageprofile: { type: String },
  createdat: { type: Date, required: true, default: Date.now },
  updatedat: { type: Date, required: true },
});

module.exports = mongoose.model("Users", userSchema);
