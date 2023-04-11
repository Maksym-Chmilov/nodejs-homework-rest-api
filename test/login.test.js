const mongoose = require("mongoose");
const app = require("../app");
const request = require("supertest");
require("dotenv").config();

const { DB_HOST} = process.env;
mongoose.set("strictQuery", true);

describe("login controller", () => {
  beforeAll(() => {
   return mongoose.connect(DB_HOST);
  });

  const credentials = {
    email: "buba@mail.com",
    password: "1234567",
  };

  test("Should return status code 200", async () => {
    const resLogin = await request(app)
      .post("/api/users/login")
      .send(credentials);
    expect(resLogin.statusCode).toBe(200);
  });

  test("Should return token", async () => {
    const resLogin = await request(app)
      .post("/api/users/login")
      .send(credentials);
    expect(resLogin.body.token).toBeTruthy();
  });

  test("Should return user object with 2 fields email and subscription, both of data type String", async () => {
    const resLogin = await request(app)
      .post("/api/users/login")
      .send(credentials);
    expect(typeof resLogin.body.user).toBe("object");
    expect(typeof resLogin.body.user.email).toBe("string");
    expect(typeof resLogin.body.user.subscription).toBe("string");
  });

  afterAll(() => {
    return mongoose.connection.close();
  });
});