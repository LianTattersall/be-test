const { collection, getDoc, doc, setDoc } = require("firebase/firestore");
const db = require("../db/connection");

const calendarRef = collection(db, "calendar");

exports.fetchMealsForUserByDate = (user_id, date) => {
  const dateArr = date.split("-");

  if (!dateArr.every((date) => Number(date)) || dateArr.length !== 3) {
    return Promise.reject({
      status: 400,
      message: "400 - Date is not in the correct format",
    });
  }

  const docRef = doc(calendarRef, user_id);
  return getDoc(docRef).then((snapShot) => {
    if (!snapShot.exists()) {
      return Promise.reject({ status: 404, message: "404 - User not found" });
    }
    const allMealData = snapShot.data();
    const mealData = allMealData[date] || {};
    return mealData;
  });
};

exports.addMealForUserByDate = (user_id, date, postInfo) => {
  const docRef = doc(calendarRef, user_id);
  const postInfoKeys = Object.keys(postInfo);
  const validDataTypes = postInfoKeys.every(
    (key) => typeof postInfo[key] === "string"
  );
  if (!validDataTypes) {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid data type for meal",
    });
  }

  const validKeys = ["breakfast", "lunch", "dinner", "extras"];
  const validKeysOnBody = postInfoKeys.every(
    (key) => validKeys.indexOf(key) >= 0
  );
  if (!validKeysOnBody) {
    return Promise.reject({
      status: 400,
      message: "400 - invalid field in request body",
    });
  }
  const dateArr = date.split("-");

  if (!dateArr.every((date) => Number(date)) || dateArr.length !== 3) {
    return Promise.reject({
      status: 400,
      message: "400 - Date is not in the correct format",
    });
  }
  const formattedPostInfo = {};
  formattedPostInfo[date] = postInfo;
  return getDoc(docRef)
    .then((snapShot) => {
      if (!snapShot.exists()) {
        return Promise.reject({ status: 404, message: "404 - User not found" });
      }
      return setDoc(docRef, formattedPostInfo, { merge: true });
    })
    .then(() => {
      return postInfo;
    });
};

exports.updateMealForUserByDate = (user_id, date, patchInfo) => {
  const docRef = doc(calendarRef, user_id);
  return this.fetchMealsForUserByDate(user_id, date)
    .then((mealData) => {
      const newMealData = { ...mealData };
      Object.keys(patchInfo).forEach((key) => {
        newMealData[key] = patchInfo[key];
      });
      const formattedMealData = {};
      formattedMealData[date] = newMealData;
      return setDoc(docRef, formattedMealData, { merge: true });
    })
    .then(() => {
      return patchInfo;
    });
};
