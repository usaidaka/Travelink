const Boom = require("boom");
const _ = require("lodash");

const db = require("../../models");
const { Op } = require("sequelize");
const GeneralHelper = require("./generalHelper");
const { encryptPayload } = require("../service/encryptionHelper");
const fileName = "server/helpers/userHelper.js";
const cloudinary = require("../service/cloudinary");

const getMyProfile = async (id) => {
  try {
    const profile = await db.User.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
      },
      include: [
        {
          model: db.UserDetail,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "id"],
          },
        },
      ],
    });

    const resultEncrypted = encryptPayload({ decryptedData: profile });
    return Promise.resolve({
      ok: true,
      message: "Get my profile successfully",
      result: resultEncrypted,
    });
  } catch (err) {
    console.log([fileName, "get My Profile", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

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
    const result = await db.Route.findOne({
      where: { user_id: id },
      include: [
        { model: db.Province, as: "current_province", attributes: ["name"] },
        { model: db.City, as: "current_city", attributes: ["name"] },
        { model: db.Province, as: "direction_province", attributes: ["name"] },
        { model: db.City, as: "direction_city", attributes: ["name"] },
      ],
      attributes: { exclude: ["updatedAt"] },
      paranoid: false,
    });

    const resultEncrypted = encryptPayload({ decryptedData: result });

    if (_.isEmpty(result)) {
      return Promise.resolve({
        ok: true,
        message: "You don't have any trip. Make some plan!",
      });
    }

    return Promise.resolve({
      ok: true,
      message: "Get my route successfully",
      result: resultEncrypted,
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

const getRegion = async (provinceId) => {
  try {
    const provinceList = await db.Province.findAll({
      attributes: ["id", "name"],
    });

    const cityList = await db.City.findAll({
      where: { province_id: provinceId },
      attributes: ["id", "name", "province_id"],
    });

    return Promise.resolve({
      ok: true,
      message: "Get region successfully",
      result: {
        province: provinceList,
        city: cityList,
      },
    });
  } catch (err) {
    console.log([fileName, "get Region", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getNearBy = async (id, radius = 50) => {
  let resultEncrypted = "";
  try {
    const myCurrentLocation = await db.Route.findOne({
      where: { user_id: id },
      include: [
        { model: db.Province, as: "current_province", attributes: ["name"] },
        { model: db.City, as: "current_city", attributes: ["name"] },
        { model: db.Province, as: "direction_province", attributes: ["name"] },
        { model: db.City, as: "direction_city", attributes: ["name"] },
      ],
      attributes: [
        "id",
        "current_latitude",
        "current_longitude",
        "direction_latitude",
        "direction_longitude",
      ],
    });

    if (_.isEmpty(myCurrentLocation)) {
      resultEncrypted = encryptPayload({ decryptedData: [] });
      return Promise.resolve({
        ok: false,
        message: "You don't any trip. Make some plan",
        result: [],
      });
    }

    const allUserLocation = await db.Route.findAll({
      include: [
        {
          model: db.User,
          include: [
            { model: db.UserDetail, attributes: ["phone", "first_name"] },
          ],
          attributes: ["id", "username", "email", "image"],
        },
        { model: db.Province, as: "current_province", attributes: ["name"] },
        { model: db.City, as: "current_city", attributes: ["name"] },
        { model: db.Province, as: "direction_province", attributes: ["name"] },
        { model: db.City, as: "direction_city", attributes: ["name"] },
      ],
      attributes: [
        "id",
        "user_id",
        "current_latitude",
        "current_longitude",
        "direction_latitude",
        "direction_longitude",
      ],
    });

    if (_.isEmpty(allUserLocation)) {
      resultEncrypted = encryptPayload({ decryptedData: [] });
      return Promise.resolve({
        ok: false,
        message: "Another user don't have any trip yet",
        result: resultEncrypted,
      });
    }

    const distanceKm = (lat1, lon1, lat2, lon2) => {
      const r = 6371; // km
      const p = Math.PI / 180;

      const a =
        0.5 -
        Math.cos((lat2 - lat1) * p) / 2 +
        (Math.cos(lat1 * p) *
          Math.cos(lat2 * p) *
          (1 - Math.cos((lon2 - lon1) * p))) /
          2;

      return 2 * r * Math.asin(Math.sqrt(a));
    };

    const nearbyUsers = [];

    for (let i = 0; i < allUserLocation.length; i++) {
      const distance = distanceKm(
        allUserLocation[i].current_latitude,
        allUserLocation[i].current_longitude,
        myCurrentLocation.current_latitude,
        myCurrentLocation.current_longitude
      );

      if (distance <= radius) {
        nearbyUsers.push({
          user: allUserLocation[i],
          distance,
        });
      }
    }
    let remapData = [];
    nearbyUsers.map(
      (near) =>
        (remapData = [
          {
            id: near?.user?.id,
            profile: {
              username: near?.user?.User?.username,
              firstName: near?.user?.User?.UserDetail?.first_name,
              email: near?.user?.User?.email,
              phone: near?.user?.User?.UserDetail?.phone,
              image: near?.user?.User?.image,
            },
            current_position: [
              near?.user?.current_latitude,
              near?.user?.current_longitude,
            ],
            direction_position: [
              near?.user?.direction_latitude,
              near?.user?.direction_longitude,
            ],
            current_region: {
              province: near?.user?.current_province?.name,
              city: near?.user?.current_city?.name,
            },
            direction_region: {
              province: near?.user?.direction_province?.name,
              city: near?.user?.direction_city?.name,
            },
            distance: near.distance,
          },
        ])
    );

    resultEncrypted = encryptPayload({ decryptedData: remapData });

    return Promise.resolve({
      ok: true,
      message: "get users nearby successful",
      result: resultEncrypted,
    });
  } catch (err) {
    console.log([fileName, "get nearby", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getPost = async (id, userId, query) => {
  try {
    const { next, limit } = query;

    const currentPage = Number(next) || 0;
    const currentLimit = Number(limit) || 6;

    const formattedExclude = {
      exclude: [
        "createdAt",
        "deletedAt",
        "updatedAt",
        "province_id",
        "city_id",
      ],
    };

    const formattedInclude = [
      {
        model: db.ImagePost,
        attributes: ["image"],
      },

      {
        model: db.Province,
        attributes: ["name"],
      },
      {
        model: db.City,
        attributes: ["name"],
      },
      { model: db.User, attributes: ["username", "image"] },
    ];

    const order = [["id", "DESC"]];

    const allPost = await db.Post.findAll({
      attributes: formattedExclude,
      include: formattedInclude,
      limit: currentLimit,
      offset: currentPage,
      order,
    });

    const myPost = await db.Post.findAll({
      where: { user_id: id },
      attributes: formattedExclude,
      include: formattedInclude,
      limit: currentLimit,
      offset: currentPage,
      order,
    });

    const followTo = await db.Follow.findAll({
      where: { follow_by: id },
      attributes: ["follow_to"],
    });

    const idFollowTo = followTo.map((follow) => follow.follow_to);
    console.log(idFollowTo);

    const followingPost = await db.Post.findAll({
      where: {
        user_id: idFollowTo,
      },
      attributes: formattedExclude,
      include: formattedInclude,
      limit: currentLimit,
      offset: currentPage,
      order,
    });

    return Promise.resolve({
      ok: true,
      message: "Get post successful",
      result: { allPost, myPost, followingPost },
    });
  } catch (err) {
    console.log([fileName, "get post", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const createPost = async (id, dataObject, image) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { province_id, city_id, caption, location_name } = dataObject;

    if (!image) {
      return Promise.reject(Boom.badRequest("Image cannot be empty"));
    }

    let imageResult = null;
    if (image) {
      imageResult = await cloudinary.uploadToCloudinary(image, "image");
      if (!imageResult) throw Boom.internal("Cloudinary image upload failed");
    }

    const post = await db.Post.create(
      {
        user_id: id,
        province_id: isNaN(Number(province_id)) ? null : Number(province_id),
        city_id: isNaN(Number(city_id)) ? null : Number(city_id),
        caption,
        location_name,
      },
      { transaction }
    );

    await db.ImagePost.create(
      {
        post_id: post.id,
        image: imageResult.url,
      },
      { transaction }
    );

    await transaction.commit();
    return Promise.resolve({
      ok: true,
      message: "Create post successful",
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "create post", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const updatePost = async (id, postId, dataObject) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { province_id, city_id, caption, location_name } = dataObject;

    const isPostExist = await db.Post.findOne({
      where: { id: postId, user_id: id },
    });

    if (_.isEmpty(isPostExist)) {
      return Promise.reject(Boom.notFound("Post not found"));
    }

    await db.Post.update(
      {
        user_id: id,
        province_id: province_id ? Number(province_id) : null,
        city_id: city_id ? Number(city_id) : null,
        caption,
        location_name,
      },
      { where: { id: postId, user_id: id }, transaction }
    );

    await transaction.commit();
    return Promise.resolve({
      ok: true,
      message: "Update post successful",
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "update post", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const deletePost = async (id, postId) => {
  const transaction = await db.sequelize.transaction();
  try {
    const isPostExist = await db.Post.findOne({
      where: { id: postId, user_id: id },
    });

    if (_.isEmpty(isPostExist)) {
      return Promise.reject(Boom.notFound("Post not found"));
    }

    await db.Post.destroy({ where: { id: postId, user_id: id }, transaction });

    await transaction.commit();

    return Promise.resolve({
      ok: true,
      message: "Delete post successful",
    });
  } catch (err) {
    console.log([fileName, "delete post", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

module.exports = {
  getMyProfile,
  getMyAddress,
  createAddress,
  createRoute,
  getMyRoute,
  createGroup,
  deleteGroup,
  getRegion,
  getNearBy,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
