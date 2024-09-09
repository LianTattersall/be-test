const { seed } = require("../db/seed");
const request = require("supertest");
const app = require("../app");
const endpointsObj = require("../endpoints.json");

beforeEach(() => {
  return seed();
});

describe("/api", () => {
  test("200: responds with the endpoints json", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsObj);
      });
  });
});

describe("/api/users/:user_id/calendar/:date", () => {
  describe("GET", () => {
    test("200: responds with the meals for the specified date", () => {
      return request(app)
        .get("/api/users/user-0/calendar/2-9-2024")
        .expect(200)
        .then(({ body: { meals } }) => {
          expect(meals.breakfast).toEqual({
            recpie_id: "recipie-3",
            recipie_name: "banana on toast",
            my_recipie: true,
          });
          expect(meals.lunch).toEqual({
            recpie_id: "recipie-4",
            recipie_name: "pot noodles",
            my_recipie: false,
          });
          expect(meals.dinner).toEqual({
            recpie_id: "recipie-5",
            recipie_name: "lasagne",
            my_recipie: false,
          });
        });
    });
    test("200: responds with an empty object when the date does not have any meals", () => {
      return request(app)
        .get("/api/users/user-2/calendar/3-9-2024")
        .expect(200)
        .then(({ body: { meals } }) => {
          expect(meals).toEqual({});
        });
    });
    test("404: responds with an error when the user does not exist", () => {
      return request(app)
        .get("/api/users/user-23/calendar/5-9-2024")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - User not found");
        });
    });
    test("400: responds with an error when date parameter is not the correct format", () => {
      return request(app)
        .get("/api/users/user-1/calendar/mon-2-2030")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Date is not in the correct format");
        });
    });
    test("400: responds with an error when date parameter is not the correct format", () => {
      return request(app)
        .get("/api/users/user-1/calendar/123-3")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Date is not in the correct format");
        });
    });
  });
  describe("POST", () => {
    test("201: reposonds with the data that was successfully posted", () => {
      const postInfo = {
        breakfast: {
          recipie_id: "123",
          recipie_name: "cheese on toast",
          my_recipie: true,
        },
        lunch: {
          recipie_id: "12345",
          recipie_name: "cheese on toast with mushroom",
          my_recipie: true,
        },
      };
      return request(app)
        .post("/api/users/user-0/calendar/5-9-2024")
        .send(postInfo)
        .expect(201)
        .then(({ body: { meals } }) => {
          expect(meals).toStrictEqual(postInfo);
        });
    });
    test("400: responds with an error if the post info has incorrect data types", () => {
      return request(app)
        .post("/api/users/user-0/calendar/9-9-2024")
        .send({ breakfast: "noodles" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Invalid data type for meal");
        });
    });
    test("400: responds with an error when the fields do not have the correct name", () => {
      const postInfo = {
        brekkie: {
          recipie_id: "123",
          recipie_name: "cheese on toast",
          my_recipie: true,
        },
      };
      return request(app)
        .post("/api/users/user-1/calendar/4-4-2020")
        .send(postInfo)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - invalid field in request body");
        });
    });
    test("404: responds with an error when the user id does not exist", () => {
      const postInfo = {
        breakfast: {
          recipie_id: "123",
          recipie_name: "cheese on toast",
          my_recipie: true,
        },
      };
      return request(app)
        .post("/api/users/user-50/calendar/2-2-2020")
        .send(postInfo)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - User not found");
        });
    });
    test("400: responds with an error when date parameter is not the correct format", () => {
      const postInfo = {
        breakfast: {
          recipie_id: "123",
          recipie_name: "cheese on toast",
          my_recipie: true,
        },
      };
      return request(app)
        .post("/api/users/user-1/calendar/mon-3-2024")
        .send(postInfo)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Date is not in the correct format");
        });
    });
    test("400: responds with an error when date parameter is not the correct format", () => {
      const postInfo = {
        breakfast: {
          recipie_id: "123",
          recipie_name: "cheese on toast",
          my_recipie: true,
        },
      };
      return request(app)
        .post("/api/users/user-1/calendar/123-3")
        .send(postInfo)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Date is not in the correct format");
        });
    });
    test("400 - responds with an error when inner fields are not valid", () => {
      const postInfo = {
        breakfast: {
          recipie_id: "123",
          recipie_name: "cheese on toast",
          my_recipie: true,
          ingredients: "food",
        },
      };
      return request(app)
        .post("/api/users/user-0/calendar/8-8-2024")
        .send(postInfo)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - invalid field in request body");
        });
    });
    test("400 - responds with an error when inner data types are invalid", () => {
      const postInfo = {
        breakfast: {
          recipie_id: "123",
          recipie_name: "cheese on toast",
          my_recipie: "true",
        },
      };
      return request(app)
        .post("/api/users/user-0/calendar/8-8-2024")
        .send(postInfo)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "400 - invalid data type for recipie_id recipie_name or my_recipie"
          );
        });
    });
  });
  describe("PATCH", () => {
    test("200: responds with the fields modified when successful update has occured", () => {
      const patchInfo = {
        breakfast: {
          recipie_id: "12SHE4",
          recipie_name: "Paneer Curry",
          my_recipie: true,
        },
      };
      return request(app)
        .patch("/api/users/user-0/calendar/2-9-2024")
        .send(patchInfo)
        .expect(200)
        .then(({ body: { meals } }) => {
          expect(meals).toEqual({
            breakfast: {
              recipie_id: "12SHE4",
              recipie_name: "Paneer Curry",
              my_recipie: true,
            },
          });
        });
    });
    test("400: responds with an error if the post info has incorrect data types", () => {
      return request(app)
        .patch("/api/users/user-0/calendar/2-9-2024")
        .send({ breakfast: "noodles" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Invalid data type for meal");
        });
    });
    test("400: responds with an error when the fields do not have the correct name", () => {
      const patchInfo = {
        brekkie: {
          recipie_id: "12SHE4",
          recipie_name: "Paneer Curry",
          my_recipie: true,
        },
      };
      return request(app)
        .patch("/api/users/user-1/calendar/2-9-2024")
        .send(patchInfo)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - invalid field in request body");
        });
    });
    test("404: responds with an error when the user id does not exist", () => {
      const patchInfo = {
        breakfast: {
          recipie_id: "12SHE4",
          recipie_name: "Paneer Curry",
          my_recipie: true,
        },
      };
      return request(app)
        .patch("/api/users/user-50/calendar/2-9-2024")
        .send(patchInfo)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - User not found");
        });
    });
    test("400: responds with an error when date parameter is not the correct format", () => {
      const patchInfo = {
        breakfast: {
          recipie_id: "12SHE4",
          recipie_name: "Paneer Curry",
          my_recipie: true,
        },
      };
      return request(app)
        .patch("/api/users/user-0/calendar/mon-3-2024")
        .send(patchInfo)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Date is not in the correct format");
        });
    });
    test("400: responds with an error when date parameter is not the correct format", () => {
      const patchInfo = {
        breakfast: {
          recipie_id: "12SHE4",
          recipie_name: "Paneer Curry",
          my_recipie: true,
        },
      };
      return request(app)
        .post("/api/users/user-1/calendar/123-3")
        .send(patchInfo)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Date is not in the correct format");
        });
    });
    test("400 - responds with an error when inner fields are not valid", () => {
      const patchInfo = {
        breakfast: {
          recipie_id: "123",
          recipie_name: "cheese on toast",
          my_recipie: true,
          ingredients: "food",
        },
      };
      return request(app)
        .patch("/api/users/user-0/calendar/8-8-2024")
        .send(patchInfo)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - invalid field in request body");
        });
    });
    test("400 - responds with an error when inner data types are invalid", () => {
      const patchInfo = {
        breakfast: {
          recipie_id: "123",
          recipie_name: "cheese on toast",
          my_recipie: "true",
        },
      };
      return request(app)
        .patch("/api/users/user-0/calendar/8-8-2024")
        .send(patchInfo)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "400 - invalid data type for recipie_id recipie_name or my_recipie"
          );
        });
    });
  });
});

