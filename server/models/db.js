const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // mongoose setup
    mongoose.connect(process.env.DBSTRING);
    const db = mongoose.connection;
    db.on("error", (error) => console.log(error));
    db.once("open", () => console.log("Connected to db :)"));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = { connectDB };
