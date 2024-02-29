const Boom = require("boom");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const crypto = require("crypto-js");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const db = require("../../models");
const GeneralHelper = require("./generalHelper");
const Mailer = require("../service/mailer");
const cloudinary = require("../service/cloudinary");
const { encryptPayload } = require("../service/encryptionHelper");

const jwtSecretTokenCredential =
  process.env.JWT_SECRET_TOKEN_CREDENTIAL || "super_strong_key";
const jwtSecretToken = process.env.JWT_SECRET_TOKEN || "super_strong_key";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "24h";
const jwtExpiresCredentialIn = process.env.JWT_EXPIRES_CREDENTIAL_IN || "24h";
const salt = bcrypt.genSaltSync(10);

const fileName = "server/helpers/adminHelper.js";

const createDestination = async (image, dataObject) => {
  const transaction = await db.sequelize.transaction();
  const {
    province_id,
    city_id,
    phone,
    detail,
    description,
    latitude,
    longitude,
  } = dataObject;

  try {
    if (!image) {
      return Promise.reject(Boom.badRequest("Image cannot be empty"));
    }

    let imageResult = null;
    if (image) {
      imageResult = await cloudinary.uploadToCloudinary(image, "image");
      if (!imageResult) throw Boom.internal("Cloudinary image upload failed");
    }

    const destination = await db.Destination.create(
      {
        province_id,
        city_id,
        phone,
        detail,
        description,
        latitude,
        longitude,
      },
      { transaction }
    );

    await db.ImageDestination.create(
      {
        destination_id: destination.id,
        image: imageResult.url,
      },
      { transaction }
    );

    await transaction.commit();

    return Promise.resolve({
      ok: true,
      message: "create Destination",
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "create Destination", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const editDestination = async (destinationId, dataObject, image) => {
  const transaction = await db.sequelize.transaction();
  console.log(dataObject, ">>>dataObject<<<");
  console.log(image, "<<<<<<image");
  try {
    const {
      province_id,
      city_id,
      detail,
      description,
      phone,
      longitude,
      latitude,
    } = dataObject;

    console.log(
      province_id,
      city_id,
      detail,
      description,
      phone,
      longitude,
      latitude
    );

    const isExist = await db.Destination.findOne({
      where: { id: destinationId },
      include: [{ model: db.ImageDestination }],
    });

    if (!isExist) {
      await transaction.rollback();
      return Promise.reject(Boom.notFound("destination not found"));
    }

    let imageResult = null;
    if (image) {
      imageResult = await cloudinary.uploadToCloudinary(image, "image");
      if (!imageResult) throw Boom.internal("Cloudinary image upload failed");
    }

    await db.Destination.update(
      {
        province_id: province_id ? province_id : isExist.province_id,
        city_id: city_id ? city_id : isExist.city_id,
        detail: detail ? detail : isExist.detail,
        description: description ? description : isExist.description,
        latitude: latitude ? latitude : isExist.latitude,
        longitude: longitude ? longitude : isExist.longitude,
        phone: phone ? phone : isExist.phone,
      },
      { where: { id: destinationId }, transaction }
    );

    if (image) {
      await db.ImageDestination.update(
        {
          image: imageResult.url,
        },
        {
          where: {
            destination_id: destinationId,
          },
          transaction,
        }
      );
    }

    await transaction.commit();
    return Promise.resolve({
      ok: true,
      message: "edit Destination",
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "edit Destination", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const deleteDestination = async (destinationId) => {
  const transaction = await db.sequelize.transaction();

  try {
    const isExist = await db.Destination.findOne({
      where: { id: destinationId },
    });

    if (!isExist) {
      await transaction.rollback();
      return Promise.reject(Boom.notFound("destination not found"));
    }

    await db.Destination.destroy(
      {
        where: { id: destinationId },
      },
      transaction
    );

    await db.ImageDestination.destroy(
      {
        where: { destination_id: destinationId },
      },
      transaction
    );

    await transaction.commit();

    return Promise.resolve({
      ok: true,
      message: "delete Destination",
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "delete Destination", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getAllDestination = async () => {
  try {
    const destination = await db.Destination.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt", "image"] },
      include: [
        { model: db.Province, attributes: ["name"] },
        { model: db.City, attributes: ["name"] },
        { model: db.ImageDestination, attributes: ["image"] },
      ],
    });

    const resultEncrypted = encryptPayload({ decryptedData: destination });
    return Promise.resolve({
      ok: true,
      message: "get all Destination",
      result: resultEncrypted,
    });
  } catch (err) {
    console.log([fileName, "get all Destination", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getDestinationById = async (destinationId) => {
  try {
    const destinationById = await db.Destination.findOne({
      where: { id: destinationId },
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt", "image"] },
      include: [
        { model: db.Province, attributes: ["name"] },
        { model: db.City, attributes: ["name"] },
        { model: db.ImageDestination, attributes: ["image"] },
      ],
    });

    if (_.isEmpty(destinationById)) {
      return Promise.reject(Boom.badRequest("Destination not found"));
    }
    const resultEncrypted = encryptPayload({ decryptedData: destinationById });
    return Promise.resolve({
      ok: true,
      message: "get destination by id",
      result: resultEncrypted,
    });
  } catch (err) {
    console.log([fileName, "get Destination By Id", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getDataDashboard = async () => {
  try {
    const userList = await db.User.findAll({
      where: { role: { [Op.eq]: "User" } },
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt", "password", "role"],
      },

      include: [
        {
          model: db.UserDetail,
          attributes: ["phone"],
        },
        {
          model: db.Route,
          include: [
            {
              model: db.Province,
              as: "current_province",
              attributes: ["name"],
            },
            { model: db.City, as: "current_city", attributes: ["name"] },
            {
              model: db.Province,
              as: "direction_province",
              attributes: ["name"],
            },
            { model: db.City, as: "direction_city", attributes: ["name"] },
          ],
          attributes: [
            "id",
            "current_latitude",
            "current_longitude",
            "direction_latitude",
            "direction_longitude",
          ],
          where: {
            [Op.or]: [
              { current_latitude: { [Op.not]: null } },
              { current_longitude: { [Op.not]: null } },
              { direction_latitude: { [Op.not]: null } },
              { direction_longitude: { [Op.not]: null } },
            ],
          },
        },
      ],
    });

    const remapData = userList?.map((user) => ({
      username: user?.username,
      email: user?.email,
      image: user?.image,
      phone: user?.UserDetail?.phone,
      location: [user?.Route?.current_latitude, user?.Route?.current_longitude],
      province: user?.Route?.current_province?.name,
      city: user?.Route?.current_city?.name,
    }));

    const countUser = await db.User.count();
    const countPost = await db.Post.count();
    const countTrip = await db.Route.count();
    const countGroup = await db.Group.count();
    const result = { remapData, countUser, countPost, countTrip, countGroup };

    const resultEncrypted = encryptPayload({ decryptedData: result });
    return Promise.resolve({
      ok: true,
      result: resultEncrypted,
    });
  } catch (err) {
    console.log([fileName, "get Data Dashboard", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

module.exports = {
  createDestination,
  editDestination,
  deleteDestination,
  getAllDestination,
  getDestinationById,
  getDataDashboard,
};