describe("/api/users/:user_id/calendar/:date/:meal", () => {
  describe("DELETE", () => {
    test("204: response is empty when the meal has successfully been deleted", () => {
      return request(app)
        .delete("/api/users/user-0/calendar/2-9-2024/breakfast")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
    test("404 - responds with an error when the user does not exist", () => {
      return request(app)
        .delete("/api/users/user-10/calendar/2-2-2024/lunch")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - User not found");
        });
    });
    test("400 - responds with an error when the date is not in the correct format", () => {
      return request(app)
        .delete("/api/users/user-1/calendar/mon-2-2030/lunch")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Date is not in the correct format");
        });
    });
    test("400: responds with an error when date parameter is not the correct format", () => {
      return request(app)
        .delete("/api/users/user-1/calendar/123-3/dinner")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Date is not in the correct format");
        });
    });
    test("404 - resopnds with an error when the date does not exist", () => {
      return request(app)
        .delete("/api/users/user-1/calendar/1-3-2025/dinner")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - No meals for this date");
        });
    });
    test("404 - resopnds with an error when meal parameter is invalid", () => {
      return request(app)
        .delete("/api/users/user-0/calendar/2-9-2024/brunch")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Invalid meal parameter");
        });
    });
  });
});

describe("/api/users", () => {
  describe("POST", () => {
    test("201: responds with the data posted upon successful post", () => {
      return request(app)
        .post("/api/users")
        .send({
          user_id: "AB56HY",
          display_name: "Lian Wan",
          avatar_url: "https:mypic",
        })
        .expect(201)
        .then(({ body: { user } }) => {
          expect(user).toEqual({
            user_id: "AB56HY",
            display_name: "Lian Wan",
            avatar_url: "https:mypic",
            recipies: [],
            favourites: [],
            lists: [],
          });
        });
    });
    test("400: responds with an error when the data types are incorrect", () => {
      return request(app)
        .post("/api/users")
        .send({
          user_id: "123",
          display_name: ["Lian", "Wan"],
          avatar_url: "lkjfh",
        })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Invalid data type");
        });
    });
    test("400: responds with an error when the keys are not correct", () => {
      return request(app)
        .post("/api/users")
        .send({
          user_id: "123",
          display_nameeee: "Hanna",
          avatar_url: "adskgh",
        })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Invalid fields on request body");
        });
    });
    test("400: responds with an error when there are missing or additional fields", () => {
      return request(app)
        .post("/api/users")
        .send({ user_id: "123" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Incorrect format for request body");
        });
    });
    test("400 - responds with an error when a user already exists  with the same id", () => {
      return request(app)
        .post("/api/users")
        .send({
          user_id: "user-0",
          display_name: "imposter",
          avatar_url: "no-img",
        })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - User already exists");
        });
    });
  });
});

describe("/api/users/:user_id/calendar", () => {
  describe("POST", () => {
    test("201: responds with the user_id that was posted to the calendar", () => {
      return request(app)
        .post("/api/users/user-10/calendar")
        .expect(201)
        .then(({ body: { user_id } }) => {
          expect(user_id).toBe("user-10");
        });
    });
    test("400: responds with an error when the user_id is already posted to the calendar", () => {
      return request(app)
        .post("/api/users/user-0/calendar")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - User already has a calendar");
        });
    });
  });
});
