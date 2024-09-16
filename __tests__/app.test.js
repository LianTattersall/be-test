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
          email: "lianwan345@gmail.com",
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
          email: "example@email.com",
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
          email: "example@email.com",
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
          email: "example@email.com",
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
  describe("GET", () => {
    test("200 - responds with all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(user).toEqual({
              email: expect.any(String),
              user_id: expect.any(String),
              display_name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
    test("200 - responds with a filtered array of users when passed a search term", () => {
      return request(app)
        .get("/api/users?searchTerm=hanna")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users.length).toBeLessThan(4);
          users.forEach((user) => {
            expect(user).toMatchObject({
              email: expect.any(String),
              user_id: expect.any(String),
              display_name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
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

describe("/api/users/:user_id/lists", () => {
  describe("GET", () => {
    test("200 - responds with all list info (id, name)", () => {
      return request(app)
        .get("/api/users/user-0/lists")
        .expect(200)
        .then(({ body: { lists } }) => {
          expect(lists[0]).toEqual({
            list_id: "list-3",
            list_name: "Housesahre flat 2",
          });
          expect(lists[1]).toEqual({
            list_id: "list-0",
            list_name: "Family shopping",
          });
        });
    });
    test("404 - responds with an error when the user does not exist", () => {
      return request(app)
        .get("/api/users/user-1000/lists")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - User not found");
        });
    });
    test("200 - responds with an empty array when the user has no lists", () => {
      return request(app)
        .get("/api/users/user-3/lists")
        .expect(200)
        .then(({ body: { lists } }) => {
          expect(lists).toEqual([]);
        });
    });
  });
  describe("POST", () => {
    test("201 - responds with the list_id and list_name that was posted to the user", () => {
      return request(app)
        .post("/api/users/user-0/lists")
        .send({ list_name: "Lians List", list_id: "list-4" })
        .expect(201)
        .then(({ body: { list } }) => {
          expect(list).toEqual({ list_name: "Lians List", list_id: "list-4" });
        });
    });
    test("404 - responds with an error when the user does not exist", () => {
      return request(app)
        .post("/api/users/user-10000/lists")
        .send({ list_id: "NBhgg456W", list_name: "List for user 10000" })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - User not found");
        });
    });
    test("400 - responds with an error when the data types are invalid", () => {
      return request(app)
        .post("/api/users/user-0/lists")
        .send({ list_id: 2, list_name: true })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Invalid data type");
        });
    });
    test("400 - respond with an error when the keys are invalid", () => {
      return request(app)
        .post("/api/users/user-0/lists")
        .send({ list: "my list", list_id: "123", list_name: "list" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Invalid fields on request body");
        });
    });
  });
});

describe("/api/users/:user_id/lists/:list_id", () => {
  describe("DELETE", () => {
    test("204 - empty response body when the list has successfully been deleted from a users profile", () => {
      return request(app)
        .delete("/api/users/user-0/lists/list-3")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
    test("404 - responds with an error when the user does not exist", () => {
      return request(app)
        .delete("/api/users/user-10002/lists/list-0")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - User not found");
        });
    });
    test("404 - responds with an error when the user does not have the specified list", () => {
      return request(app)
        .delete("/api/users/user-2/lists/list-30")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - List not found on user");
        });
    });
  });
});

describe("/api/lists/:list_id", () => {
  describe("GET", () => {
    test("200 - responds with all the list data for the specified list", () => {
      return request(app)
        .get("/api/lists/list-1")
        .expect(200)
        .then(({ body: { list } }) => {
          expect(list).toMatchObject({
            list_id: expect.any(String),
            list_name: expect.any(String),
            items: expect.any(Array),
            people: expect.any(Array),
          });
        });
    });
    test("404 - responds with an error when the list does not exist", () => {
      return request(app)
        .get("/api/lists/list-909090")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - List not found");
        });
    });
  });
  describe("PATCH", () => {
    test("200 - updates the list_name", () => {
      return request(app)
        .patch("/api/lists/list-0")
        .send({ list_name: "MY Grocery List" })
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({ list_name: "MY Grocery List" });
        });
    });
    test("404 - responds with an error when the list does not exist", () => {
      return request(app)
        .patch("/api/lists/list-203040")
        .send({ list_name: "Shopping!!!!" })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - List not found");
        });
    });
    test("400 - responds with an error when the list_name is not a string", () => {
      return request(app)
        .patch("/api/lists/list-1")
        .send({ list_name: [123] })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Invalid data type");
        });
    });
    test("400 - responds with an error when there are too many keys", () => {
      return request(app)
        .patch("/api/lists/list-2")
        .send({ list_name: "hi", list_other_name: "hihi" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Invalid request body");
        });
    });
    test("400 - responds with an error when the key if not list_name", () => {
      return request(app)
        .patch("/api/lists/list-2")
        .send({ list___name: "hihi" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Invalid request body");
        });
    });
  });
});

