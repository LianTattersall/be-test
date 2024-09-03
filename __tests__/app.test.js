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
          expect(meals.breakfast).toBe("recipie-3");
          expect(meals.lunch).toBe("recipie-4");
          expect(meals.dinner).toBe("recipie-2");
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
      return request(app)
        .post("/api/users/user-0/calendar/5-9-2024")
        .send({ breakfast: "recipie-0", lunch: "recipie-4" })
        .expect(201)
        .then(({ body: { meals } }) => {
          expect(meals).toEqual({ breakfast: "recipie-0", lunch: "recipie-4" });
        });
    });
    test("400: responds with an error if the post info has incorrect data types", () => {
      return request(app)
        .post("/api/users/user-0/calendar/9-9-2024")
        .send({ breakfast: ["noodles"] })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Invalid data type for meal");
        });
    });
    test("400: responds with an error when the fields do not have the correct name", () => {
      return request(app)
        .post("/api/users/user-1/calendar/4-4-2020")
        .send({ brekkie: "recipie-2" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - invalid field in request body");
        });
    });
    test("404: responds with an error when the user id does not exist", () => {
      return request(app)
        .post("/api/users/user-50/calendar/2-2-2020")
        .send({ breakfast: "recipie-0" })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - User not found");
        });
    });
    test("400: responds with an error when date parameter is not the correct format", () => {
      return request(app)
        .post("/api/users/user-1/calendar/mon-3-2024")
        .send({ lunch: "recipie-3" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Date is not in the correct format");
        });
    });
    test("400: responds with an error when date parameter is not the correct format", () => {
      return request(app)
        .post("/api/users/user-1/calendar/123-3")
        .send({ dinner: "recipie-3" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Date is not in the correct format");
        });
    });
  });
  describe("PATCH", () => {
    test("200: responds with the fields modified when successful update has occured", () => {
      return request(app)
        .patch("/api/users/user-0/calendar/2-9-2024")
        .send({ dinner: "recipie-5" })
        .expect(200)
        .then(({ body: { meals } }) => {
          expect(meals).toEqual({ dinner: "recipie-5" });
        });
    });
  });
});
