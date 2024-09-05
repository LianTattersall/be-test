const { collection, doc, setDoc, getDoc } = require("firebase/firestore");
const db = require("../db/connection");

const usersRef = collection(db, "users");

exports.addUser = (postInfo) => {
  const postKeys = Object.keys(postInfo);

  if (postKeys.length !== 3) {
    return Promise.reject({
      status: 400,
      message: "400 - Incorrect format for request body",
    });
  }

  const validData = postKeys.every((key) => typeof postInfo[key] === "string");
  if (!validData) {
    return Promise.reject({ status: 400, message: "400 - Invalid data type" });
  }

  const greenList = ["display_name", "avatar_url", "user_id"];
  const validKeys = postKeys.every((key) => greenList.indexOf(key) >= 0);
  if (!validKeys) {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid fields on request body",
    });
  }

  const { user_id, display_name, avatar_url } = postInfo;
  const docRef = doc(usersRef, user_id);
  const userDetalsToPost = {
    display_name,
    avatar_url,
    favourites: [],
    recipies: [],
    lists: [],
  };

  return getDoc(docRef)
    .then((snapShot) => {
      if (snapShot.exists()) {
        return Promise.reject({
          status: 400,
          message: "400 - User already exists",
        });
      }
      return setDoc(docRef, userDetalsToPost);
    })
    .then(() => {
      return {
        user_id,
        display_name,
        avatar_url,
        recipies: [],
        favourites: [],
        lists: [],
      };
    });
};
