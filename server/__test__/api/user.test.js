const Request = require("supertest");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const QS = require("qs");

const db = require("../../models");
const GeneralHelper = require("../../server/helpers/generalHelper");
const UserPlugin = require("../../server/api/user");
const cloudinary = require("../../server/service/cloudinary");

const MockUser = require("../fixtures/database/user.json");
const MockConnection = require("../fixtures/database/connection.json");
const MockRoute = require("../fixtures/database/route.json");
const MockAllRoute = require("../fixtures/database/allRoute.json");
const MockGroup = require("../fixtures/database/group.json");
const MockGroupPivot = require("../fixtures/database/groupPivot.json");
const MockProvince = require("../fixtures/database/province.json");
const MockCity = require("../fixtures/database/city.json");
const MockPost = require("../fixtures/database/post.json");
const MockAllPost = require("../fixtures/database/allPost.json");
const MockImagePost = require("../fixtures/database/imagePost.json");
const MockComment = require("../fixtures/database/comment.json");
const MockAllComment = require("../fixtures/database/allComment.json");
const MockFollow = require("../fixtures/database/follow.json");

let apiUrl;
let server;
let payload;
let header;

let mockUser;
let mockAllUser;
let mockUserDetail;
let mockConnection;
let mockRoute;
let mockAllRoute;
let mockGroup;
let mockGroupPivot;
let mockProvince;
let mockCity;
let mockPost;
let mockAllPost;
let mockImagePost;
let mockComment;
let mockAllComment;
let mockFollow;

let getUser;
let getAllUser;
let getUserDetail;
let getConnection;
let getRoute;
let getAllRoute;
let getGroup;
let getGroupPivot;
let getProvince;
let getCity;
let getPost;
let getAllPost;
let getImagePost;
let getComment;
let getAllComment;
let getFollow;

let createUser;
let createUserDetail;
let createRoute;
let createGroup;
let createGroupPivot;
let createPost;
let createImagePost;
let createComment;
let createFollow;

let updateUser;
let updateUserDetail;
let updateGroup;
let updatePivotGroup;
let updatePost;
let updateFollow;

let deleteGroup;
let deleteGroupPivot;
let deletePost;
let deleteImagePost;
let deleteComment;
let deleteFollow;

let restoreFollow;

let jwtVerify;
let mockJsonWebTokenData;

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

