const {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
} = require("firebase/firestore");
const db = require("../db/connection");
const MiniSearch = require("minisearch");

const usersRef = collection(db, "users");

exports.addUser = (postInfo) => {
  const postKeys = Object.keys(postInfo);

  if (postKeys.length !== 4) {
    return Promise.reject({
      status: 400,
      message: "400 - Incorrect format for request body",
    });
  }

  const validData = postKeys.every((key) => typeof postInfo[key] === "string");
  if (!validData) {
    return Promise.reject({ status: 400, message: "400 - Invalid data type" });
  }

  const greenList = ["display_name", "avatar_url", "user_id", "email"];
  const validKeys = postKeys.every((key) => greenList.indexOf(key) >= 0);
  if (!validKeys) {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid fields on request body",
    });
  }

  const { user_id, display_name, avatar_url, email } = postInfo;
  const docRef = doc(usersRef, user_id);
  const userDetalsToPost = {
    email,
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

exports.fetchUsers = (searchTerm) => {
  return getDocs(usersRef).then((data) => {
    const users = data.docs.map((document) => {
      return {
        email: document.data().email,
        avatar_url: document.data().avatar_url,
        display_name: document.data().display_name,
        user_id: document.id,
      };
    });

    if (searchTerm) {
      const usersToSearch = data.docs.map((document) => {
        return { ...document.data(), id: document.id };
      });
      const miniSearch = new MiniSearch({ fields: ["display_name"] });
      miniSearch.addAll(usersToSearch);
      const resultsAutoComplete = miniSearch.autoSuggest(searchTerm);
      let results = [];
      resultsAutoComplete.forEach(({ suggestion }) => {
        results.push(...miniSearch.search(suggestion));
      });
      results = results.map((user) => user.id);
      const filteredUsers = users.filter(
        (user) => results.indexOf(user.user_id) >= 0
      );
      return filteredUsers;
    }
    return users;
  });
};
