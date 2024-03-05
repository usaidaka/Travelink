const Request = require("supertest");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

const db = require("../../models");
const GeneralHelper = require("../../server/helpers/generalHelper");
const AuthPlugin = require("../../server/api/auth");
const cloudinary = require("../../server/service/cloudinary");
const redis = require("../../server/service/redis");

const MockUser = require("../fixtures/database/user.json");
const MockCredential = require("../fixtures/database/credential.json");
const MockUserDetail = require("../fixtures/database/userDetail.json");
const MockAllUser = require("../fixtures/database/allUser.json");

let apiUrl;
let server;
let payload;
let header;

let mockUser;
let mockAllUser;
let mockUserDetail;
let mockCredential;

let getUser;
let getAllUser;
let getUserDetail;
let getCredential;

let createUser;
let createUserDetail;
let createCredential;

let updateUser;
let updateUserDetail;
let updateCredential;

let destroyCredential;

let jwtVerify;
let mockJsonWebTokenData;

let uploadCloudinary;

let redisSetFunction;
let redisGetFunction;

const tokenUserImmortal = {
  authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXRpIiwiZW1haWwiOiJrdWRvdDVAaWNsb3VkLmNvbSIsInJvbGUiOiJVc2VyIiwiaWF0IjoxNzA5MzU1NDA3LCJleHAiOjE3NDA4OTE0MDd9.obuyBYvVABujaU2LKa6pdyAQw85z_Ks_HE_Ehh5jygI",
};

const tokenResetImmortal = {
  authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzYWlkYWthIiwiZW1haWwiOiJ1amVka2VtYWxAZ21haWwuY29tIiwidHlwZSI6InJlc2V0LXBhc3N3b3JkIiwiaWF0IjoxNzA5NTI2OTExLCJleHAiOjE3NDEwNjI5MTF9.DY347UB2MqdUa5mXAQctPAlS8jGmsWjz7eyZySsaJBo",
};

const tokenAdminImmortal = {
  authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJGcmFuY2lzY28iLCJlbWFpbCI6InJ1c3NlbGw2QG91dGxvb2suY29tIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzA5MzU1MzM0LCJleHAiOjE3NDA4OTEzMzR9.9trXx2UmBMcg8OJjxrFrXRAOXyUySnZlTQmMIGcAvDM",
};

