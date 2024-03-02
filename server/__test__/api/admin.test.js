const Request = require("supertest");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const QS = require("qs");

const db = require("../../models");
const GeneralHelper = require("../../server/helpers/generalHelper");
const AdminPlugin = require("../../server/api/admin");
const cloudinary = require("../../server/service/cloudinary");

const MockDestination = require("../fixtures/database/destination.json");
const MockAllUser = require("../fixtures/database/allUser.json");
const MockAllDestination = require("../fixtures/database/allDestination.json");
const MockImageDestination = require("../fixtures/database/imageDestination.json");

let apiUrl;
let server;
let payload;
let header;

let mockDestination;
let mockAllDestination;
let mockImageDestination;
let mockAllUser;

let getDestination;
let getAllDestination;
let getImageDestination;
let getAllUser;

let createDestination;
let createImageDestination;

let updateDestination;
let updateImageDestination;

let deleteDestination;
let deleteImageDestination;

let uploadCloudinary;

const tokenUserImmortal = {
  authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXRpIiwiZW1haWwiOiJrdWRvdDVAaWNsb3VkLmNvbSIsInJvbGUiOiJVc2VyIiwiaWF0IjoxNzA5MzU1NDA3LCJleHAiOjE3NDA4OTE0MDd9.obuyBYvVABujaU2LKa6pdyAQw85z_Ks_HE_Ehh5jygI",
};

const tokenUserNoLeaderImmortal = {
  authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJYaXV5aW5nIiwiZW1haWwiOiJ0eGl1eWluZzZAaWNsb3VkLmNvbSIsInJvbGUiOiJVc2VyIiwiaWF0IjoxNzA5MzgyMjA1LCJleHAiOjE3NDA5MTgyMDV9.d0D7DxSUA4b0_o9nXmYwvbuN0hjXr8Gt01tlr4NAVOw",
};

const tokenAdminImmortal = {
  authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJGcmFuY2lzY28iLCJlbWFpbCI6InJ1c3NlbGw2QG91dGxvb2suY29tIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzA5MzU1MzM0LCJleHAiOjE3NDA4OTEzMzR9.9trXx2UmBMcg8OJjxrFrXRAOXyUySnZlTQmMIGcAvDM",
};

