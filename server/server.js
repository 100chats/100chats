const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.PORT || 4000;
const Users = require("./models/user");
const { logger } = require("./helpers/helpers");
const bodyParser = require("body-parser");
const path = require("path");
const { readFromDb, writeToDb, deleteFromDb } = require("./helpers/dbhelpers");
const { connectDB } = require("./models/db");

const users = require("./routes/userRoutes");
const swipe = require("./routes/swipeRoutes");
const login = require("./routes/loginRoutes");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger);

app.use("/users", users);
app.use("/swipes", swipe);
app.use("/login", login);

app.set("json spaces", 2);

app.listen(port, () => console.log(`App is running on http://localhost:${port}`));
connectDB();

app.set("view engine", "ejs");

// app.use(express.static("public"));
const { auth } = require("express-openid-connect");

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: "a long, randomly-generated string stored in env",
  baseURL: "http://localhost:4000",
  clientID: "U2ee5rGnHGlXxHIP1srNgzarbCHuNihJ",
  issuerBaseURL: "https://dev-hd797ril.us.auth0.com",
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
  res.json({
    message: req.oidc.isAuthenticated()
      ? `Logged in ${JSON.stringify(req.oidc.user)}`
      : "Logged out",
  });
});

app.get("/", async (req, res) => {
  try {
    // res.status(200).json({message:'Getting "/"  route'});
    res.render("../server/views/index.ejs");
  } catch (err) {
    console.log(err);
  }
});
