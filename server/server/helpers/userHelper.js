const Boom = require("boom");
const _ = require("lodash");

const db = require("../../models");
const GeneralHelper = require("./generalHelper");

const fileName = "server/helpers/userHelper.js";

const getMyAddress = async (id) => {
  try {
    const myAddress = await db.Address.findAll({
      where: { user_id: id },
      attributes: {
        exclude: ["deletedAt", "createdAt", "updatedAt", "id"],
      },
      include: [
        {
          model: db.Province,
          attributes: ["name"],
        },
        {
          model: db.City,
          attributes: ["name"],
        },
      ],
    });

    if (_.isEmpty(myAddress)) {
      return Promise.reject(
        Boom.notFound("The user doesn't have an address yet")
      );
    }

    return Promise.resolve({
      ok: true,
      message: "Get my address successfully",
      result: myAddress,
    });
  } catch (err) {
    console.log([fileName, "get My Address", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const createAddress = async (id, dataObject) => {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      province_id,
      city_id,
      detail,
      longitude,
      latitude,
      postal_code,
      title,
    } = dataObject;

    const isCityValid = await db.Province.findAll({
      where: { id: province_id },
      attributes: ["id", "name"],
      include: [
        {
          model: db.City,
          attributes: ["id", "name"],
          where: { id: city_id },
        },
      ],
    });

    if (_.isEmpty(isCityValid)) {
      return Promise.reject(
        Boom.badRequest("Your selected city is not part of selected province")
      );
    }

    await db.Address.create(
      {
        user_id: id,
        province_id,
        city_id,
        detail,
        longitude: String(longitude),
        latitude: String(latitude),
        postal_code,
        title,
      },
      { transaction }
    );

    await transaction.commit();

    return Promise.resolve({
      ok: true,
      message: "register address successfully",
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "create Address", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const createRoute = async () => {
  try {
    return Promise.resolve({
      ok: true,
      message: "Get my address successfully",
    });
  } catch (error) {
    console.log([fileName, "create Route", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

module.exports = { getMyAddress, createAddress, createRoute };
