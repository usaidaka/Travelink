const Router = require("express").Router();

const Middleware = require("../middlewares/authMiddleware");
const Validation = require("../helpers/validationHelper");
const AdminHelper = require("../helpers/adminHelper");
const GeneralHelper = require("../helpers/generalHelper");
const handleUploadImage = require("../middlewares/multerMiddleware");
const { decryptPayload } = require("../service/decryptionHelper");

const fileName = "server/api/admin.js";

const addDestination = async (request, reply) => {
  try {
    const decryptedData = decryptPayload(request.body);
    const image = request.file;

    console.log(image, "<<<<");

    Validation.addDestination(decryptedData);

    const response = await AdminHelper.createDestination(image, decryptedData);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "add Route", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const editDestination = async (request, reply) => {
  try {
    const { destinationId } = request.params;
    const decryptedData = decryptPayload(request.body);
    const image = request.file;

    Validation.editDestination(decryptedData);

    const response = await AdminHelper.editDestination(
      destinationId,
      decryptedData,
      image
    );

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "edit Destination", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const deleteDestination = async (request, reply) => {
  try {
    const { destinationId } = request.params;

    const response = await AdminHelper.deleteDestination(destinationId);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "delete Destination", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const getAllDestination = async (request, reply) => {
  try {
    const response = await AdminHelper.getAllDestination();

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "get all Destination", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const destinationById = async (request, reply) => {
  try {
    const { destinationId } = request.params;
    const response = await AdminHelper.getDestinationById(destinationId);

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "destination By Id", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const dashboard = async (request, reply) => {
  try {
    const response = await AdminHelper.getDataDashboard();

    return reply.send(response);
  } catch (err) {
    console.log([fileName, "dashboard", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/destination", Middleware.validateToken, getAllDestination);

Router.get(
  "/destination/:destinationId",
  Middleware.validateToken,
  destinationById
);

Router.get(
  "/dashboard",
  Middleware.validateToken,
  Middleware.isAdmin,
  dashboard
);

Router.post(
  "/destination",
  Middleware.validateToken,
  Middleware.isAdmin,
  handleUploadImage,
  addDestination
);

Router.patch(
  "/destination/:destinationId",
  Middleware.validateToken,
  Middleware.isAdmin,
  handleUploadImage,
  editDestination
);

Router.delete(
  "/destination/:destinationId",
  Middleware.validateToken,
  Middleware.isAdmin,
  deleteDestination
);

module.exports = Router;
