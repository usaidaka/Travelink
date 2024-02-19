const Router = require("express").Router();

const Middleware = require("../middlewares/authMiddleware");
const Validation = require("../helpers/validationHelper");
const AuthHelper = require("../helpers/authHelper");
const GeneralHelper = require("../helpers/generalHelper");
const handleUploadImage = require("../middlewares/multerMiddleware");
const { decryptData } = require("../service/encrypt");

const fileName = "server/api/auth.js";

const register = async (request, reply) => {
  try {
    const formData = request.body;

    const decryptedData = {
      ...(formData?.username && { username: decryptData(formData?.username) }),
      ...(formData?.email && { email: decryptData(formData?.email) }),
      ...(formData?.password && { password: decryptData(formData?.password) }),
      ...(formData?.confirmPassword && {
        confirmPassword: decryptData(formData?.confirmPassword),
      }),
      ...(formData?.role && { role: decryptData(formData?.role) }),
      ...(formData?.first_name && {
        first_name: decryptData(formData?.first_name),
      }),
      ...(formData?.last_name && {
        last_name: decryptData(formData?.last_name),
      }),
      ...(formData?.gender && {
        gender: decryptData(formData?.gender),
      }),
      ...(formData?.email_contact && {
        email_contact: decryptData(formData?.email_contact),
      }),
      ...(formData?.phone && {
        phone: decryptData(formData?.phone),
      }),
      ...(formData?.phone_contact && {
        phone_contact: decryptData(formData?.phone_contact),
      }),
      ...(formData?.mbti && {
        mbti: decryptData(formData?.mbti),
      }),
    };

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
    const formData = request.body;
    const decryptedData = {
      ...(formData?.email && { email: decryptData(formData?.email) }),
      ...(formData?.password && { password: decryptData(formData?.password) }),
    };

    console.log(decryptedData);

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
    const formData = request.body;
    const decryptedData = {
      ...(formData?.email && { email: decryptData(formData?.email) }),
    };

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
    const formData = request.body;
    console.log(formData, "<<<<<");
    const decryptedData = {
      ...(formData?.otp && { otp: decryptData(formData?.otp) }),
      ...(formData?.newPassword && {
        newPassword: decryptData(formData?.newPassword),
      }),
      ...(formData?.confirmNewPassword && {
        confirmNewPassword: decryptData(formData?.confirmNewPassword),
      }),
    };

    console.log(decryptedData, "<<<<< test");

    Validation.resetPasswordValidation(decryptedData);

    const response = await AuthHelper.resetPassword(decryptedData);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "resetPassword api", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

// eslint-disable-next-line arrow-body-style
const hello = async (request, reply) => {
  // SAMPLE API WITH JWT MIDDLEWARE
  return reply.send("HELLO");
};

const test = async (request, reply) => {
  try {
    const data = request.file;
    console.log(request.file);
    const response = await AuthHelper.test(data);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "login", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

Router.post("/register", register);
Router.post("/login", login);
Router.post("/forgot-password", forgotPassword);
Router.post("/reset-password", resetPassword);
Router.get("/hello", Middleware.validateToken, hello);
Router.get("/test", handleUploadImage, test);

module.exports = Router;
