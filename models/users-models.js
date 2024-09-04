const { collection, doc, setDoc } = require("firebase/firestore");
const db = require("../db/connection");

const usersRef = collection(db, "users");

exports.addUser = (user_id, display_name, avatar_url) => {
  const docRef = doc(usersRef, user_id);
  const userDetalsToPost = {
    display_name,
    avatar_url,
    favourites: [],
    recipies: [],
  };

  return setDoc(docRef, userDetalsToPost).then(() => {
    return { user_id, display_name, avatar_url, recipies: [], favourites: [] };
  });
};
