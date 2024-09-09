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

  if (!validDataTypes(postInfo)) {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid data type for meal",
    });
  }

  if (!validInnerDataTypes(postInfo)) {
    return Promise.reject({
      status: 400,
      message:
        "400 - invalid data type for recipie_id recipie_name or my_recipie",
    });
  }

  if (!validKeys(postInfo)) {
    return Promise.reject({
      status: 400,
      message: "400 - invalid field in request body",
    });
  }

  if (!validInnerKeys(postInfo)) {
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
  if (!validDataTypes(patchInfo)) {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid data type for meal",
    });
  }
  if (!validInnerDataTypes(patchInfo)) {
    return Promise.reject({
      status: 400,
      message:
        "400 - invalid data type for recipie_id recipie_name or my_recipie",
    });
  }

  if (!validKeys(patchInfo)) {
    return Promise.reject({
      status: 400,
      message: "400 - invalid field in request body",
    });
  }
  if (!validInnerKeys(patchInfo)) {
    return Promise.reject({
      status: 400,
      message: "400 - invalid field in request body",
    });
  }

  return this.fetchMealsForUserByDate(user_id, date)
    .then((mealData) => {
      const newMealData = JSON.parse(JSON.stringify(mealData));
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

exports.addUserToCalendar = (user_id) => {
  const docRef = doc(calendarRef, user_id);
  return getDoc(docRef)
    .then((snapShot) => {
      if (snapShot.exists()) {
        return Promise.reject({
          status: 400,
          message: "400 - User already has a calendar",
        });
      }
      return setDoc(docRef, {});
    })
    .then(() => {
      return user_id;
    });
};

exports.removeMealForUserByDate = (user_id, date, meal) => {
  if (["breakfast", "lunch", "dinner", "extras"].indexOf(meal) === -1) {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid meal parameter",
    });
  }

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
    const data = snapShot.data();
    const meals = data[date];
    if (!meals) {
      return Promise.reject({
        status: 404,
        message: "404 - No meals for this date",
      });
    }
    delete meals[meal];
    return setDoc(docRef, data);
  });
};

function validDataTypes(info) {
  const infoKeys = Object.keys(info);
  const validDataTypes = infoKeys.every((key) => typeof info[key] === "object");
  return validDataTypes;
}

function validKeys(info) {
  const infoKeys = Object.keys(info);
  const validKeys = ["breakfast", "lunch", "dinner", "extras"];
  const validKeysOnBody = infoKeys.every((key) => validKeys.indexOf(key) >= 0);
  return validKeysOnBody;
}

function validInnerKeys(info) {
  const infoKeys = Object.keys(info);
  const greenList = ["recipie_id", "recipie_name", "my_recipie"];
  const validInnerKeys = infoKeys.every((key) => {
    const innerKeys = Object.keys(info[key]);
    return innerKeys.every((innerKey) => greenList.indexOf(innerKey) >= 0);
  });
  return validInnerKeys;
}

function validInnerDataTypes(info) {
  const infoKeys = Object.keys(info);
  const validInnerDataTypes = infoKeys.every((key) => {
    const valid_recipie_id = typeof info[key].recipie_id === "string";
    const valid_recipie_name = typeof info[key].recipie_name === "string";
    const valid_my_recipie = typeof info[key].my_recipie === "boolean";
    return valid_my_recipie && valid_recipie_id && valid_recipie_name;
  });
  return validInnerDataTypes;
}
