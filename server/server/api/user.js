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
    console.log(request.body, "<<<");
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

Router.get(
  "/my-address",
  Middleware.validateToken,
  Middleware.isUser,
  myAddress
);

Router.post(
  "/address",
  Middleware.validateToken,
  Middleware.isUser,
  addAddress
);

Router.post("/route", Middleware.validateToken, Middleware.isUser, addRoute);

module.exports = Router;