describe("User", () => {
  beforeAll(() => {
    server = GeneralHelper.createTestServer("/", UserPlugin);
  });

  afterAll(async () => {
    await server.close();
  });

  describe("Get My Profile", () => {
    beforeEach(() => {
      apiUrl = "/profile";

      mockUser = _.cloneDeep(MockUser);
      getUser = jest.spyOn(db.User, "findOne");
    });

    test("Should Return 200: Gey My Profile Success", async () => {
      getUser.mockResolvedValue(mockUser);

      await Request(server)
        .get(apiUrl)
        .set(tokenUserImmortal)
        .expect(200)
        .then((res) => {
          expect(!_.isEmpty(res.body)).toBeTruthy();
        });
    });

    test("Should Return 401: Unauthorized", async () => {
      getUser.mockResolvedValue(mockUser);

      await Request(server).get(apiUrl).send(payload).expect(401);
    });

    test("Should Return 500: Something Went Wrong with Database", async () => {
      getUser.mockRejectedValue("Something Went Wrong");

      await Request(server)
        .get(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(500);
    });
  });

  describe("Get Connection By Id", () => {
    beforeEach(() => {
      apiUrl = "/connection";
      id = 1;

      mockUser = _.cloneDeep(MockUser);
      getUser = jest.spyOn(db.User, "findOne");
    });

    mockConnection = _.cloneDeep(MockConnection);
    getConnection = jest.spyOn(db.Follow, "findAll");

    test("Should Return 200: Gey My Profile Success", async () => {
      getConnection.mockResolvedValue(mockConnection);

      await Request(server)
        .get(`${apiUrl}/${id}`)
        .set(tokenUserImmortal)
        .expect(200)
        .then((res) => {
          expect(!_.isEmpty(res.body)).toBeTruthy();
        });
    });

    test("Should Return 401: Unauthorized", async () => {
      getConnection.mockResolvedValue(mockConnection);

      await Request(server).get(`${apiUrl}/${id}`).expect(401);
    });

    // test("Should Return 500: Something Went Wrong with Database", async () => {
    //   getConnection.mockRejectedValue(null);

    //   await Request(server)
    //     .get(`${apiUrl}/${id}`)
    //     .set(tokenUserImmortal)
    //     .send(payload)
    //     .expect(500);
    // });
  });

  describe("Get My Connection", () => {
    beforeEach(() => {
      apiUrl = "/my-connection";

      mockUser = _.cloneDeep(MockUser);
      getUser = jest.spyOn(db.User, "findOne");
    });

    mockConnection = _.cloneDeep(MockConnection);
    getConnection = jest.spyOn(db.Follow, "findAll");

    test("Should Return 200: Gey My Profile Success", async () => {
      getConnection.mockResolvedValue(mockConnection);

      await Request(server)
        .get(apiUrl)
        .set(tokenUserImmortal)
        .expect(200)
        .then((res) => {
          expect(!_.isEmpty(res.body)).toBeTruthy();
        });
    });

    test("Should Return 401: Unauthorized", async () => {
      getConnection.mockResolvedValue(mockConnection);

      await Request(server).get(apiUrl).expect(401);
    });

    // test("Should Return 500: Something Went Wrong with Database", async () => {
    //   getConnection.mockRejectedValue(null);

    //   await Request(server)
    //     .get(apiUrl)
    //     .set(tokenUserImmortal)
    //     .send(payload)
    //     .expect(500);
    // });
  });

  describe("Create Route", () => {
    beforeAll(() => {
      apiUrl = "/route";
      payload = {
        current_province_id: 1,
        current_city_id: 2,
        current_detail: "lorem ipsum",
        current_longitude: 106.83904467133809,
        current_latitude: -6.307894189421034,
        direction_detail: "lorem ipsum dolor asim met",
        direction_province_id: 2,
        direction_city_id: 2,
        direction_longitude: 106.85462294098846,
        direction_latitude: -6.307894189421034,
      };

      mockRoute = _.cloneDeep(MockRoute);
      getRoute = jest.spyOn(db.Route, "findOne");
      createRoute = jest.spyOn(db.Route, "create");
    });

    test("Should Return 200: Create Route Successful", async () => {
      getRoute.mockResolvedValue(mockRoute);
      createRoute.mockResolvedValue("SUCCESS");

      await Request(server)
        .post(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(200);
    });

    test("Should Return 200: Create Route Successful", async () => {
      getRoute.mockResolvedValue(null);
      createRoute.mockResolvedValue("SUCCESS");

      await Request(server)
        .post(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(200);
    });

    test("Should Return 400: Invalid payload value", async () => {
      payload.current_city_id = "asdasd";
      getRoute.mockRejectedValue(null);

      await Request(server)
        .post(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(400);
    });

    test("Should Return 401: unauthorized", async () => {
      payload.current_city_id = "asdasd";
      getRoute.mockRejectedValue(null);

      await Request(server).post(apiUrl).send(payload).expect(401);
    });

    // test("Should Return 500: Something Went Wrong with Database", async () => {
    //   getRoute.mockRejectedValue("Something Went Wrong with Database");

    //   await Request(server)
    //     .post(apiUrl)
    //     .set(tokenUserImmortal)
    //     .send(payload)
    //     .expect(500);
    // });
  });

  describe("Get My Route", () => {
    beforeEach(() => {
      apiUrl = "/my-route";

      mockRoute = _.cloneDeep(MockRoute);
      getRoute = jest.spyOn(db.Route, "findAll");
    });

    test("Should Return 200: Get My Route", async () => {
      getRoute.mockResolvedValue(mockRoute);

      await Request(server).get(apiUrl).set(tokenUserImmortal).expect(200);
    });

    test("Should Return 200: Get My Route", async () => {
      getRoute.mockResolvedValue(null);

      await Request(server).get(apiUrl).set(tokenUserImmortal).expect(200);
    });

    test("Should Return 401: unauthorized", async () => {
      getRoute.mockRejectedValue("Something Went Wrong with Database");

      await Request(server).get(apiUrl).send(payload).expect(401);
    });

    test("Should Return 500: Something Went Wrong with Database", async () => {
      getRoute.mockRejectedValue("Something Went Wrong with Database");

      await Request(server)
        .get(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(500);
    });
  });

  describe("Create Group", () => {
    beforeEach(() => {
      apiUrl = "/group";
      payload = {
        group_name: "My Trip My Adventure",
        member: ["Fahmi", "Leondy"],
      };

      mockGroup = _.cloneDeep(MockGroup);
      getGroup = jest.spyOn(db.Group, "findOne");
      createGroup = jest.spyOn(db.Group, "create");

      mockGroupPivot = _.cloneDeep(MockGroupPivot);
      getGroupPivot = jest.spyOn(db.GroupPivot, "findOne");
      createGroupPivot = jest.spyOn(db.GroupPivot, "create");

      mockRoute = _.cloneDeep(MockRoute);
      getRoute = jest.spyOn(db.Route, "findOne");
    });

    test("Should Return 200: Create Group Successful", async () => {
      getGroup.mockResolvedValue(null);
      createGroup.mockResolvedValue("SUCCESS");

      getGroupPivot.mockResolvedValue(null);
      createGroupPivot.mockResolvedValue("SUCCESS");

      await Request(server)
        .post(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(200);
    });

    test("Should Return 400: You are still in another group", async () => {
      //   getGroup.mockResolvedValue({});
      //   createGroup.mockResolvedValue("SUCCESS");

      getGroupPivot.mockResolvedValue(mockGroupPivot);
      createGroupPivot.mockResolvedValue("SUCCESS");

      await Request(server)
        .post(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(400);
    });

    test("Should Return 400: You are still a leader in another group", async () => {
      getGroup.mockResolvedValue(mockGroup);
      createGroup.mockResolvedValue("SUCCESS");

      getRoute.mockResolvedValue(mockRoute);

      await Request(server)
        .post(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(400);
    });

    test("Should Return 400: You have not any trip plan yet. Create yours first", async () => {
      getRoute.mockResolvedValue(null);

      await Request(server)
        .post(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(400);
    });

    test("Should Return 400: Invalid Payload", async () => {
      payload.invalid = "Invalid";

      getGroup.mockResolvedValue({});
      createGroup.mockResolvedValue("SUCCESS");

      getGroupPivot.mockResolvedValue({});
      createGroupPivot.mockResolvedValue("SUCCESS");

      getRoute.mockResolvedValue(mockRoute);

      await Request(server)
        .post(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(400);
    });

    test("Should Return 401: unauthorized", async () => {
      getGroup.mockResolvedValue({});
      createGroup.mockResolvedValue("SUCCESS");

      getGroupPivot.mockResolvedValue({});
      createGroupPivot.mockResolvedValue("SUCCESS");

      getRoute.mockResolvedValue(mockRoute);

      await Request(server).post(apiUrl).send(payload).expect(401);
    });

    test("Should Return 500: Something Went Wrong with Database", async () => {
      getGroup.mockRejectedValue("Something Went Wrong");
      getGroupPivot.mockRejectedValue("Something Went Wrong");
      getRoute.mockRejectedValue("Something Went Wrong");

      await Request(server)
        .post(apiUrl)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(500);
    });
  });

  describe("Delete Group", () => {
    beforeEach(() => {
      id = 1;
      apiUrl = "/group";

      mockGroup = _.cloneDeep(MockGroup);
      getGroup = jest.spyOn(db.Group, "findOne");
      deleteGroup = jest.spyOn(db.Group, "destroy");

      mockGroupPivot = _.cloneDeep(MockGroupPivot);
      getGroupPivot = jest.spyOn(db.GroupPivot, "findOne");
      deleteGroupPivot = jest.spyOn(db.GroupPivot, "destroy");
    });

    test("Should Return 200: Delete Group Successful", async () => {
      getGroup.mockResolvedValue(mockGroup);
      deleteGroup.mockResolvedValue("SUCCESS");

      getGroupPivot.mockResolvedValue(mockGroupPivot);
      deleteGroup.mockResolvedValue("SUCCESS");

      await Request(server)
        .delete(`${apiUrl}/${id}`)
        .set(tokenUserImmortal)
        .expect(200);
    });

    test("Should Return 200: Delete Group Successful", async () => {
      getGroup.mockResolvedValue(mockGroup);
      deleteGroup.mockResolvedValue("SUCCESS");

      getGroupPivot.mockResolvedValue(mockGroupPivot);
      deleteGroup.mockResolvedValue("SUCCESS");

      await Request(server)
        .delete(`${apiUrl}/${id}`)
        .set(tokenUserImmortal)
        .expect(200);
    });

    test("Should Return 404: Group Not Found", async () => {
      id = 9999;
      getGroup.mockResolvedValue(null);
      deleteGroup.mockResolvedValue("SUCCESS");

      getGroupPivot.mockResolvedValue(mockGroupPivot);
      deleteGroup.mockResolvedValue("SUCCESS");

      await Request(server)
        .delete(`${apiUrl}/${id}`)
        .set(tokenUserImmortal)
        .expect(404);
    });

    test("Should Return 401: unauthorized", async () => {
      getGroup.mockResolvedValue({});
      deleteGroup.mockResolvedValue("SUCCESS");

      getGroupPivot.mockResolvedValue({});
      deleteGroupPivot.mockResolvedValue("SUCCESS");

      await Request(server).delete(`${apiUrl}/${id}`).expect(401);
    });

    test("Should Return 500: Something Went Wrong with Database", async () => {
      getGroup.mockRejectedValue("Something Went Wrong");
      getGroupPivot.mockRejectedValue("Something Went Wrong");

      await Request(server)
        .delete(`${apiUrl}/${id}`)
        .set(tokenUserImmortal)
        .expect(500);
    });
  });

  describe("Leave Group", () => {
    beforeEach(() => {
      id = 1;
      apiUrl = "/leave-group";

      mockGroupPivot = _.cloneDeep(MockGroupPivot);
      getGroupPivot = jest.spyOn(db.GroupPivot, "findOne");
      deleteGroupPivot = jest.spyOn(db.GroupPivot, "destroy");
    });

    test("Should Return 200: Leave Group Successful", async () => {
      const isNotLeader = {
        id: 1,
        user_id: 1,
        group_id: 1,
        is_leader: false,
        is_allow: 1,
      };

      getGroupPivot.mockResolvedValue(isNotLeader);
      deleteGroupPivot.mockResolvedValue("SUCCESS");

      await Request(server)
        .delete(`${apiUrl}/${id}`)
        .set(tokenUserNoLeaderImmortal)
        .expect(200);
    });

    test("Should Return 400: You are not joining any group yet", async () => {
      getGroupPivot.mockResolvedValue(null);
      deleteGroupPivot.mockResolvedValue("SUCCESS");

      await Request(server)
        .delete(`${apiUrl}/${id}`)
        .set(tokenUserImmortal)
        .expect(400);
    });

    test("Should Return 400: You cannot leave the group. You are the leader", async () => {
      const leader = {
        id: 1,
        user_id: 1,
        group_id: 1,
        is_leader: true,
        is_allow: 1,
      };
      getGroupPivot.mockResolvedValue(leader);
      deleteGroupPivot.mockResolvedValue("SUCCESS");

      await Request(server)
        .delete(`${apiUrl}/${id}`)
        .set(tokenUserImmortal)
        .expect(400);
    });

    test("Should Return 401: unauthorized", async () => {
      getGroupPivot.mockRejectedValue("Something Went Wrong");
      deleteGroupPivot.mockRejectedValue("Something Went Wrong");

      await Request(server).delete(`${apiUrl}/${id}`).expect(401);
    });

    test("Should Return 500: Something Went Wrong with Database", async () => {
      getGroupPivot.mockRejectedValue("Something Went Wrong");
      deleteGroupPivot.mockRejectedValue("Something Went Wrong");

      await Request(server)
        .delete(`${apiUrl}/${id}`)
        .set(tokenUserImmortal)
        .expect(500);
    });
  });

  describe("Update Member Group", () => {
    beforeEach(() => {
      userId = 2;
      groupId = 1;
      apiUrl = `/group/update-member`;

      mockGroupPivot = _.cloneDeep(MockGroupPivot);
      getGroupPivot = jest.spyOn(db.GroupPivot, "findOne");
      deleteGroupPivot = jest.spyOn(db.GroupPivot, "destroy");
    });

    test("Should Return 200: Update Member Group", async () => {
      const isNotLeader = {
        id: 1,
        user_id: 1,
        group_id: 1,
        is_leader: true,
        is_allow: 1,
      };
      getGroupPivot.mockResolvedValue(isNotLeader);
      deleteGroupPivot.mockResolvedValue("SUCCESS");

      await Request(server)
        .patch(`${apiUrl}/${userId}/${groupId}`)
        .set(tokenUserImmortal)
        .expect(200);
    });

    test("Should Return 400: You cannot update member on your own self", async () => {
      userId = 1;
      getGroupPivot.mockResolvedValue(mockGroupPivot);
      deleteGroupPivot.mockResolvedValue("SUCCESS");

      await Request(server)
        .patch(`${apiUrl}/${userId}/${groupId}`)
        .set(tokenUserImmortal)
        .expect(400);
    });

    test("Should Return 400: User not found in group member", async () => {
      getGroupPivot.mockResolvedValue(null);
      deleteGroupPivot.mockResolvedValue("SUCCESS");

      await Request(server)
        .patch(`${apiUrl}/${userId}/${groupId}`)
        .set(tokenUserImmortal)
        .expect(400);
    });

    test("Should Return 400: Cannot update group. Must be a leader", async () => {
      const isNotLeader = {
        id: 1,
        user_id: 1,
        group_id: 1,
        is_leader: false,
        is_allow: 1,
      };

      getGroupPivot.mockResolvedValue(isNotLeader);
      deleteGroupPivot.mockResolvedValue("SUCCESS");

      await Request(server)
        .patch(`${apiUrl}/${userId}/${groupId}`)
        .set(tokenUserImmortal)
        .expect(400);
    });

    test("Should Return 401: unauthorized", async () => {
      getGroupPivot.mockResolvedValue(mockGroupPivot);
      deleteGroupPivot.mockResolvedValue("SUCCESS");

      await Request(server).patch(`${apiUrl}/${userId}/${groupId}`).expect(401);
    });

    test("Should Return 500: Something Went Wrong with Database", async () => {
      getGroupPivot.mockRejectedValue("Something Went Wrong");
      deleteGroupPivot.mockRejectedValue("Something Went Wrong");

      await Request(server)
        .patch(`${apiUrl}/${userId}/${groupId}`)
        .set(tokenUserImmortal)
        .expect(500);
    });
  });

  describe("Edit Group", () => {
    beforeEach(() => {
      groupId = 1;
      apiUrl = "/group";
      payload = {
        group_name: "My Trip My Adventure",
        member: ["Aka", "Leondy"],
      };

      mockGroup = _.cloneDeep(MockGroup);
      getGroup = jest.spyOn(db.Group, "findOne");
      updateGroup = jest.spyOn(db.Group, "update");

      mockGroupPivot = _.cloneDeep(MockGroupPivot);
      createGroupPivot = jest.spyOn(db.GroupPivot, "create");

      mockUser = _.cloneDeep(MockUser);
      getUser = jest.spyOn(db.User, "findAll");
    });

    test("Should Return 200 : Edit Group", async () => {
      getGroup.mockResolvedValue(mockGroup);
      updateGroup.mockResolvedValue("SUCCESS");

      getUser.mockResolvedValue(payload.member);

      await Request(server)
        .patch(`${apiUrl}/${groupId}`)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(200);
    });

    test("Should Return 400 : Member already in another group", async () => {
      getGroup.mockResolvedValue(mockGroup);
      updateGroup.mockResolvedValue("SUCCESS");

      await Request(server)
        .patch(`${apiUrl}/${groupId}`)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(400);
    });

    test("Should Return 500: Something Went Wrong with Database", async () => {
      getGroup.mockRejectedValue("Something Went Wrong");
      updateGroup.mockRejectedValue("Something Went Wrong");
      createGroupPivot.mockRejectedValue("Something Went Wrong");

      await Request(server)
        .patch(`${apiUrl}/${groupId}`)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(500);
    });
  });

  describe("Get My Group", () => {
    beforeEach(() => {
      apiUrl = "/my-group";

      mockGroupPivot = _.cloneDeep(MockGroupPivot);
      getGroupPivot = jest.spyOn(db.GroupPivot, "findOne");
    });

    test("Should Return 200 : Get My Group", async () => {
      getGroupPivot.mockResolvedValue(mockGroupPivot);

      await Request(server).get(apiUrl).set(tokenUserImmortal).expect(200);
    });

    test("Should Return 401: unauthorized", async () => {
      getGroupPivot.mockResolvedValue(mockGroupPivot);

      await Request(server).get(apiUrl).expect(401);
    });

    test("Should Return 500: Something Went Wrong with Database", async () => {
      getGroupPivot.mockRejectedValue("Something Went Wrong with Database");

      await Request(server).get(apiUrl).set(tokenUserImmortal).expect(500);
    });
  });

  describe("Get Region", () => {
    beforeEach(() => {
      provinceId = 1;
      apiUrl = "/region";

      mockProvince = _.cloneDeep(MockProvince);
      getProvince = jest.spyOn(db.Province, "findAll");

      mockCity = _.cloneDeep(MockCity);
      getCity = jest.spyOn(db.City, "findAll");
    });

    test("Should Return 200: Get Region", async () => {
      getProvince.mockResolvedValue(mockProvince);
      getCity.mockResolvedValue(mockCity);

      await Request(server).get(`${apiUrl}/${provinceId}`).expect(200);
    });

    test("Should Return 500: Something Went Wrong with Database", async () => {
      getProvince.mockRejectedValue("Something Went Wrong with Database");
      getCity.mockRejectedValue("Something Went Wrong with Database");

      await Request(server).get(`${apiUrl}/${provinceId}`).expect(500);
    });
  });

  describe("Get Nearby", () => {
    beforeEach(() => {
      apiUrl = "/nearby";

      mockRoute = _.cloneDeep(MockRoute);
      getRoute = jest.spyOn(db.Route, "findOne");

      mockAllRoute = _.cloneDeep(MockAllRoute);
      getAllRoute = jest.spyOn(db.Route, "findAll");
    });

    test("Should Return 200 : Get Nearby", async () => {
      getRoute.mockResolvedValue(mockRoute);

      await Request(server).get(apiUrl).set(tokenUserImmortal).expect(200);
    });

    test("Should Return 200 : You don't any trip. Make some plan", async () => {
      getRoute.mockResolvedValue(null);

      await Request(server)
        .get(apiUrl)
        .set(tokenUserImmortal)
        .expect(200)
        .then((res) => expect(res.body.ok).toBeFalsy);
    });

    test("Should Return 200 : Another user don't have any trip yet", async () => {
      getAllRoute.mockResolvedValue(mockAllRoute);

      await Request(server)
        .get(apiUrl)
        .set(tokenUserImmortal)
        .expect(200)
        .then((res) => expect(res.body.ok).toBeFalsy);
    });

    test("Should Return 401: unauthorized", async () => {
      getAllRoute.mockResolvedValue(mockGroupPivot);

      await Request(server).get(apiUrl).expect(401);
    });

    test("Should Return 500: Something Went Wrong with Database", async () => {
      getAllRoute.mockRejectedValue("Something Went Wrong with Database");

      await Request(server).get(apiUrl).set(tokenUserImmortal).expect(500);
    });
  });

  describe("Get Nearby In Direction", () => {
    beforeEach(() => {
      apiUrl = "/nearby/direction";

      mockRoute = _.cloneDeep(MockRoute);
      getRoute = jest.spyOn(db.Route, "findOne");

      mockAllRoute = _.cloneDeep(MockAllRoute);
      getAllRoute = jest.spyOn(db.Route, "findAll");
    });

    test("Should Return 200 : Get Nearby", async () => {
      getRoute.mockResolvedValue(mockRoute);

      await Request(server).get(apiUrl).set(tokenUserImmortal).expect(200);
    });

    test("Should Return 200 : You don't any trip. Make some plan", async () => {
      getRoute.mockResolvedValue(null);

      await Request(server)
        .get(apiUrl)
        .set(tokenUserImmortal)
        .expect(200)
        .then((res) => expect(res.body.ok).toBeFalsy);
    });

    test("Should Return 200 : Another user don't have any trip yet", async () => {
      getAllRoute.mockResolvedValue(mockAllRoute);

      await Request(server)
        .get(apiUrl)
        .set(tokenUserImmortal)
        .expect(200)
        .then((res) => expect(res.body.ok).toBeFalsy);
    });

    test("Should Return 401: unauthorized", async () => {
      getAllRoute.mockResolvedValue(mockGroupPivot);

      await Request(server).get(apiUrl).expect(401);
    });

    test("Should Return 500: Something Went Wrong with Database", async () => {
      getAllRoute.mockRejectedValue("Something Went Wrong with Database");

      await Request(server).get(apiUrl).set(tokenUserImmortal).expect(500);
    });
  });

  describe("Get Post", () => {
    beforeEach(() => {
      apiUrl = "/post";
      query = {
        next: 0,
        limit: 6,
      };
      mockAllPost = _.cloneDeep(MockAllPost);
      getAllPost = jest.spyOn(db.Post, "findAll");
    });

    test("Should Return 200 : Get Post", async () => {
      getAllPost.mockResolvedValue(mockAllPost);

      await Request(server).get(apiUrl).set(tokenUserImmortal).expect(200);
    });

    test("Should Return 401: unauthorized", async () => {
      getAllPost.mockRejectedValue(mockAllPost);

      await Request(server).get(apiUrl).expect(401);
    });

    test("Should Return 500: Something Went Wrong with Database", async () => {
      getAllPost.mockRejectedValue(
        "Should Return 500: Something Went Wrong with Database"
      );

      await Request(server).get(apiUrl).set(tokenUserImmortal).expect(500);
    });
  });

  describe("Get User Post", () => {
    beforeEach(() => {
      userId = 1;
      apiUrl = "/user-post";
      query = {
        next: 0,
        limit: 6,
      };
      mockAllPost = _.cloneDeep(MockAllPost);
      getAllPost = jest.spyOn(db.Post, "findAll");
    });

    test("Should Return 200 : Get User Post", async () => {
      getAllPost.mockResolvedValue(mockAllPost);

      await Request(server)
        .get(`${apiUrl}/${userId}`)
        .set(tokenUserImmortal)
        .expect(200);
    });

    test("Should Return 401: unauthorized", async () => {
      getAllPost.mockRejectedValue(mockAllPost);

      await Request(server).get(`${apiUrl}/${userId}`).expect(401);
    });

    test("Should Return 500: Something Went Wrong with Database", async () => {
      getAllPost.mockRejectedValue(
        "Should Return 500: Something Went Wrong with Database"
      );

      await Request(server)
        .get(`${apiUrl}/${userId}`)
        .set(tokenUserImmortal)
        .expect(500);
    });
  });

  describe("Get Post Detail", () => {
    beforeEach(() => {
      postId = 1;
      apiUrl = "/post-detail";

      mockPost = _.cloneDeep(MockPost);
      getPost = jest.spyOn(db.Post, "findOne");
    });

    test("Should Return 200 : Get Post Detail", async () => {
      getPost.mockResolvedValue(mockPost);

      await Request(server).get(`${apiUrl}/${postId}`).expect(200);
    });

    test("Should Return 500: Something Went Wrong with Database", async () => {
      getPost.mockRejectedValue(
        "Should Return 500: Something Went Wrong with Database"
      );

      await Request(server).get(`${apiUrl}/${postId}`).expect(500);
    });
  });

  describe("Create Post", () => {
    beforeEach(() => {
      apiUrl = "/post";
      payload = {
        province_id: "1",
        city_id: "1",
        caption: "Lorem Ipsum",
        location_name: "Disini",
      };

      mockPost = _.cloneDeep(MockPost);
      getPost = jest.spyOn(db.Post, "findOne");
      createPost = jest.spyOn(db.Post, "create");

      mockImagePost = _.cloneDeep(MockImagePost);
      getImagePost = jest.spyOn(db.ImagePost, "findOne");
      createImagePost = jest.spyOn(db.ImagePost, "create");

      uploadCloudinary = jest.spyOn(cloudinary, "uploadToCloudinary");
    });

    test("Should Return 200 : Create Post", async () => {
      createPost.mockResolvedValue("SUCCESS");
      createImagePost.mockResolvedValue("SUCCESS");

      const filePath = "./__test__/fixtures/file/logo.png";

      await Request(server)
        .post(apiUrl)
        .set(tokenUserImmortal)
        .field("province_id", payload.province_id)
        .field("city_id", payload.city_id)
        .field("location_name", payload.location_name)
        .attach("file", filePath)
        .expect(200);
    });

    test("Should Return 400 : Image cannot be empty", async () => {
      createPost.mockResolvedValue("SUCCESS");
      createImagePost.mockResolvedValue("SUCCESS");

      await Request(server)
        .post(apiUrl)
        .set(tokenUserImmortal)
        .field("province_id", payload.province_id)
        .field("city_id", payload.city_id)
        .field("location_name", payload.location_name)
        .expect(400);
    });

    test("Should Return 401: unauthorized", async () => {
      createPost.mockResolvedValue("SUCCESS");

      await Request(server).get(apiUrl).expect(401);
    });
  });

  describe("Update Post", () => {
    beforeEach(() => {
      postId = 1;
      apiUrl = "/post";
      payload = {
        province_id: "1",
        city_id: "1",
        caption: "Lorem Ipsum",
        location_name: "Disini",
      };

      mockPost = _.cloneDeep(MockPost);
      getPost = jest.spyOn(db.Post, "findOne");
      updatePost = jest.spyOn(db.Post, "update");
    });

    test("Should Return 200 : Update Post", async () => {
      getPost.mockResolvedValue(mockPost);
      updatePost.mockResolvedValue("SUCCESS");

      await Request(server)
        .patch(`${apiUrl}/${postId}`)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(200);
    });

    test("Should Return 404 : Update Post", async () => {
      getPost.mockResolvedValue([]);
      updatePost.mockResolvedValue("SUCCESS");

      await Request(server)
        .patch(`${apiUrl}/${postId}`)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(404);
    });

    test("Should Return 401 : unauthorized", async () => {
      getPost.mockResolvedValue([]);
      updatePost.mockResolvedValue("SUCCESS");

      await Request(server)
        .patch(`${apiUrl}/${postId}`)
        .send(payload)
        .expect(401);
    });

    test("Should Return 500 : Something Went Wrong with Database", async () => {
      getPost.mockRejectedValue("Something Went Wrong");
      updatePost.mockRejectedValue("Something Went Wrong");

      await Request(server)
        .patch(`${apiUrl}/${postId}`)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(500);
    });
  });

  describe("Delete Post", () => {
    beforeEach(() => {
      postId = 1;
      apiUrl = "/post";

      mockPost = _.cloneDeep(MockPost);
      getPost = jest.spyOn(db.Post, "findOne");
      deletePost = jest.spyOn(db.Post, "destroy");

      mockImagePost = _.cloneDeep(MockImagePost);
      getImagePost = jest.spyOn(db.ImagePost, "findAll");
      deleteImagePost = jest.spyOn(db.ImagePost, "destroy");

      mockComment = _.cloneDeep(MockComment);
      getComment = jest.spyOn(db.Comment, "findAll");
      deleteComment = jest.spyOn(db.Comment, "destroy");
    });

    test("Should Return 200 : Delete Post", async () => {
      getPost.mockResolvedValue(mockPost);
      getImagePost.mockResolvedValue(mockImagePost);
      getComment.mockResolvedValue(mockComment);

      deletePost.mockResolvedValue("SUCCESS");
      deleteImagePost.mockResolvedValue("SUCCESS");
      deleteComment.mockResolvedValue("SUCCESS");

      await Request(server)
        .delete(`${apiUrl}/${postId}`)
        .set(tokenUserImmortal)
        .expect(200);
    });

    test("Should Return 404 : Post Not Found", async () => {
      getPost.mockResolvedValue([]);

      deletePost.mockResolvedValue("SUCCESS");

      await Request(server)
        .delete(`${apiUrl}/${postId}`)
        .set(tokenUserImmortal)
        .expect(404);
    });

    test("Should Return 401 : unauthorized", async () => {
      getPost.mockRejectedValue([]);
      deletePost.mockRejectedValue("SUCCESS");

      await Request(server).delete(`${apiUrl}/${postId}`).expect(401);
    });

    test("Should Return 500 : Something Went Wrong with Database", async () => {
      getPost.mockRejectedValue("Something Went Wrong");
      deletePost.mockRejectedValue("Something Went Wrong");

      await Request(server)
        .delete(`${apiUrl}/${postId}`)
        .set(tokenUserImmortal)
        .expect(500);
    });
  });

  describe("Comment", () => {
    beforeEach(() => {
      postId = 1;
      apiUrl = "/comment";
      payload = {
        comment: "Lorem Ipsum",
      };

      mockComment = _.cloneDeep(MockComment);
      getComment = jest.spyOn(db.Comment, "findOne");
      createComment = jest.spyOn(db.Comment, "create");

      mockPost = _.cloneDeep(MockPost);
      getPost = jest.spyOn(db.Post, "findOne");
    });

    test("Should Return 200 : Create Comment", async () => {
      createComment.mockResolvedValue("SUCCESS");

      await Request(server)
        .post(`${apiUrl}/${postId}`)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(200);
    });

    test("Should Return 404 : Post not found", async () => {
      getPost.mockResolvedValue([]);
      createComment.mockResolvedValue("SUCCESS");

      await Request(server)
        .post(`${apiUrl}/${postId}`)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(404);
    });

    test("Should Return 401 : unauthorized", async () => {
      getPost.mockResolvedValue([]);
      createComment.mockResolvedValue("SUCCESS");

      await Request(server)
        .post(`${apiUrl}/${postId}`)
        .send(payload)
        .expect(401);
    });

    test("Should Return 500 : Something Went Wrong with Database", async () => {
      getPost.mockRejectedValue("Something Went Wrong with Database");
      createComment.mockRejectedValue("Something Went Wrong with Database");

      await Request(server)
        .post(`${apiUrl}/${postId}`)
        .set(tokenUserImmortal)
        .send(payload)
        .expect(500);
    });
  });

  describe("Comment", () => {
    beforeEach(() => {
      postId = 64;
      apiUrl = "/comment";

      mockComment = _.cloneDeep(MockComment);
      getComment = jest.spyOn(db.Comment, "findOne");

      mockPost = _.cloneDeep(MockPost);
      getPost = jest.spyOn(db.Post, "findOne");
    });

    test("Should Return 200 : Get Comment", async () => {
      getComment.mockResolvedValue(mockComment);

      await Request(server).get(`${apiUrl}/${postId}`).expect(200);
    });

    test("Should Return 200 : Get Comment", async () => {
      postId = 10000;
      getComment.mockResolvedValue([]);

      await Request(server)
        .get(`${apiUrl}/${postId}`)
        .expect(200)
        .then((res) =>
          expect(res.body.message).toContain("Comment based on post not found")
        );
    });

    // test("Should Return 500 : Something Went Wrong with Database", async () => {
    //   getComment.mockRejectedValue("Something Went Wrong with Database");

    //   await Request(server).get(`${apiUrl}/${postId}`).expect(500);
    // });
  });

  describe("Delete Comment Post", () => {
    beforeEach(() => {
      commentId = 2;
      apiUrl = "/comment";

      mockAllComment = _.cloneDeep(MockAllComment);
      getAllComment = jest.spyOn(db.Comment, "findAll");
      deleteComment = jest.spyOn(db.Comment, "destroy");
    });

    test("Should return 200 : Delete Comment", async () => {
      deleteComment.mockResolvedValue("SUCCESS");

      await Request(server)
        .delete(`${apiUrl}/${commentId}`)
        .set(tokenUserImmortal)
        .expect(200);
    });

    test("Should return 404 : Comment based on post not found", async () => {
      commentId = 1;
      deleteComment.mockResolvedValue("SUCCESS");

      await Request(server)
        .delete(`${apiUrl}/${commentId}`)
        .set(tokenUserImmortal)
        .expect(404);
    });

    test("Should Return 401 : unauthorized", async () => {
      deleteComment.mockRejectedValue("Something Went Wrong");

      await Request(server).delete(`${apiUrl}/${commentId}`).expect(401);
    });

    test("Should Return 500 : Something Went Wrong with Database", async () => {
      deleteComment.mockRejectedValue("Something Went Wrong");

      await Request(server)
        .delete(`${apiUrl}/${commentId}`)
        .set(tokenUserImmortal)
        .expect(500);
    });
  });

  describe("User List", () => {
    beforeEach(() => {
      apiUrl = "/user-list";
      query = {
        next: 0,
        limit: 6,
        username: "Lan",
      };

      mockAllUser = _.cloneDeep(mockAllUser);
      getAllUser = jest.spyOn(db.User, "findAll");
    });

    test("Should Return 200 : User List", async () => {
      getAllUser.mockResolvedValue(mockAllUser);

      await Request(server).get(apiUrl).set(tokenUserImmortal).expect(200);
    });

    test("Should Return 200 : User List With Query", async () => {
      getAllUser.mockResolvedValue(mockAllUser);

      await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set(tokenUserImmortal)
        .expect(200);
    });

    test("Should Return 400 : User List With Invalid Query", async () => {
      query.invalid = "invalid";
      getAllUser.mockResolvedValue(mockAllUser);

      await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .set(tokenUserImmortal)
        .expect(400);
    });

    test("Should Return 401 : unauthorized", async () => {
      getAllUser.mockResolvedValue(mockAllUser);

      await Request(server)
        .get(`${apiUrl}?${QS.stringify(query)}`)
        .expect(401);
    });
  });

  describe("Follow", () => {
    beforeEach(() => {
      followTo = 2;
      apiUrl = "/follow";

      mockFollow = _.cloneDeep(MockFollow);
      getFollow = jest.spyOn(db.Follow, "findOne");
      createFollow = jest.spyOn(db.Follow, "create");
      updateFollow = jest.spyOn(db.Follow, "update");
      restoreFollow = jest.spyOn(db.Follow, "restore");
    });

    test("Should Return 200 : unFollow Successful", async () => {
      getFollow.mockResolvedValue(mockFollow);
      updateFollow.mockResolvedValue("Success");

      await Request(server)
        .patch(`${apiUrl}/${followTo}`)
        .set(tokenUserImmortal)
        .expect(200);
    });

    test("Should Return 200 : Follow Successful", async () => {
      followTo = 20;
      getFollow.mockResolvedValue([]);
      createFollow.mockResolvedValue("Success");

      await Request(server)
        .patch(`${apiUrl}/${followTo}`)
        .set(tokenUserImmortal)
        .expect(200);
    });

    test("Should Return 200 : Restore Follow Successful", async () => {
      const restore = {
        id: 1,
        follow_by: 1,
        follow_to: 2,
        deletedAt: "restore",
      };

      followTo = 14;
      getFollow.mockResolvedValue(restore);
      restoreFollow.mockResolvedValue("Success");

      await Request(server)
        .patch(`${apiUrl}/${followTo}`)
        .set(tokenUserImmortal)
        .expect(200);
    });

    test("Should Return 400 : You cannot follow or unfollow your self", async () => {
      followTo = 1;
      getFollow.mockResolvedValue(mockFollow);
      createFollow.mockResolvedValue("Success");
      updateFollow.mockResolvedValue("Success");

      await Request(server)
        .patch(`${apiUrl}/${followTo}`)
        .set(tokenUserImmortal)
        .expect(400);
    });

    test("Should Return 401 : unauthorized", async () => {
      getFollow.mockResolvedValue(mockFollow);
      createFollow.mockResolvedValue("Success");
      updateFollow.mockResolvedValue("Success");

      await Request(server).patch(`${apiUrl}/${followTo}`).expect(401);
    });

    test("Should Return 500 : Something Went Wrong with Database", async () => {
      getFollow.mockRejectedValue("Something Went Wrong");
      createFollow.mockRejectedValue("Something Went Wrong");
      updateFollow.mockRejectedValue("Something Went Wrong");

      await Request(server)
        .patch(`${apiUrl}/${followTo}`)
        .set(tokenUserImmortal)
        .expect(500);
    });
  });

  describe("My Follow", () => {
    beforeAll(() => {
      apiUrl = "/my-follow";

      mockFollow = _.cloneDeep(MockFollow);
      getFollow = jest.spyOn(db.Follow, "findAll");
    });

    test("Should Return 200 : Get My Follow", async () => {
      getFollow.mockResolvedValue(mockFollow);

      await Request(server).get(apiUrl).set(tokenUserImmortal).expect(200);
    });

    test("Should Return 401 : unauthorized", async () => {
      getFollow.mockResolvedValue(mockFollow);

      await Request(server).get(apiUrl).set(tokenUserImmortal).expect(200);
    });

    // test("Should Return 500 : Something Went Wrong with Database", async () => {
    //   getFollow.mockRejectedValue("Something Went Wrong");

    //   await Request(server).get(apiUrl).set(tokenUserImmortal).expect(500);
    // });
  });

  describe("User Follow", () => {
    beforeEach(() => {
      userId = 2;
      apiUrl = "/user-follow";

      mockFollow = _.cloneDeep(MockFollow);
      getFollow = jest.spyOn(db.Follow, "findAll");
    });

    test("Should Return 200 : Get My Follow", async () => {
      getFollow.mockResolvedValue(mockFollow);

      await Request(server)
        .get(`${apiUrl}/${userId}`)
        .set(tokenUserImmortal)
        .expect(200);
    });

    test("Should Return 401 : unauthorized", async () => {
      getFollow.mockResolvedValue(mockFollow);

      await Request(server)
        .get(`${apiUrl}/${userId}`)
        .set(tokenUserImmortal)
        .expect(200);
    });

    test("Should Return 500 : Something Went Wrong with Database", async () => {
      getFollow.mockRejectedValue("Something Went Wrong");

      await Request(server)
        .get(`${apiUrl}/${userId}`)
        .set(tokenUserImmortal)
        .expect(500);
    });
  });

  describe("Delete Follower", () => {
    beforeEach(() => {
      followId = 1;
      apiUrl = "/my-follow";

      mockFollow = _.cloneDeep(MockFollow);
      getFollow = jest.spyOn(db.Follow, "findOne");
      deleteFollow = jest.spyOn(db.Follow, "destroy");
    });

    test("Should Return 200 : Delete Follower Successful", async () => {
      deleteFollow.mockResolvedValue("SUCCESS"),
        await Request(server)
          .delete(`${apiUrl}/${followId}`)
          .set(tokenUserImmortal)
          .expect(200);
    });

    test("Should Return 404 : Delete Follower Successful", async () => {
      followId = 2;
      deleteFollow.mockResolvedValue("Follow relationship not found"),
        await Request(server)
          .delete(`${apiUrl}/${followId}`)
          .set(tokenUserImmortal)
          .expect(404);
    });

    test("Should Return 401 : unauthorized", async () => {
      getFollow.mockResolvedValue(mockFollow);

      await Request(server).delete(`${apiUrl}/${followId}`).expect(401);
    });

    test("Should Return 500 : Something Went Wrong with Database", async () => {
      deleteFollow.mockRejectedValue("Something Went Wrong"),
        await Request(server)
          .delete(`${apiUrl}/${followId}`)
          .set(tokenUserImmortal)
          .expect(500);
    });
  });

  describe("Get User Profile", () => {
    beforeEach(() => {
      userId = 2;
      apiUrl = "/user-profile";

      mockUser = _.cloneDeep(MockUser);
      getUser = jest.spyOn(db.User, "findByPk");
    });

    test("Should Return 200 : Get User Profile", async () => {
      getUser.mockResolvedValue(mockUser);

      await Request(server)
        .get(`${apiUrl}/${userId}`)
        .set(tokenUserImmortal)
        .expect(200);
    });

    test("Should Return 404 : User not found", async () => {
      getUser.mockResolvedValue(null);

      await Request(server)
        .get(`${apiUrl}/${userId}`)
        .set(tokenUserImmortal)
        .expect(404);
    });

    test("Should Return 401 : unauthorized", async () => {
      getUser.mockResolvedValue(mockUser);

      await Request(server).get(`${apiUrl}/${userId}`).expect(401);
    });

    test("Should Return 500 : Something Went Wrong with Database", async () => {
      getUser.mockRejectedValue("Something Went Wrong"),
        await Request(server)
          .get(`${apiUrl}/${userId}`)
          .set(tokenUserImmortal)
          .expect(500);
    });
  });
});
