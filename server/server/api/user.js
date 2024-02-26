const Router = require("express").Router();

const Middleware = require("../middlewares/authMiddleware");
const Validation = require("../helpers/validationHelper");
const UserHelper = require("../helpers/userHelper");
const GeneralHelper = require("../helpers/generalHelper");
const handleUploadImage = require("../middlewares/multerMiddleware");
const { decryptPayload } = require("../service/decryptionHelper");

const fileName = "server/api/user.js";

const myProfile = async (request, reply) => {
  try {
    const { id } = request.user;
    console.log(id);

    const response = await UserHelper.getMyProfile(id);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "my Profile", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const myConnection = async (request, reply) => {
  try {
    const { id } = request.user;

    const response = await UserHelper.getMyConnection(id);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "my Connection", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const connectionById = async (request, reply) => {
  try {
    const { userId } = request.params;

    const response = await UserHelper.getMyConnection(userId);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "my Connection", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const myAddress = async (request, reply) => {
  try {
    const { id } = request.user;
    console.log(id);

    const response = await UserHelper.getMyAddress(id);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "my Address", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const addAddress = async (request, reply) => {
  try {
    console.log(request.body, "<<<<");

    const decryptedData = decryptPayload(request.body);
    const { id } = request.user;

    Validation.addAddressValidation(decryptedData);

    const response = await UserHelper.createAddress(id, decryptedData);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "add Address", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const addRoute = async (request, reply) => {
  try {
    const decryptedData = decryptPayload(request.body);
    const { id } = request.user;

    Validation.addRouteValidation(decryptedData);

    const response = await UserHelper.createRoute(id, decryptedData);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "add Route", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const myRoute = async (request, reply) => {
  try {
    const { id } = request.user;
    const response = await UserHelper.getMyRoute(id);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "my Route", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const addTeam = async (request, reply) => {
  try {
    const { id } = request.user;
    const decryptedData = decryptPayload(request.body);

    Validation.addGroup(decryptedData);

    const response = await UserHelper.createGroup(id, decryptedData);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "add Team", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const removeTeam = async (request, reply) => {
  try {
    const { id } = request.user;
    const { groupId } = request.params;

    Validation.deleteGroup(request.params);

    const response = await UserHelper.deleteGroup(id, groupId);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "remove Team", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const region = async (request, reply) => {
  try {
    const { provinceId } = request.params;

    const response = await UserHelper.getRegion(provinceId);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "Region", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const nearBy = async (request, reply) => {
  try {
    const { id } = request.user;
    const response = await UserHelper.getNearBy(id);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "nearBy", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const post = async (request, reply) => {
  try {
    Validation.getPost(request.query);

    const { id } = request.user;
    const { userId } = request.params;
    const query = request.query;

    const response = await UserHelper.getPost(id, query);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "following Post", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const userPost = async (request, reply) => {
  try {
    const { userId } = request.params;
    const query = request.query;

    const response = await UserHelper.getUserPost(userId, query);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "post Detail", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const postDetail = async (request, reply) => {
  try {
    const { postId } = request.params;

    const response = await UserHelper.getPostDetail(postId);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "post Detail", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const addPost = async (request, reply) => {
  try {
    const { id } = request.user;
    const image = request.file;

    let data = request.body;

    console.log(data, "<<<DATA");

    Validation.createPost(data);

    const response = await UserHelper.createPost(id, data, image);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "add Post", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const editPost = async (request, reply) => {
  try {
    const { id } = request.user;
    const { postId } = request.params;
    const data = request.body;
    Validation.createPost(data);
    const response = await UserHelper.updatePost(id, postId, data);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "add Post", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const deletePost = async (request, reply) => {
  try {
    const { id } = request.user;
    const { postId } = request.params;
    const response = await UserHelper.deletePost(id, postId);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "add Post", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const commentPost = async (request, reply) => {
  try {
    const { postId } = request.params;
    const response = await UserHelper.getCommentPost(postId);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "comment Post", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const deleteCommentPost = async (request, reply) => {
  try {
    const { id } = request.user;
    const { commentId } = request.params;
    const response = await UserHelper.deleteCommentPost(id, commentId);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "delete Comment Post", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const userList = async (request, reply) => {
  try {
    const { id } = request.user;
    const query = request.query;
    const response = await UserHelper.getUserList(id, query);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "user List", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const follow = async (request, reply) => {
  try {
    const { id } = request.user;
    const { followTo } = request.params;
    console.log(request.params);

    const response = await UserHelper.createFollowTo(id, followTo);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "user List", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const userProfile = async (request, reply) => {
  try {
    const { id } = request.user;
    const { userId } = request.params;

    const response = await UserHelper.getUserProfile(id, userId);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "user Profile", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

// GET
Router.get("/profile", Middleware.validateToken, Middleware.isUser, myProfile);

Router.get(
  "/my-address",
  Middleware.validateToken,
  Middleware.isUser,
  myAddress
);

Router.get("/my-route", Middleware.validateToken, Middleware.isUser, myRoute);

Router.get("/nearby", Middleware.validateToken, Middleware.isUser, nearBy);

Router.get("/region/:provinceId", region);

Router.get("/post", Middleware.validateToken, Middleware.isUser, post);

Router.get("/user-post/:userId", Middleware.validateToken, userPost);

Router.get("/post-detail/:postId", postDetail);

Router.get("/comment/:postId", commentPost);

Router.get("/user-list", Middleware.validateToken, userList);

Router.get(
  "/my-connection",
  Middleware.validateToken,
  Middleware.isUser,
  myConnection
);

Router.get(
  "/connection/:userId",
  Middleware.validateToken,
  Middleware.isUser,
  connectionById
);

Router.get(
  "/user-profile/:userId",
  Middleware.validateToken,
  Middleware.isUser,
  userProfile
);

// POST
Router.post(
  "/address",
  Middleware.validateToken,
  Middleware.isUser,
  addAddress
);

Router.post(
  "/post",
  Middleware.validateToken,
  Middleware.isUser,
  handleUploadImage,
  addPost
);

Router.post("/route", Middleware.validateToken, Middleware.isUser, addRoute);

Router.post("/group", Middleware.validateToken, Middleware.isUser, addTeam);

// DELETE
Router.delete(
  "/group/:groupId",
  Middleware.validateToken,
  Middleware.isUser,
  removeTeam
);

Router.delete(
  "/post/:postId",
  Middleware.validateToken,
  Middleware.isUser,
  deletePost
);

Router.delete(
  "/comment/:commentId",
  Middleware.validateToken,
  Middleware.isUser,
  deleteCommentPost
);

/* UPDATE */
Router.patch(
  "/post/:postId",
  Middleware.validateToken,
  Middleware.isUser,
  editPost
);

Router.patch(
  "/follow/:followTo",
  Middleware.validateToken,
  Middleware.isUser,
  follow
);

module.exports = Router;
