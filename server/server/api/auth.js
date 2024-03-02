const Router = require("express").Router();

const Middleware = require("../middlewares/authMiddleware");
const Validation = require("../helpers/validationHelper");
const AuthHelper = require("../helpers/authHelper");
const GeneralHelper = require("../helpers/generalHelper");
const handleUploadImage = require("../middlewares/multerMiddleware");
const { decryptPayload } = require("../service/decryptionHelper");

const fileName = "server/api/auth.js";

const register = async (request, reply) => {
  try {
    const decryptedData = decryptPayload(request.body);

    Validation.registerValidation(decryptedData);

    const response = await AuthHelper.registerUser(decryptedData);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "register", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const login = async (request, reply) => {
  try {
    const decryptedData = decryptPayload(request.body);

    Validation.loginValidation(decryptedData);

    const { email, password } = decryptedData;
    const response = await AuthHelper.login({ email, password });

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "login", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const forgotPassword = async (request, reply) => {
  try {
    const decryptedData = decryptPayload(request.body);

    Validation.forgotPasswordValidation(decryptedData);

    const response = await AuthHelper.forgotPassword(decryptedData);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "forgotPassword api", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const resetPassword = async (request, reply) => {
  try {
    const decryptedData = decryptPayload(request.body);
    console.log(decryptedData, "<<<<<");

    Validation.resetPasswordValidation(decryptedData);

    const response = await AuthHelper.resetPassword(decryptedData);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "resetPassword api", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const updateProfile = async (request, reply) => {
  try {
    const { id } = request.user;
    const image = request.file;
    console.log(image, "<<< IMAGES");
    console.log(request.body, "request.body");
    const decryptedData = decryptPayload(request.body);

    console.log(decryptedData, "<<<<decryptedData>>>>>");
    Validation.updateProfileValidation(decryptedData);

    const response = await AuthHelper.updateProfile(id, decryptedData, image);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "update Profile", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const changePassword = async (request, reply) => {
  try {
    const { id } = request.user;
    const decryptedData = decryptPayload(request.body);
    Validation.changePassword(decryptedData);

    const response = await AuthHelper.changePassword(id, decryptedData);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "change Password", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

// eslint-disable-next-line arrow-body-style
const hello = async (request, reply) => {
  // SAMPLE API WITH JWT MIDDLEWARE
  return reply.send("HELLO");
};

Router.post("/register", register);
Router.post("/login", login);
Router.post("/forgot-password", forgotPassword);
Router.post("/reset-password", resetPassword);
Router.patch(
  "/profile",
  Middleware.validateToken,
  handleUploadImage,
  updateProfile
);
Router.patch("/change-password", Middleware.validateToken, changePassword);
Router.get("/hello", Middleware.validateToken, hello);

module.exports = Router;