describe("Auth", () => {
  beforeAll(() => {
    server = GeneralHelper.createTestServer("/", AuthPlugin);
  });

  afterAll(async () => {
    await server.close();
  });

  describe("Register", () => {
    beforeEach(() => {
      apiUrl = "/register";
      payload = {
        username: "kevinTanes",
        email: "kevinTenes@gmail.com",
        password: "12345678",
        confirmPassword: "12345678",
        role: "User",
        first_name: "kevin",
        last_name: "tanes",
        gender: "Male",
        email_contact: "mama@gmail.com",
        phone: "089652433206",
        phone_contact: "08121312321",
        mbti: "ISTJ",
      };

      mockUser = _.cloneDeep(MockUser);

      getUser = jest.spyOn(db.User, "findOne");
      getUserDetail = jest.spyOn(db.UserDetail, "findOne");
      createUser = jest.spyOn(db.User, "create");
      createUserDetail = jest.spyOn(db.UserDetail, "create");
    });

    test("Should Return 200: Register Success", async () => {
      getUser.mockResolvedValue(null);
      getUserDetail.mockResolvedValue(null);
      createUser.mockResolvedValue("SUCCESS");
      createUserDetail.mockResolvedValue("SUCCESS");

      await Request(server)
        .post(apiUrl)
        .send(payload)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeTruthy();
        });
    });

    test("Should Return 400: Email Already Exists", async () => {
      payload.email = "janedoe@acme.com";
      getUser.mockResolvedValue(mockUser);
      createUser.mockResolvedValue("SUCCESS");

      await Request(server).post(apiUrl).send(payload).expect(400);
    });

    test("Should Return 400: Phone Already Exists", async () => {
      payload.phone = "089652433206";
      getUser.mockResolvedValue(mockUser);
      createUser.mockResolvedValue("SUCCESS");

      await Request(server).post(apiUrl).send(payload).expect(400);
    });

    test("Should Return 400: Username Already Exists", async () => {
      payload.username = "jokoTanes";
      getUser.mockResolvedValue(mockUser);
      createUser.mockResolvedValue("SUCCESS");

      await Request(server).post(apiUrl).send(payload).expect(400);
    });

    test("Should Return 400: Error Password and confirmPassword must to be equal", async () => {
      payload.password = "12345678";
      payload.confirmPassword = "1234567";
      getUser.mockResolvedValue(mockUser);
      createUser.mockResolvedValue("SUCCESS");

      await Request(server).post(apiUrl).send(payload).expect(400);
    });

    test("Should Return 400: Missing Required Payload", async () => {
      payload = {};

      await Request(server).post(apiUrl).send(payload).expect(400);
    });

    test("Should Return 400: Invalid Payload", async () => {
      payload.randomKey = "randomVal";

      await Request(server).post(apiUrl).send(payload).expect(400);
    });

    test("Should Return 400: Confirm Password Mismatched", async () => {
      payload.confirmPassword = "randomVal";

      await Request(server).post(apiUrl).send(payload).expect(400);
    });

    test("Should Return 500: Something Went Wrong with Database", async () => {
      createUser.mockRejectedValue("Something Went Wrong");

      await Request(server).post(apiUrl).send(payload).expect(500);
    });
  });

  describe("Login", () => {
    beforeEach(() => {
      apiUrl = "/login";
      payload = {
        email: "kudot5@icloud.com",
        password: "aaa1234",
      };

      mockUser = _.cloneDeep(MockUser);
      getUser = jest.spyOn(db.User, "findOne");

      redisGetFunction = jest.spyOn(redis, "getKey");
      redisSetFunction = jest.spyOn(redis, "setKey");
    });

    test("Should Return 200: Login Success", async () => {
      redisGetFunction.mockResolvedValue(null);
      getUser.mockResolvedValue(mockUser);
      redisSetFunction({
        key: `wrong-password/1`,
        value: JSON.stringify({ count: 0 }),
        isSetExpired: true,
        second: 0,
      });

      await Request(server)
        .post(apiUrl)
        .send(payload)
        .expect(200)
        .then((res) => {
          expect(!_.isEmpty(res.body)).toBeTruthy();
          expect(!_.isEmpty(res.body.token)).toBeTruthy();
        });
    });

    test("Should Return 400: Missing Required Payload", async () => {
      payload = {};

      await Request(server).post(apiUrl).send(payload).expect(400);
    });

    test("Should Return 400: Invalid Payload", async () => {
      payload.randomKey = "randomVal";

      await Request(server).post(apiUrl).send(payload).expect(400);
    });

    test("Should Return 400: Wrong Password", async () => {
      payload.password = "wrong_password";
      getUser.mockResolvedValue(mockUser);

      await Request(server).post(apiUrl).send(payload).expect(400);
    });

    test("Should Return 400: You have entered the wrong password 3 times. Please try again in 5 minutes", async () => {
      redisSetFunction.mockResolvedValue({
        key: `wrong-password/1`,
        value: JSON.stringify({ count: 4 }),
        isSetExpired: true,
        second: 60,
      });
      payload.password = "wrong_password";
      getUser.mockResolvedValue(mockUser);

      await Request(server).post(apiUrl).send(payload).expect(400);
    });

    test("Should Return 404: User Not Found", async () => {
      payload.email = "asdasd@gmail.com";
      getUser.mockResolvedValue({});

      await Request(server).post(apiUrl).send(payload).expect(404);
    });

    test("Should Return 500: Something Went Wrong with Database", async () => {
      getUser.mockRejectedValue("Something Went Wrong");

      await Request(server).post(apiUrl).send(payload).expect(500);
    });
  });

  describe("Forgot Password", () => {
    beforeEach(() => {
      apiUrl = "/forgot-password";
      payload = {
        email: "kudot5@icloud.com",
      };
      mockUser = _.cloneDeep(MockUser);
      getUser = jest.spyOn(db.User, "findOne");

      createCredential = jest.spyOn(db.Credential, "create");
      getCredential = _.cloneDeep(MockCredential);
    });

    test("Should Return 200: Forgot Password Success", async () => {
      getUser.mockResolvedValue(mockUser);
      createCredential.mockRejectedValue("SUCCESS");

      await Request(server)
        .post(apiUrl)
        .send(payload)
        .expect(200)
        .then((res) => {
          expect(res.body.ok).toBeTruthy();
          expect(res.body.message).toContain("Check your email");
        });
    });

    test("Should Return 404: User Not Found", async () => {
      payload.email = "asdasd@gmail.com";
      getUser.mockResolvedValue(null);

      await Request(server).post(apiUrl).send(payload).expect(404);
    });

    test("Should Return 500: Server internal error", async () => {
      getUser.mockRejectedValue("Something Went Wrong");

      await Request(server).post(apiUrl).send(payload).expect(500);
    });
  });

  describe("Reset Password", () => {
    beforeEach(() => {
      apiUrl = "/reset-password";
      payload = {
        otp: "67778a",
        newPassword: "aaa12345",
        confirmNewPassword: "aaa12345",
        token: tokenResetImmortal.authorization.split(" ")[1],
      };
      mockUser = _.cloneDeep(MockUser);
      getUser = jest.spyOn(db.User, "findOne");

      mockCredential = _.cloneDeep(MockCredential);
      getCredential = jest.spyOn(db.Credential, "findOne");

      destroyCredential = jest.spyOn(db.Credential, "destroy");
      updateUser = jest.spyOn(db.User, "update");
    });

    test("Should Return 200: Reset Password Success", async () => {
      getCredential.mockResolvedValue(mockCredential);
      console.log(payload, "payload");

      await Request(server)
        .post(apiUrl)
        .set(tokenResetImmortal)
        .send(payload)
        .expect(200)
        .then((res) => {
          expect(res.body.ok).toBeTruthy();
        });
    });

    test("Should Return 400: New Password and Confirm New Password must be match", async () => {
      payload.newPassword = "asdasd";
      payload.confirmNewPassword = "123123";
      getCredential.mockResolvedValue(mockCredential);

      await Request(server)
        .post(apiUrl)
        .set(tokenResetImmortal)
        .send(payload)
        .expect(400);
    });

    test("Should Return 400: New Password and Confirm New Password must be match", async () => {
      const credentialParanoid = {
        user_id: 1,
        otp: "67778a",
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_eyJ1c2VybmFtZSI6Impva29UYW5lcyIsImVtYWlsIjoiamFuZWRvZUBnbWFpbC5jb20iLCJ0eXBlIjoicmVzZXQtcGFzc3dvcmQiLCJpYXQiOjE3MDkzNTE4NDEsImV4cCI6MTcwOTM1MjQ0MX0_2YzNVRkweam7Yny0EAdiQZujG9IwT3dey1p8Z-4gNME",
        deletedAt: "Deleted",
      };

      getCredential.mockResolvedValue(credentialParanoid);

      await Request(server)
        .post(apiUrl)
        .set(tokenResetImmortal)
        .send(payload)
        .expect(400);
    });

    test("Should Return 400: Wrong OTP", async () => {
      payload.otp = null;
      getCredential.mockResolvedValue(mockCredential);

      await Request(server)
        .post(apiUrl)
        .set(tokenResetImmortal)
        .send(payload)
        .expect(400);
    });

    test("Should Return 404: Invalid OTP", async () => {
      payload.otp = "asdasd";
      getCredential.mockResolvedValue(mockCredential);

      await Request(server)
        .post(apiUrl)
        .set(tokenResetImmortal)
        .send(payload)
        .expect(404);
    });

    test("Should Return 200: Password successfully reset", async () => {
      getCredential.mockResolvedValue(mockCredential);
      destroyCredential.mockResolvedValue("SUCCESS");
      updateUser.mockResolvedValue("SUCCESS");

      await Request(server)
        .post(apiUrl)
        .send(payload)
        .set(tokenResetImmortal)
        .expect(200)
        .then((res) => {
          expect(res.body.ok).toBeTruthy();
        });
    });

    test("Should Return 500: Server internal error", async () => {
      getCredential.mockRejectedValue("Something Went Wrong");

      await Request(server)
        .post(apiUrl)
        .set(tokenResetImmortal)
        .send(payload)
        .expect(500);
    });
  });

  describe("Update Profile", () => {
    beforeEach(() => {
      apiUrl = "/profile";
      payload = {
        username: "aka",
        first_name: "usaid",
        last_name: "Aka",
        gender: "Male",
        email_contact: "mamaAka@gmail.com",
        phone: "0896524332011",
        phone_contact: "0891230142",
        mbti: "INFJ",
      };
      mockUser = _.cloneDeep(MockUser);
      getUser = jest.spyOn(db.User, "findOne");
      updateUser = jest.spyOn(db.User, "update");

      mockUserDetail = _.cloneDeep(MockUserDetail);
      getUserDetail = jest.spyOn(db.UserDetail, "findOne");
      updateUserDetail = jest.spyOn(db.UserDetail, "update");

      uploadCloudinary = jest.spyOn(cloudinary, "uploadToCloudinary");
    });
    test("Should Return 200: Update Profile Success", async () => {
      getUser.mockResolvedValue(mockUser);
      getUserDetail.mockResolvedValue(mockUserDetail);
      updateUser.mockResolvedValue("SUCCESS");
      updateUserDetail.mockResolvedValue("SUCCESS");

      await Request(server)
        .patch(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(200)
        .then((res) => {
          expect(res.body.ok).toBeTruthy();
          expect(res.body.message).toEqual("Profile successfully updated");
        });
    });

    test("Should Return 200: Update Profile Success", async () => {
      updateUser.mockResolvedValue("SUCCESS");

      const filePath = "./__test__/fixtures/file/logo.png";

      await Request(server)
        .patch(apiUrl)
        .set(tokenUserImmortal)
        .attach("file", filePath)
        .expect(200)
        .then((res) => {
          expect(res.body.ok).toBeTruthy();
          expect(res.body.message).toEqual("Profile successfully updated");
        });
    });

    test("Should Return 400: Phone Already Used", async () => {
      payload.phone = "089652433206";
      getUser.mockResolvedValue(mockUser);
      getUserDetail.mockResolvedValue(mockUserDetail);
      updateUser.mockResolvedValue("SUCCESS");
      updateUserDetail.mockResolvedValue("SUCCESS");

      await Request(server)
        .patch(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(400);
    });

    test("Should Return 400: User Already Used", async () => {
      payload.username = "jokoTanes";
      getUser.mockResolvedValue(mockUser);
      getUserDetail.mockResolvedValue(mockUserDetail);
      updateUser.mockResolvedValue("SUCCESS");
      updateUserDetail.mockResolvedValue("SUCCESS");

      await Request(server)
        .patch(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(400);
    });

    test("Should Return 200: Update with username successful", async () => {
      payload = { username: "tanes" };
      getUser.mockResolvedValue(mockUser);
      getUserDetail.mockResolvedValue(mockUserDetail);
      updateUser.mockResolvedValue("SUCCESS");
      updateUserDetail.mockResolvedValue("SUCCESS");

      await Request(server)
        .patch(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(200);
    });

    test("Should Return 200: Update with username successful", async () => {
      payload = { phone: "0812319132" };
      getUser.mockResolvedValue(mockUser);
      getUserDetail.mockResolvedValue(mockUserDetail);
      updateUser.mockResolvedValue("SUCCESS");
      updateUserDetail.mockResolvedValue("SUCCESS");

      await Request(server)
        .patch(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(200);
    });

    test("Should Return 401: Unauthorized", async () => {
      getUser.mockResolvedValue(mockUser);
      getUserDetail.mockResolvedValue(mockUserDetail);
      updateUser.mockResolvedValue("SUCCESS");
      updateUserDetail.mockResolvedValue("SUCCESS");

      await Request(server).patch(apiUrl).send(payload).expect(401);
    });

    test("Should Return 400: Invalid Payload", async () => {
      payload.invalidPayload = "invalid";
      getUser.mockResolvedValue(mockUser);
      getUserDetail.mockResolvedValue(mockUserDetail);
      updateUser.mockResolvedValue("SUCCESS");
      updateUserDetail.mockResolvedValue("SUCCESS");

      await Request(server)
        .patch(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(400);
    });

    test("Should Return 500: Server internal error", async () => {
      getUser.mockResolvedValue("Something Went Wrong");
      getUserDetail.mockResolvedValue("Something Went Wrong");

      await Request(server)
        .patch(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(500);
    });
  });

  describe("Change Password", () => {
    beforeEach(() => {
      apiUrl = "/change-password";
      payload = {
        password: "aaa1234",
        newPassword: "aaa123",
        confirmPassword: "aaa123",
      };
      mockUser = _.cloneDeep(MockUser);
      getUser = jest.spyOn(db.User, "findOne");
      updateUser = jest.spyOn(db.User, "update");
    });
    test("Should Return 200: Change Password Success", async () => {
      getUser.mockResolvedValue(mockUser);

      await Request(server)
        .patch(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(200)
        .then((res) => {
          expect(res.body.ok).toBeTruthy();
        });
    });

    test("Should Return 400: Wrong Password", async () => {
      payload.password = "test";
      getUser.mockResolvedValue(mockUser);

      await Request(server)
        .patch(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(400);
    });

    test("Should Return 400: New Password and Confirm New Password Must be Match", async () => {
      payload.confirmNewPassword = "test";
      getUser.mockResolvedValue(mockUser);

      await Request(server)
        .patch(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(400);
    });

    test("Should Return 400: Invalid Payload", async () => {
      payload.invalidPayload = "invalid";
      getUser.mockResolvedValue(mockUser);
      updateUser.mockResolvedValue("SUCCESS");

      await Request(server)
        .patch(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(400);
    });

    test("Should Return 401: Unauthorized", async () => {
      getUser.mockResolvedValue("Something Went Wrong");
      await Request(server).patch(apiUrl).send(payload).expect(401);
    });

    test("Should Return 500: Server internal error", async () => {
      getUser.mockResolvedValue("Something Went Wrong");
      await Request(server)
        .patch(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(500);
    });
  });

  describe("JWT Middleware", () => {
    beforeEach(() => {
      apiUrl = "/hello";
      header = {
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSmFuZSBEb2UiLCJwYXNzd29yZCI6IiQyYSQxMCRtR2Y2dTZXYkpUZFNCbzZHQ1FOOC9lTG5SQWlTc2ZMZXNsVnN1aWZtbS53akVBcWZZTzI3aSIsImlhdCI6MTcwNTQ3NzQ0MywiZXhwIjoxNzA1NTYzODQzfQ.MKSb_hkLJxmIvpI-bLc3vJQIVNAcnxtzRmKTzHXZTUg",
      };

      mockJsonWebTokenData = {
        name: "Jane Doe",
        password:
          "$2a$10$mGf6u6WbJTdSBo6GCQN8/eLnRAiSsfLeslVsuifmm.wjEAqfYO27i",
        iat: 1705477443,
        exp: 4070908800,
      };

      jwtVerify = jest.spyOn(jwt, "verify");
      jwtVerify.mockImplementation(() => mockJsonWebTokenData);
    });

    test("Should Return 200: JWT Verify Sucess", async () => {
      await Request(server).get(apiUrl).set(header).expect(200);
    });

    test("Should Return 401: JWT Does Not Contain Expiry Epoch", async () => {
      delete mockJsonWebTokenData.exp;
      jwtVerify.mockImplementation(() => mockJsonWebTokenData);

      await Request(server).get(apiUrl).set(header).expect(401);
    });

    test("Should Return 401: JWT Expired", async () => {
      mockJsonWebTokenData.exp = 946684800;
      jwtVerify.mockImplementation(() => mockJsonWebTokenData);

      await Request(server).get(apiUrl).set(header).expect(401);
    });

    test("Should Return 401: JWT Empty", async () => {
      mockJsonWebTokenData = {};
      jwtVerify.mockImplementation(() => mockJsonWebTokenData);

      await Request(server).get(apiUrl).set(header).expect(401);
    });

    test("Should Return 401: JWT Empty", async () => {
      mockJsonWebTokenData = {};
      jwtVerify.mockImplementation(() => mockJsonWebTokenData);

      await Request(server).get(apiUrl).set(header).expect(401);
    });

    test("Should Return 401: Invalid JWT Secret", async () => {
      header.authorization =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      jwtVerify.mockImplementation(() => new Error("Invalid Secret"));

      await Request(server).get(apiUrl).set(header).expect(401);
    });

    test("Should Return 401: Malformed Token", async () => {
      header.authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
      jwtVerify.mockImplementation(() => new Error("Malformed Token"));

      await Request(server).get(apiUrl).set(header).expect(401);
    });

    test("Should Return 401: Header Not Sent", async () => {
      await Request(server).get(apiUrl).expect(401);
    });
  });
});
