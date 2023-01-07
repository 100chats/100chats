"use strict";

var tinderContainer = document.querySelector(".tinder");
var allCards = document.querySelectorAll(".tinder--card");
var nope = document.getElementById("nope");
var love = document.getElementById("love");

function initCards(card, index) {
  var newCards = document.querySelectorAll(".tinder--card:not(.removed)");

  newCards.forEach(function (card, index) {
    card.style.zIndex = allCards.length - index;
    card.style.transform =
      "scale(" + (20 - index) / 20 + ") translateY(-" + 30 * index + "px)";
    card.style.opacity = (10 - index) / 10;
  });

  tinderContainer.classList.add("loaded");
}

initCards();

// console.log(
//   "message",
//   JSON.parse(message),
//   "currentUser",
//   JSON.parse(currentUser),
//   "\nnextUser",
//   JSON.parse(nextUser)
// );

allCards.forEach(function (el) {
  var hammertime = new Hammer(el);

  hammertime.on("pan", function (event) {
    el.classList.add("moving");
  });

  hammertime.on("pan", function (event) {
    if (event.deltaX === 0) return;
    if (event.center.x === 0 && event.center.y === 0) return;

    tinderContainer.classList.toggle("tinder_love", event.deltaX > 0);
    tinderContainer.classList.toggle("tinder_nope", event.deltaX < 0);

    var xMulti = event.deltaX * 0.03;
    var yMulti = event.deltaY / 80;
    var rotate = xMulti * yMulti;

    event.target.style.transform =
      "translate(" +
      event.deltaX +
      "px, " +
      event.deltaY +
      "px) rotate(" +
      rotate +
      "deg)";
  });

  hammertime.on("panend", async function (event) {
    el.classList.remove("moving");
    tinderContainer.classList.remove("tinder_love");
    tinderContainer.classList.remove("tinder_nope");

    var moveOutWidth = document.body.clientWidth;
    var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

    event.target.classList.toggle("removed", !keep);

    if (keep) {
      event.target.style.transform = "";
    } else {
      var endX = Math.max(
        Math.abs(event.velocityX) * moveOutWidth,
        moveOutWidth
      );
      var toX = event.deltaX > 0 ? endX : -endX;
      var endY = Math.abs(event.velocityY) * moveOutWidth;
      var toY = event.deltaY > 0 ? endY : -endY;
      var xMulti = event.deltaX * 0.03;
      var yMulti = event.deltaY / 80;
      var rotate = xMulti * yMulti;

      event.target.style.transform =
        "translate(" +
        toX +
        "px, " +
        (toY + event.deltaY) +
        "px) rotate(" +
        rotate +
        "deg)";

      initCards();
    }
    if (event.deltaX >= 0)
      await directionEvent({
        direction: true,
        userid: JSON.parse(currentUser).data.userid,
        otherid: JSON.parse(nextUser).data.userid,
      });
    if (event.deltaX <= 0)
      await directionEvent({
        direction: false,
        userid: JSON.parse(currentUser).data.userid,
        otherid: JSON.parse(nextUser).data.userid,
      });
  });
});

function createButtonListener({ direction, currentUser, nextUser }) {
  return async function (event) {
    var cards = document.querySelectorAll(".tinder--card:not(.removed)");
    var moveOutWidth = document.body.clientWidth * 1.5;

    if (!cards.length) return false;

    var card = cards[0];

    card.classList.add("removed");

    // console.log("currentUser", currentUser);
    // console.log("nextUser", nextUser);

    if (direction) {
      await directionEvent({
        direction: true,
        userid: JSON.parse(currentUser).data.userid,
        otherid: JSON.parse(nextUser).data.userid,
      });
      card.style.transform =
        "translate(" + moveOutWidth + "px, -100px) rotate(-30deg)";
    } else {
      await directionEvent({
        direction: false,
        userid: JSON.parse(currentUser).data.userid,
        otherid: JSON.parse(nextUser).data.userid,
      });
      card.style.transform =
        "translate(-" + moveOutWidth + "px, -100px) rotate(30deg)";
    }

    initCards();

    event.preventDefault();
  };
}

const directionEvent = async ({ direction, userid, otherid }) => {
  try {
    console.log("createButtonListener", "userid:", userid, "otherid:", otherid);
    console.log(`Swiped ${direction ? "yes" : "no"}`);
    console.log(window.location.origin);
    let swipeUrl = `${window.location.origin}/swipes/swipe`;
    let body = {};

    body["userid"] = userid;
    body["otherid"] = otherid;
    body["bool"] = direction;

    const response = await axios.post(swipeUrl, body);
    // response.then((e) => console.log(e));
    console.log("Message from directionEvent:", response);

    await renderNextUser({ userid: userid });
  } catch (err) {
    console.log("Error in directionEvent: ", err);
  }
};

var nopeListener = createButtonListener({
  direction: false,
  currentUser: currentUser,
  nextUser: nextUser,
});
var loveListener = createButtonListener({
  direction: true,
  currentUser: currentUser,
  nextUser: nextUser,
});

nope.addEventListener("click", nopeListener);
love.addEventListener("click", loveListener);

// tinderCard();
// render next user card
const renderNextUser = async ({ userid }) => {
  console.log("renderNextUser", userid);
  try {
    let nextCardUrl = `${window.location.origin}/swipes/nextCard`;

    const response = await axios.get(`${nextCardUrl}/${userid}`);

    console.log("Message from renderNextUser:", response);
  } catch (err) {
    console.log("Error in renderNextUser: ", err);
  }
};
