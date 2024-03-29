const Users = require("../models/user");

// read all documents from db
const readFromDb = async ({
  key = undefined,
  value = undefined,
  collection = undefined,
}) => {
  console.log("read from db", key, value, collection);
  if (key !== undefined && value !== undefined) {
    return await collection.findOne({ [key]: value });
  } else {
    return await collection.find().lean();
  }
};

// helps to write to db. Upsert helps with adding if not found, or update if found.
const writeToDb = async ({
  collection = undefined,
  userid,
  username,
  firstname,
  lastname,
  profile_img,
  cloudinary_id,
  location,
  age,
  email,
  linkssocial,
  linksprojects,
  userdescription,
  userswipes,
  recommendqueue,
  imageprofile,
  nickname,
  name,
  picture,
  updated_at,

  email_verified,
  sub,
  sid,
}) => {
  console.log("write to db");
  const query = { userid };
  const updatedat = Date.now();
  const update = {
    $set: {
      userid,
      username,
      firstname,
      lastname,
      profile_img,
      cloudinary_id,
      location,
      age,
      email,
      linkssocial,
      linksprojects,
      userdescription,
      userswipes,
      recommendqueue,
      imageprofile,
      nickname,
      name,
      picture,
      updated_at,
      email_verified,
      sub,
      sid,
    },
    updatedat,
  };

  return await collection.findOneAndUpdate(query, update, { upsert: true });
};

const deleteFromDb = async ({ userid, collection = undefined }) => {
  console.log(`delete ${userid} from db`);
  const query = { userid: userid };
  return await collection.findOneAndDelete(query);
};

const getRandomUsers = async (count, swipedQueuedUsers, userid) => {
  const combinedUsers = [...swipedQueuedUsers, userid];
  // console.log("combinedUsers", combinedUsers);
  return await Users.aggregate([
    { $match: { userid: { $nin: combinedUsers } } },
    { $sample: { size: count } },
  ]);
};

const getSwipedUsers = async (userdata) => {
  return Object.keys(userdata.userswipes);
};
const getRecommendations = async ({ userid, count }) => {
  const data = await readFromDb({
    key: "userid",
    value: userid,
    collection: Users,
  });
  const swipedUsers = await getSwipedUsers(data);
  const randomUsers = await getRandomUsers(
    count,
    [...swipedUsers, ...data.recommendqueue],
    userid
  );
  const listOfUsers = randomUsers.map((user) => user.userid);
  data.recommendqueue.push(...listOfUsers);
  // data.recommendqueue = [];
  console.log("randomUsers", randomUsers);
  const write = await writeToDb({
    userid,
    recommendqueue: data.recommendqueue,
    collection: Users,
  });

  return { listOfUsers, write, data };
};

const getAUser = async ({ userid }) => {
  const data = await readFromDb({
    key: "userid",
    value: userid,
    collection: Users,
  });
  const message = `Retrieve user data for ${userid}`;
  return { data, message };
};

const forceBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
    throw "Bad request";
  }
};

const swipe = async ({ userid, otherid, direction }) => {
  try {
    const bool = forceBoolean(direction);
    const data = await readFromDb({
      key: "userid",
      value: userid,
      collection: Users,
    });
    data.userswipes[otherid] = {
      swipe: direction,
      time: new Date().toISOString(),
    };
    const write = await writeToDb({
      userid,
      userswipes: data.userswipes,
      collection: Users,
    });
    if (data.recommendqueue.length < 5) {
      const { message, data, added, recommendqueue, nextuser, write } =
        await writeRecommendations({ count: 5, userid });
    }

    const message = `Swipe by ${userid} successful: ${direction} on ${otherid}`;
    // call function to render next user card
    // const renderNext = await peekAndRenderNextUser({ userid });
    console.log("swipe", message);
    return { write, direction, message };
  } catch (err) {
    console.log(err);
    return { message: "Bad request" };
  }
};

const recommendation = async ({ count, userid }) => {
  if (typeof count === "number") {
    const { listOfUsers, write, data } = await getRecommendations({
      userid,
      count,
    });
    return {
      message: `User ${userid} queue addition successful: added ${data.recommendqueue.length} recommendations`,
      data: write,
      added: listOfUsers,
      recommendqueue: data.recommendqueue,
    };
  } else {
    throw "Bad request";
  }
};
const peekNextUser = async ({ userid }) => {
  try {
    let nextuser = 0;
    const data = await readFromDb({
      key: "userid",
      value: userid,
      collection: Users,
    });
    // console.log("peekNextUser", data, userid);
    if (data.recommendqueue?.length > 0) {
      nextuser = data.recommendqueue[0];
      console.log("peekNextUser");
    } else {
      const { message, data, added, recommendqueue, nextuser, write } =
        await writeRecommendations({ count: 5, userid });
    }

    return {
      message: `User ${userid} has next user in queue is ${nextuser} and has ${data.recommendqueue.length} recommendations left`,
      response: nextuser,
      data: data,
    };
  } catch (err) {
    console.log(err);
  }
};
const writeRecommendations = async ({ count, userid }) => {
  // let write = null;
  const { message, data, added, recommendqueue } = await recommendation({
    count: count,
    userid: userid,
  });
  console.log(
    "writeRecommendations",
    count,
    userid,
    message,
    data,
    added,
    "recommendqueue",
    recommendqueue
  );
  data.recommendqueue.push(...recommendqueue);
  // data.recommendqueue = [];

  nextuser = data.recommendqueue.shift();
  // console.log("TEST", data.recommendqueue, nextuser);

  const write = await writeToDb({
    userid,
    recommendqueue: data.recommendqueue,
    collection: Users,
  });
  return { message, data, added, recommendqueue, nextuser, write };
};

const nextUser = async ({ userid }) => {
  let nextuser = 0;
  let write = null;
  const data = await readFromDb({
    key: "userid",
    value: userid,
    collection: Users,
  });

  if (data.recommendqueue.length >= 1) {
    nextuser = data.recommendqueue.shift();
    write = await writeToDb({
      userid,
      recommendqueue: data.recommendqueue,
      collection: Users,
    });
  } else {
    let data = await writeRecommendations({ count: 5, userid });

    nextuser = data.recommendqueue.shift();
  }
  if (!data) data = data.write;
  return {
    message: `User ${userid}'s next user in queue is ${nextuser} and has ${data.recommendqueue.length} recommendations left`,
    response: nextuser,
    data: data,
  };
};

const isMatch = async ({ userid, otherid }) => {
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
      throw `Something went wrong with user ${userid} and ${otherid} on /ismatch`;
    }
    const write = await writeToDb({
      userid,
      userswipes: data.userswipes,
      collection: Users,
    });

    return {
      message: `User ${userid} has user ${otherid} with value ${data.userswipes[otherid].swipe}`,
      response: response,
      data: write,
    };
  } else {
    throw `User ${userid} does not have ${otherid}`;
  }
};
const registerUser = async ({ reqBody }) => {
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
    nickname: reqBody.nickname,
    name: reqBody.name,
    picture: reqBody.picture,
    updated_at: reqBody.updated_at,
    email_verified: reqBody.email_verified,
    sub: reqBody.sub,
    sid: reqBody.sid,

    collection: Users,
  });

  return { write };
};

module.exports = {
  readFromDb,
  writeToDb,
  deleteFromDb,
  getRandomUsers,
  getSwipedUsers,
  getRecommendations,
  getAUser,
  swipe,
  forceBoolean,
  recommendation,
  nextUser,
  isMatch,
  peekNextUser,
  registerUser,
};
