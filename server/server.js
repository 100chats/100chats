const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.PORT || 4000;
const Users = require("./models/user");
const { logger } = require("./helpers/helpers");
const bodyParser = require("body-parser");
const path = require("path");
const {
  readFromDb,
  writeToDb,
  deleteFromDb,
  getAUser,
  nextUser,
  peekNextUser,
  registerUser,
} = require("./helpers/dbhelpers");
const { connectDB } = require("./models/db");
const cors = require("cors");
const axios = require("axios");

const users = require("./routes/userRoutes");
const swipe = require("./routes/swipeRoutes");
const login = require("./routes/loginRoutes");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger);

app.use("/users", users);
app.use("/swipes", swipe);
app.use("/login", login);

app.set("json spaces", 2);

app.listen(port, () =>
  console.log(`App is running on http://localhost:${port}`)
);
connectDB();
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

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
app.get("/", async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    const currentUser = await getAUser({ userid: req.oidc.user.email });
    // console.log("signedin as", currentUser);
    const reqBody = { userid: req.oidc.user.email };
    if (currentUser.data) {
      console.log("CurrentUser TRUE");
    } else {
      const register = await registerUser({ reqBody });
      // console.log("CurrentUser FALSE", register);
      const writedata = {
        ...req.oidc.user,
        collection: Users,
      };
      console.log("writedata", writedata, register);
      const write = await writeToDb({
        userid: req.oidc.user.email,
        ...writedata,
      });
    }
    const nextUser = await peekNextUser({ userid: req.oidc.user.email });
    console.log("nextuser", nextUser.response);

    const nextUserInfo = nextUser.data
      ? await getAUser({ userid: nextUser.response })
      : // : { profile_img: "https://picsum.photos/200/300" };
        null;

    res.render("../server/views/index.ejs", {
      message: req.oidc.user,
      currentUser: currentUser,
      nextUser: nextUserInfo,
    });
  } else {
    res.render("../server/views/logout.ejs", {});
  }
});
