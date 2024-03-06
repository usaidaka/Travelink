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

    const response = await UserHelper.getConnectionById(userId);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "my Connection", "ERROR"], { info: `${err}` });
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

/* GROUP START */

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

const leaveGroup = async (request, reply) => {
  try {
    const { id } = request.user;
    const { groupId } = request.params;

    const response = await UserHelper.leaveGroup(id, groupId);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "leave Group", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const updateMemberGroup = async (request, reply) => {
  try {
    const { id } = request.user;
    const { userId, groupId } = request.params;
    const response = await UserHelper.updateMemberGroup(id, userId, groupId);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "update Member Group", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const editGroup = async (request, reply) => {
  try {
    const { id } = request.user;
    const { groupId } = request.params;
    const data = request.body;

    const response = await UserHelper.editGroup(id, groupId, data);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "edit Group", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const myGroup = async (request, reply) => {
  try {
    const { id } = request.user;

    const response = await UserHelper.getMyGroup(id);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "edit Group", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

/* GROUP END */

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

const nearByInDirection = async (request, reply) => {
  try {
    const { id } = request.user;
    const response = await UserHelper.getNearByInDirection(id);
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
    console.log([fileName, "delete Post", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const comment = async (request, reply) => {
  try {
    const { id } = request.user;
    const { postId } = request.params;
    const data = request.body;

    Validation.comment(data);

    const response = await UserHelper.comment(id, postId, data);

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

    Validation.userList(query);

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

const myFollow = async (request, reply) => {
  try {
    const { id } = request.user;
    const response = await UserHelper.myFollow(id);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "my Follower", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const userFollow = async (request, reply) => {
  try {
    const { userId } = request.params;
    const response = await UserHelper.userFollow(userId);
    return reply.send(response);
  } catch (err) {
    console.log([fileName, "my Follower", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const deleteFollower = async (request, reply) => {
  try {
    const { followId } = request.params;
    const { id } = request.user;

    const response = await UserHelper.deleteFollower(id, followId);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "delete Follower", "ERROR"], { info: `${err}` });
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
Router.get("/profile", Middleware.validateToken, myProfile);

Router.get("/my-route", Middleware.validateToken, Middleware.isUser, myRoute);

Router.get("/nearby", Middleware.validateToken, Middleware.isUser, nearBy);

Router.get(
  "/nearby/direction",
  Middleware.validateToken,
  Middleware.isUser,
  nearByInDirection
);

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

Router.get("/my-group", Middleware.validateToken, Middleware.isUser, myGroup);

Router.get("/my-follow", Middleware.validateToken, Middleware.isUser, myFollow);

Router.get(
  "/user-follow/:userId",
  Middleware.validateToken,
  Middleware.isUser,
  userFollow
);

// POST

Router.post(
  "/post",
  Middleware.validateToken,
  Middleware.isUser,
  handleUploadImage,
  addPost
);

Router.post("/route", Middleware.validateToken, Middleware.isUser, addRoute);

Router.post("/group", Middleware.validateToken, Middleware.isUser, addTeam);

Router.post(
  "/comment/:postId",
  Middleware.validateToken,
  Middleware.isUser,
  comment
);

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

Router.delete(
  "/leave-group/:groupId",
  Middleware.validateToken,
  Middleware.isUser,
  leaveGroup
);

Router.delete(
  "/my-follow/:followId",
  Middleware.validateToken,
  Middleware.isUser,
  deleteFollower
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

Router.patch(
  "/group/update-member/:userId/:groupId",
  Middleware.validateToken,
  Middleware.isUser,
  updateMemberGroup
);

Router.patch(
  "/group/:groupId",
  Middleware.validateToken,
  Middleware.isUser,
  editGroup
);

module.exports = Router;
