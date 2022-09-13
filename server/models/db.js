const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // mongoose setup
    const conn = await mongoose.connect(process.env.DBSTRING);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = { connectDB };