describe("Admin", () => {
  beforeAll(() => {
    server = GeneralHelper.createTestServer("/", AdminPlugin);
  });

  afterAll(async () => {
    await server.close();
  });

  describe("Create Destination", () => {
    beforeEach(() => {
      apiUrl = "/destination";
      payload = {
        province_id: 1,
        city_id: 17,
        phone: "089123971212",
        detail: "Lorem Ipsum",
        description: "Lorem Ipusm asim dolor met",
        latitude: "-2.4309211649558473",
        longitude: "106.37843076052444",
      };
      mockDestination = _.cloneDeep(MockDestination);
      createDestination = jest.spyOn(db.Destination, "create");

      createImageDestination = jest.spyOn(db.ImageDestination, "create");

      uploadCloudinary = jest.spyOn(cloudinary, "uploadToCloudinary");
    });

    test("Should Return 200 : Create Destination Successful", async () => {
      createDestination.mockResolvedValue("SUCCESS");
      createImageDestination.mockResolvedValue("SUCCESS");

      const filePath = "./__test__/fixtures/file/logo.png";

      await Request(server)
        .post(apiUrl)
        .set(tokenAdminImmortal)
        .field("province_id", payload.province_id)
        .field("city_id", payload.city_id)
        .field("phone", payload.phone)
        .field("detail", payload.detail)
        .field("description", payload.description)
        .field("latitude", payload.latitude)
        .field("longitude", payload.longitude)
        .attach("file", filePath)
        .expect(200);
    });

    test("Should Return 400 : Image cannot be empty", async () => {
      createDestination.mockResolvedValue("SUCCESS");
      createImageDestination.mockResolvedValue("SUCCESS");

      await Request(server)
        .post(apiUrl)
        .set(tokenAdminImmortal)
        .field("province_id", payload.province_id)
        .field("city_id", payload.city_id)
        .field("phone", payload.phone)
        .field("detail", payload.detail)
        .field("description", payload.description)
        .field("latitude", payload.latitude)
        .field("longitude", payload.longitude)
        .expect(400);
    });

    test("Should Return 401: Unauthorized", async () => {
      createDestination.mockResolvedValue("SUCCESS");
      createImageDestination.mockResolvedValue("SUCCESS");

      await Request(server)
        .post(apiUrl)
        .field("province_id", payload.province_id)
        .field("city_id", payload.city_id)
        .field("phone", payload.phone)
        .field("detail", payload.detail)
        .field("description", payload.description)
        .field("latitude", payload.latitude)
        .field("longitude", payload.longitude)
        .expect(401);
    });

    test("Should Return 500: Something Went Wrong with Database", async () => {
      createDestination.mockRejectedValue("Something Went Wrong");
      createImageDestination.mockRejectedValue("Something Went Wrong");

      const filePath = "./__test__/fixtures/file/logo.png";

      await Request(server)
        .post(apiUrl)
        .set(tokenAdminImmortal)
        .field("province_id", payload.province_id)
        .field("city_id", payload.city_id)
        .field("phone", payload.phone)
        .field("detail", payload.detail)
        .field("description", payload.description)
        .field("latitude", payload.latitude)
        .field("longitude", payload.longitude)
        .attach("file", filePath)
        .expect(500);
    });
  });

  describe("Edit Destination", () => {
    beforeEach(() => {
      id = 2;
      apiUrl = "/destination";
      payload = {
        province_id: 1,
        city_id: 17,
        phone: "089123971212",
        detail: "Lorem Ipsum",
        description: "Lorem Ipusm asim dolor met",
        latitude: "-2.4309211649558473",
        longitude: "106.37843076052444",
      };
      mockDestination = _.cloneDeep(MockDestination);
      updateDestination = jest.spyOn(db.Destination, "update");

      updateImageDestination = jest.spyOn(db.ImageDestination, "update");

      uploadCloudinary = jest.spyOn(cloudinary, "uploadToCloudinary");
    });

    test("Should Return 200 : Update Destinantion", async () => {
      updateDestination.mockResolvedValue("SUCCESS");
      updateImageDestination.mockResolvedValue("SUCCESS");

      const filePath = "./__test__/fixtures/file/logo.png";

      await Request(server)
        .patch(`${apiUrl}/${id}`)
        .set(tokenAdminImmortal)
        .field("province_id", payload.province_id)
        .field("city_id", payload.city_id)
        .field("phone", payload.phone)
        .field("detail", payload.detail)
        .field("description", payload.description)
        .field("latitude", payload.latitude)
        .field("longitude", payload.longitude)
        .attach("file", filePath)
        .expect(200);
    });

    test("Should Return 404 : Destination not found", async () => {
      id = 10000;
      updateDestination.mockResolvedValue("SUCCESS");
      updateImageDestination.mockResolvedValue("SUCCESS");

      const filePath = "./__test__/fixtures/file/logo.png";

      await Request(server)
        .patch(`${apiUrl}/${id}`)
        .set(tokenAdminImmortal)
        .field("province_id", payload.province_id)
        .field("city_id", payload.city_id)
        .field("phone", payload.phone)
        .field("detail", payload.detail)
        .field("description", payload.description)
        .field("latitude", payload.latitude)
        .field("longitude", payload.longitude)
        .attach("file", filePath)
        .expect(404);
    });

    test("Should Return 401: Unauthorized", async () => {
      updateDestination.mockResolvedValue("SUCCESS");
      updateImageDestination.mockResolvedValue("SUCCESS");

      await Request(server)
        .patch(`${apiUrl}/${id}`)
        .field("province_id", payload.province_id)
        .field("city_id", payload.city_id)
        .field("phone", payload.phone)
        .field("detail", payload.detail)
        .field("description", payload.description)
        .field("latitude", payload.latitude)
        .field("longitude", payload.longitude)
        .expect(401);
    });

    test("Should Return 500: Something Went Wrong with Database", async () => {
      updateDestination.mockRejectedValue("Something Went Wrong");
      updateImageDestination.mockRejectedValue("Something Went Wrong");

      const filePath = "./__test__/fixtures/file/logo.png";

      await Request(server)
        .patch(`${apiUrl}/${id}`)
        .set(tokenAdminImmortal)
        .field("province_id", payload.province_id)
        .field("city_id", payload.city_id)
        .field("phone", payload.phone)
        .field("detail", payload.detail)
        .field("description", payload.description)
        .field("latitude", payload.latitude)
        .field("longitude", payload.longitude)
        .attach("file", filePath)
        .expect(500);
    });
  });

  describe("Delete Destination", () => {
    beforeEach(() => {
      id = 2;
      apiUrl = "/destination";

      mockDestination = _.cloneDeep(MockDestination);
      getDestination = jest.spyOn(db.Destination, "findOne");
      deleteDestination = jest.spyOn(db.Destination, "destroy");
      deleteImageDestination = jest.spyOn(db.ImageDestination, "destroy");
    });

    test("Should Return 200 : Delete Destination", async () => {
      deleteDestination.mockResolvedValue("SUCCESS");
      deleteImageDestination.mockResolvedValue("SUCCESS");

      await Request(server)
        .delete(`${apiUrl}/${id}`)
        .set(tokenAdminImmortal)
        .expect(200);
    });

    test("Should Return 404 : Destination not found", async () => {
      id = 10000;
      deleteDestination.mockResolvedValue("SUCCESS");
      deleteImageDestination.mockResolvedValue("SUCCESS");

      await Request(server)
        .delete(`${apiUrl}/${id}`)
        .set(tokenAdminImmortal)
        .expect(404);
    });

    test("Should Return 401: Unauthorized", async () => {
      deleteDestination.mockRejectedValue("Something Went Wrong");
      deleteImageDestination.mockRejectedValue("Something Went Wrong");

      await Request(server).delete(`${apiUrl}/${id}`).expect(401);
    });

    test("Should Return 500: Something Went Wrong with Database", async () => {
      deleteDestination.mockRejectedValue("Something Went Wrong");
      deleteImageDestination.mockRejectedValue("Something Went Wrong");

      await Request(server)
        .delete(`${apiUrl}/${id}`)
        .set(tokenAdminImmortal)
        .expect(500);
    });
  });

  describe("Get All Destination", () => {
    beforeEach(() => {
      apiUrl = "/destination";

      mockDestination = _.cloneDeep(MockDestination);
      getDestination = jest.spyOn(db.Destination, "findAll");
    });

    test("Should Return 200 : Get All Destination", async () => {
      getDestination.mockResolvedValue(mockDestination);

      await Request(server).get(apiUrl).set(tokenAdminImmortal).expect(200);
    });

    test("Should Return 401 : unauthorized", async () => {
      getDestination.mockResolvedValue(mockDestination);

      await Request(server).get(apiUrl).expect(401);
    });

    test("Should Return 500 : Something Went Wrong with Database", async () => {
      getDestination.mockRejectedValue("Something Went Wrong");

      await Request(server).get(apiUrl).set(tokenAdminImmortal).expect(500);
    });
  });

  describe("Get Destination By id", () => {
    beforeEach(() => {
      id = 2;
      apiUrl = "/destination";

      mockDestination = _.cloneDeep(MockDestination);
      getDestination = jest.spyOn(db.Destination, "findOne");
    });

    test("Should Return 200 : Get Destination By id", async () => {
      getDestination.mockResolvedValue(mockDestination);

      await Request(server)
        .get(`${apiUrl}/${id}`)
        .set(tokenAdminImmortal)
        .expect(200);
    });

    test("Should Return 400 : Destination not found", async () => {
      getDestination.mockResolvedValue(null);

      await Request(server)
        .get(`${apiUrl}/${id}`)
        .set(tokenAdminImmortal)
        .expect(400);
    });

    test("Should Return 401 : unauthorized", async () => {
      getDestination.mockResolvedValue(mockDestination);

      await Request(server).get(`${apiUrl}/${id}`).expect(401);
    });

    test("Should Return 500 : Something Went Wrong with Database", async () => {
      getDestination.mockRejectedValue("Something Went Wrong");

      await Request(server)
        .get(`${apiUrl}/${id}`)
        .set(tokenAdminImmortal)
        .expect(500);
    });
  });

  describe("Get Data Dashboard", () => {
    beforeAll(() => {
      apiUrl = "/dashboard";

      mockAllUser = _.cloneDeep(MockAllUser);
      getAllUser = jest.spyOn(db.User, "findAll");
    });

    test("Should Return 200 : Get Data Dashboard", async () => {
      getAllUser.mockResolvedValue(mockAllUser);

      await Request(server).get(apiUrl).set(tokenAdminImmortal).expect(200);
    });

    test("Should Return 401 : Get Data Dashboard", async () => {
      getAllUser.mockResolvedValue(mockAllUser);

      await Request(server).get(apiUrl).expect(401);
    });
  });
});