describe("/api/lists", () => {
  describe("POST", () => {
    test("201 - responds with the list that has just been created", () => {
      return request(app)
        .post("/api/lists")
        .send({ list_name: "Friends shopping", people: ["Lian", "Hanna"] })
        .expect(201)
        .then(({ body: { list } }) => {
          expect(list).toMatchObject({
            list_id: expect.any(String),
            list_name: "Friends shopping",
            people: ["Lian", "Hanna"],
            items: [],
          });
        });
    });
    test("400 - responds wth an error when the fields do not have the correct data types", () => {
      return request(app)
        .post("/api/lists")
        .send({ list_name: "Shooping", people: "Lian" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "400 - Invalid data type. 'people' key should be an array"
          );
        });
    });
    test("400 - responds with an error when the peoples array does not contain all strings", () => {
      return request(app)
        .post("/api/lists")
        .send({ list_name: "Shopping", people: [123] })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "400 - Invalid data type. 'people array should only contain strings"
          );
        });
    });
    test("400 - responds with an error when list_name is not a string", () => {
      return request(app)
        .post("/api/lists")
        .send({ list_name: { name: "shopping" }, people: ["Lian"] })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "400 - Invalid data type. list_name should be a string"
          );
        });
    });
    test("400 - responds with an error the keys are incorrect", () => {
      return request(app)
        .post("/api/lists")
        .send({ list_name: "shopping", users: ["Lian"] })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Invalid key on request body");
        });
    });
    test("400 - responds with an error when there are additional keys", () => {
      return request(app)
        .post("/api/lists")
        .send({
          list_name: "Shopping for me",
          people: ["Lian"],
          items: ["pickles"],
        })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Incorrect format for request body");
        });
    });
  });
});

describe("/api/lists/:list_id/items", () => {
  describe("POST", () => {
    test("200 - responds with the item that was just added", () => {
      return request(app)
        .post("/api/lists/list-0/items")
        .send({ item: "water" })
        .expect(201)
        .then(({ body: { item } }) => {
          expect(item).toBe("water");
        });
    });
    test("404 - responds with an error when the list oes not exist", () => {
      return request(app)
        .post("/api/lists/list-2003/items")
        .send({ item: "food" })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - List not found");
        });
    });
    test("400 - responds with an error when the item is not a string", () => {
      return request(app)
        .post("/api/lists/list-0/items")
        .send({ item: 243 })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Invalid data type");
        });
    });
    test("400 - reponds with an error when the kay is incorrect", () => {
      return request(app)
        .post("/api/lists/list-0/items")
        .send({ item_name: 243, item2: "hi" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Invalid format for request body");
        });
    });
  });
  describe("DELETE", () => {
    test("204 - responds with an empty body when it has successfully deleted all items from list", () => {
      return request(app)
        .delete("/api/lists/list-0/items")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
    test("404 - responds with an error when the list_id does not exist", () => {
      return request(app)
        .delete("/api/lists/list-2304/items")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - List not found");
        });
    });
  });
});

describe("/api/lists/:list_id/items/:item_index", () => {
  describe("DELETE", () => {
    test("204 - has an empty response body upon successful deletion of the item", () => {
      return request(app)
        .delete("/api/lists/list-0/items/0")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
    test("404 - responds with an error when the list does not exist", () => {
      return request(app)
        .delete("/api/lists/list-20358/items/0")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - List not found");
        });
    });
    test("404 - responds with an error when item does not exist at the specified index", () => {
      return request(app)
        .delete("/api/lists/list-0/items/234")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - Item not found");
        });
    });
  });
});

describe("/api/lists/:list_id/people", () => {
  describe.only("POST", () => {
    test("201 - responds with the successfull posted person", () => {
      return request(app)
        .post("/api/lists/list-0/people")
        .send({ user_id: "user-3", display_name: "HannaBremnerTattersall" })
        .expect(201)
        .then(({ body: { user } }) => {
          expect(user).toEqual({
            user_id: "user-3",
            display_name: "HannaBremnerTattersall",
          });
        });
    });
    test("404 - responds with an error when the list oes not exist", () => {
      return request(app)
        .post("/api/lists/list-2003/people")
        .send({ user_id: "user-3", display_name: "Lian" })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - List not found");
        });
    });
    test("400 - responds with an error when the data type is invalid", () => {
      return request(app)
        .post("/api/lists/list-0/people")
        .send({ user_id: [], display_name: "hi" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Invalid data type");
        });
    });
    test("400 - responds with an error when the request body format is incorect", () => {
      return request(app)
        .post("/api/lists/list-0/people")
        .send({ display_name: "hi" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Invalid format for request body");
        });
    });
    test("400 - responds with an error when the request body format is incorect", () => {
      return request(app)
        .post("/api/lists/list-0/people")
        .send({ display_name: "hi", idddd: "123" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Invalid format for request body");
        });
    });
  });
});
