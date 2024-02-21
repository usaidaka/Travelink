const Boom = require("boom");
const _ = require("lodash");

const db = require("../../models");
const GeneralHelper = require("./generalHelper");
const { encryptPayload } = require("../service/encryptionHelper");
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

const createRoute = async (id, dataObject) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {
      current_province_id,
      current_city_id,
      current_detail,
      current_longitude,
      current_latitude,
      direction_detail,
      direction_province_id,
      direction_city_id,
      direction_longitude,
      direction_latitude,
    } = dataObject;

    const isTraveled = await db.Route.findOne({
      where: { user_id: id },
    });

    if (isTraveled) {
      await db.Route.update(
        {
          current_province_id,
          current_city_id,
          current_detail,
          current_longitude,
          current_latitude,
          direction_detail,
          direction_province_id,
          direction_city_id,
          direction_longitude,
          direction_latitude,
        },
        { where: { user_id: id }, transaction }
      );
    } else {
      await db.Route.create(
        {
          user_id: id,
          current_province_id,
          current_city_id,
          current_detail,
          current_longitude,
          current_latitude,
          direction_detail,
          direction_province_id,
          direction_city_id,
          direction_longitude,
          direction_latitude,
        },
        { transaction }
      );
    }

    await transaction.commit();
    return Promise.resolve({
      ok: true,
      message: "Create route successfully",
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "create Route", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getMyRoute = async (id) => {
  try {
    const result = await db.Route.findAll({
      where: { user_id: id },
      attributes: { exclude: ["updatedAt"] },
      paranoid: false,
    });

    if (_.isEmpty(result)) {
      return Promise.reject(
        Boom.badRequest("You have not trip yet. Go outside!")
      );
    }

    return Promise.resolve({
      ok: true,
      message: "Get my route successfully",
      result: encryptPayload({ decryptedData: result }),
    });
  } catch (err) {
    console.log([fileName, "get My Route", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const createGroup = async (id, dataObject) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { group_name } = dataObject;

    const isUserInGroup = await db.GroupPivot.findOne({
      where: { user_id: id },
    });

    const isUserOwnGroup = await db.Group.findOne({
      where: { user_id: id },
    });

    if (isUserInGroup) {
      await transaction.rollback();
      return Promise.reject(Boom.badRequest("You are still in another group"));
    }

    if (isUserOwnGroup) {
      await transaction.rollback();
      return Promise.reject(
        Boom.badRequest("You are still a leader in another group")
      );
    }

    const userRoute = await db.Route.findOne({
      where: { user_id: id },
    });

    if (_.isEmpty(userRoute)) {
      await transaction.rollback();
      return Promise.reject(
        Boom.badRequest("You have not any trip plan yet. Create yours first")
      );
    }

    const newGroup = await db.Group.create(
      {
        user_id: id,
        route_id: userRoute.id,
        group_name,
      },
      { transaction }
    );

    await db.GroupPivot.create(
      {
        user_id: id,
        group_id: newGroup.id,
        is_leader: true,
      },
      { transaction }
    );

    await transaction.commit();
    return Promise.resolve({
      ok: true,
      message: "Create group successfully",
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "create Group", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const deleteGroup = async (id, groupId) => {
  const transaction = await db.sequelize.transaction();

  try {
    const isGroupExist = await db.Group.findOne({
      where: { id: groupId },
    });

    if (_.isEmpty(isGroupExist)) {
      await transaction.rollback();
      return Promise.reject(Boom.badRequest("Group not found"));
    }

    const isUserHaveGroup = await db.Group.findAll({
      where: { user_id: id },
    });

    if (_.isEmpty(isUserHaveGroup)) {
      await transaction.rollback();
      return Promise.reject(Boom.badRequest("You don't have any group yet"));
    }

    const isUserLeader = await db.GroupPivot.findOne({
      where: { user_id: id, is_leader: true },
    });

    if (!isUserLeader) {
      await transaction.rollback();
      return Promise.reject(Boom.badRequest("You cannot disbanded the group"));
    }

    await db.GroupPivot.destroy(
      {
        where: { group_id: groupId },
      },
      { transaction }
    );

    await db.Group.destroy(
      {
        where: { id: groupId },
      },
      { transaction }
    );

    await transaction.commit();
    return Promise.resolve({
      ok: true,
      message: "Delete group successfully",
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "delete Group", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

module.exports = {
  getMyAddress,
  createAddress,
  createRoute,
  getMyRoute,
  createGroup,
  deleteGroup,
};
