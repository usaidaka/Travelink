const Router = require("express").Router();

const Middleware = require("../middlewares/authMiddleware");
const Validation = require("../helpers/validationHelper");
const UserHelper = require("../helpers/userHelper");
const GeneralHelper = require("../helpers/generalHelper");
const handleUploadImage = require("../middlewares/multerMiddleware");
const { decryptPayload } = require("../service/decryptionHelper");

const fileName = "server/api/auth.js";

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

Router.get(
  "/my-address",
  Middleware.validateToken,
  Middleware.isUser,
  myAddress
);

Router.get("/my-route", Middleware.validateToken, Middleware.isUser, myRoute);

Router.post(
  "/address",
  Middleware.validateToken,
  Middleware.isUser,
  addAddress
);

Router.post("/route", Middleware.validateToken, Middleware.isUser, addRoute);

Router.post("/group", Middleware.validateToken, Middleware.isUser, addTeam);

Router.delete(
  "/group/:groupId",
  Middleware.validateToken,
  Middleware.isUser,
  removeTeam
);

module.exports = Router;
