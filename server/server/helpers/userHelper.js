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

const getMyConnection = async (id) => {
  try {
    const followersData = await db.Follow.findAll({
      where: { follow_to: id },
      attributes: { exclude: ["deletedAt", "updatedAt", "following_to"] },
      include: [
        {
          model: db.User,
          as: "followBy",
          attributes: ["username", "createdAt", "id", "email", "image"],
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
            },
          ],
        },
      ],
    });

    const followersCount = await db.Follow.count({ where: { follow_to: id } });

    const followingsData = await db.Follow.findAll({
      where: { follow_by: id },
      attributes: { exclude: ["deletedAt", "updatedAt", "following_to"] },
      include: [
        {
          model: db.User,
          as: "followTo",
          attributes: ["username", "createdAt", "id", "email", "image"],
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
            },
          ],
        },
      ],
    });

    const followingsCount = await db.Follow.count({ where: { follow_to: id } });

    const totalPost = await db.Post.count({ where: { user_id: id } });

    const result = {
      followersData,
      followersCount,
      followingsData,
      followingsCount,
      totalPost,
    };

    const resultEncrypted = encryptPayload({ decryptedData: result });

    return Promise.resolve({
      ok: true,
      result: resultEncrypted,
    });
  } catch (err) {
    console.log([fileName, "get My Connection", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getConnectionById = async (userId) => {
  console.log(userId);
  try {
    const followersData = await db.Follow.findAll({
      where: { follow_to: userId },
      attributes: { exclude: ["deletedAt", "updatedAt", "following_to"] },
      include: [
        {
          model: db.User,
          as: "followBy",
          attributes: ["username", "createdAt", "id", "email", "image"],
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
            },
          ],
        },
      ],
    });

    const followersCount = await db.Follow.count({ where: { follow_to: id } });

    const followingsData = await db.Follow.findAll({
      where: { follow_by: userId },
      attributes: { exclude: ["deletedAt", "updatedAt", "following_to"] },
      include: [
        {
          model: db.User,
          as: "followTo",
          attributes: ["username", "createdAt", "id", "email", "image"],
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
            },
          ],
        },
      ],
    });

    const followingsCount = await db.Follow.count({
      where: { follow_to: userId },
    });

    const totalPost = await db.Post.count({ where: { user_id: userId } });

    const result = {
      followersData,
      followersCount,
      followingsData,
      followingsCount,
      totalPost,
    };

    const resultEncrypted = encryptPayload({ decryptedData: result });

    return Promise.resolve({
      ok: true,
      result: resultEncrypted,
    });
  } catch (err) {
    console.log([fileName, "get My Connection", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

// const getMyAddress = async (id) => {
//   try {
//     const myAddress = await db.Address.findAll({
//       where: { user_id: id },
//       attributes: {
//         exclude: ["deletedAt", "createdAt", "updatedAt", "id"],
//       },
//       include: [
//         {
//           model: db.Province,
//           attributes: ["name"],
//         },
//         {
//           model: db.City,
//           attributes: ["name"],
//         },
//       ],
//     });

//     if (_.isEmpty(myAddress)) {
//       return Promise.reject(
//         Boom.notFound("The user doesn't have an address yet")
//       );
//     }

//     return Promise.resolve({
//       ok: true,
//       message: "Get my address successfully",
//       result: myAddress,
//     });
//   } catch (err) {
//     console.log([fileName, "get My Address", "ERROR"], { info: `${err}` });
//     return Promise.reject(GeneralHelper.errorResponse(err));
//   }
// };

// const createAddress = async (id, dataObject) => {
//   const transaction = await db.sequelize.transaction();

//   try {
//     const {
//       province_id,
//       city_id,
//       detail,
//       longitude,
//       latitude,
//       postal_code,
//       title,
//     } = dataObject;

//     const isCityValid = await db.Province.findAll({
//       where: { id: province_id },
//       attributes: ["id", "name"],
//       include: [
//         {
//           model: db.City,
//           attributes: ["id", "name"],
//           where: { id: city_id },
//         },
//       ],
//     });

//     if (_.isEmpty(isCityValid)) {
//       return Promise.reject(
//         Boom.badRequest("Your selected city is not part of selected province")
//       );
//     }

//     await db.Address.create(
//       {
//         user_id: id,
//         province_id,
//         city_id,
//         detail,
//         longitude: String(longitude),
//         latitude: String(latitude),
//         postal_code,
//         title,
//       },
//       { transaction }
//     );

//     await transaction.commit();

//     return Promise.resolve({
//       ok: true,
//       message: "register address successfully",
//     });
//   } catch (err) {
//     await transaction.rollback();
//     console.log([fileName, "create Address", "ERROR"], { info: `${err}` });
//     return Promise.reject(GeneralHelper.errorResponse(err));
//   }
// };

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
    console.log(direction_latitude < ">>><<<<");
    console.log(direction_longitude, ">>><<<");

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

/* GROUP START */

const createGroup = async (id, dataObject) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { group_name, member } = dataObject;

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

    let memberId = [];
    if (!_.isEmpty(member)) {
      const userMember = await db.User.findAll({
        where: {
          username: {
            [Op.in]: member,
          },
        },
        attributes: ["id", "username"],
      });

      console.log(userMember);

      memberId = userMember.map((user) => user.id);

      const isUserAlreadyInAnotherGroup = await db.GroupPivot.findAll({
        where: {
          user_id: {
            [Op.in]: memberId,
          },
        },
      });

      if (!_.isEmpty(isUserAlreadyInAnotherGroup)) {
        await transaction.rollback();
        return Promise.reject(
          Boom.badRequest("Member already in another group")
        );
      }
    }

    // register my group
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

    // register member
    if (!_.isEmpty(member)) {
      await Promise.all(
        memberId.map(async (member) =>
          db.GroupPivot.create(
            {
              user_id: member,
              group_id: newGroup.id,
              is_leader: false,
            },
            { transaction }
          )
        )
      );
    }

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
      return Promise.reject(Boom.notFound("Group not found"));
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

const leaveGroup = async (id, groupId) => {
  const transaction = await db.sequelize.transaction();
  try {
    console.log(id, groupId);

    const isUserLeader = await db.GroupPivot.findOne({
      where: { user_id: id, group_id: groupId, is_leader: true },
    });

    console.log(isUserLeader);

    if (isUserLeader?.is_leader) {
      await transaction.rollback();
      return Promise.reject(
        Boom.badRequest("You cannot leave the group. You are the leader")
      );
    }

    const isUserInGroup = await db.GroupPivot.findOne({
      where: { user_id: id, group_id: groupId },
    });

    if (!isUserInGroup) {
      await transaction.rollback();
      return Promise.reject(
        Boom.badRequest("You are not joining any group yet")
      );
    }

    await db.GroupPivot.destroy(
      {
        where: { user_id: id, group_id: groupId },
      },
      transaction
    );

    await transaction.commit();
    console.log(isUserLeader);
    return Promise.resolve({
      ok: true,
      message: "Leave group successfully",
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "delete Group", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

// const rejectGroupInvitation = async (id, groupId) => {
//   const transaction = await db.sequelize.transaction();
//   try {
//     const isUserLeader = await db.GroupPivot.findOne({
//       where: { user_id: id, group_id: groupId, is_leader: true },
//     });

//     if (isUserLeader) {
//       await transaction.rollback();
//       return Promise.reject(
//         Boom.badRequest("You cannot leave the group. You are the leader")
//       );
//     }

//     const isUserInGroup = await db.GroupPivot.findOne({
//       where: { user_id: id, group_id: groupId },
//     });

//     if (!isUserInGroup) {
//       await transaction.rollback();
//       return Promise.reject(
//         Boom.badRequest("You are not joining any group yet")
//       );
//     }

//     const isInvited = await db.GroupPivot.findOne({
//       where: { user_id: id, group_id: groupId, is_allow: true },
//     });

//     if (isInvited) {
//       await transaction.rollback();
//       return Promise.reject(Boom.badRequest("You already joined the group"));
//     }

//     await db.GroupPivot.destroy(
//       {
//         where: { user_id: id, group_id: groupId },
//       },
//       transaction
//     );

//     await transaction.commit();
//     return Promise.resolve({
//       ok: true,
//       message: "Group invitation rejected",
//     });
//   } catch (err) {
//     await transaction.rollback();
//     console.log([fileName, "reject Group Invitation", "ERROR"], {
//       info: `${err}`,
//     });
//     return Promise.reject(GeneralHelper.errorResponse(err));
//   }
// };

// const approveGroupInvitation = async (id, groupId) => {
//   const transaction = await db.sequelize.transaction();
//   try {
//     const isUserLeader = await db.GroupPivot.findOne({
//       where: { user_id: id, group_id: groupId, is_leader: true },
//     });

//     if (isUserLeader) {
//       await transaction.rollback();
//       return Promise.reject(
//         Boom.badRequest("You are the leader, you already in the group")
//       );
//     }

//     const isUserInGroup = await db.GroupPivot.findOne({
//       where: { user_id: id, group_id: groupId },
//     });

//     if (!isUserInGroup) {
//       await transaction.rollback();
//       return Promise.reject(
//         Boom.badRequest("You are not joining any group yet")
//       );
//     }

//     const isInvited = await db.GroupPivot.findOne({
//       where: { user_id: id, group_id: groupId, is_allow: true },
//     });

//     if (isInvited) {
//       await transaction.rollback();
//       return Promise.reject(Boom.badRequest("You already joined the group"));
//     }

//     await db.GroupPivot.update(
//       {
//         is_allow: true,
//       },
//       {
//         where: { user_id: id, group_id: groupId, is_allow: false },
//         transaction,
//       }
//     );

//     await transaction.commit();
//     return Promise.resolve({
//       ok: true,
//       message: "Group invitation approved",
//     });
//   } catch (err) {
//     await transaction.rollback();
//     console.log([fileName, "approve Group Invitation", "ERROR"], {
//       info: `${err}`,
//     });
//     return Promise.reject(GeneralHelper.errorResponse(err));
//   }
// };

const updateMemberGroup = async (id, userId, groupId) => {
  const transaction = await db.sequelize.transaction();
  try {
    console.log(userId);
    if (Number(id) === Number(userId)) {
      await transaction.rollback();
      return Promise.reject(
        Boom.badRequest("You cannot update member on your own self")
      );
    }

    const isUserLeader = await db.GroupPivot.findOne({
      where: { user_id: id, group_id: groupId, is_leader: true },
    });

    const isUserInGroup = await db.GroupPivot.findOne({
      where: { user_id: userId, group_id: groupId },
    });

    if (!isUserInGroup) {
      await transaction.rollback();
      return Promise.reject(Boom.badRequest("User not found in group member"));
    }

    console.log(id, userId, groupId, isUserLeader);

    if (!isUserLeader?.is_leader) {
      await transaction.rollback();
      return Promise.reject(
        Boom.badRequest("Cannot update group. Must be a leader")
      );
    }

    await db.GroupPivot.destroy(
      {
        where: { user_id: userId, group_id: groupId },
      },
      transaction
    );

    await transaction.commit();

    return Promise.resolve({
      ok: true,
      message: "Update group member successful",
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "approve Group Invitation", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const editGroup = async (id, groupId, data) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { group_name, member } = data;
    const isGroupCreatedByUser = await db.Group.findOne({
      where: { user_id: id },
    });

    if (!isGroupCreatedByUser) {
      await transaction.rollback();
      return Promise.reject(
        Boom.badRequest("Update group must do by the leader")
      );
    }

    console.log(id, group_name, member);

    await db.Group.update(
      {
        group_name,
      },
      {
        where: {
          user_id: id,
        },
        transaction,
      }
    );

    let memberId = [];
    if (!_.isEmpty(member)) {
      const userMember = await db.User.findAll({
        where: {
          username: {
            [Op.in]: member,
          },
        },
        attributes: ["id", "username"],
      });

      console.log(userMember);

      memberId = userMember.map((user) => user.id);

      const isUserAlreadyInAnotherGroup = await db.GroupPivot.findAll({
        where: {
          user_id: {
            [Op.in]: memberId,
          },
        },
      });

      if (!_.isEmpty(isUserAlreadyInAnotherGroup)) {
        return Boom.badRequest("Member already in another group");
      }
    }

    if (!_.isEmpty(member)) {
      await Promise.all(
        memberId.map(async (member) =>
          db.GroupPivot.create(
            {
              user_id: member,
              group_id: groupId,
              is_leader: false,
            },
            { transaction }
          )
        )
      );
    }

    await transaction.commit();
    return Promise.resolve({
      ok: true,
      message: "Update group name successful",
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "edit Group", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getMyGroup = async (id) => {
  try {
    const myGroups = await db.GroupPivot.findOne({
      where: { user_id: id },
      attributes: ["is_leader", "user_id", "is_allow", "createdAt"],
      include: [
        {
          model: db.Group,
          as: "groups",
          attributes: ["id", "route_id", "group_name"],

          include: [
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
            },
            {
              model: db.User,
              as: "users",
              attributes: ["id", "username", "image"],
              through: {
                attributes: ["is_leader", "is_allow", "createdAt"],
              },
            },
          ],
        },
      ],
    });
    const resultEncrypted = encryptPayload({ decryptedData: myGroups });
    return Promise.resolve({
      ok: true,
      message: "Retrieving my group successful",
      result: resultEncrypted,
    });
  } catch (err) {
    console.log([fileName, "get My Group", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

/* GROUP END */

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
    console.log(_.isEmpty(myCurrentLocation));
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
          attributes: ["id", "username", "email", "image"],
          include: [
            { model: db.UserDetail, attributes: ["phone", "first_name"] },
          ],
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

    console.log(allUserLocation);

    if (_.isEmpty(allUserLocation)) {
      resultEncrypted = encryptPayload({ decryptedData: [] });
      return Promise.resolve({
        ok: false,
        message: "Another user don't have any trip yet",
        result: resultEncrypted,
      });
    }

    // rumus haversine
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
            user_id: near?.user?.user_id,
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

const getNearByInDirection = async (id, radius = 50) => {
  let resultEncrypted = "";
  try {
    const myDirectionLocation = await db.Route.findOne({
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

    if (_.isEmpty(myDirectionLocation)) {
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
          attributes: ["id", "username", "email", "image"],
          include: [
            { model: db.UserDetail, attributes: ["phone", "first_name"] },
          ],
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

    // rumus haversine
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
        myDirectionLocation.direction_latitude,
        myDirectionLocation.direction_longitude
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
            user_id: near?.user?.user_id,
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

const getPost = async (id, query) => {
  try {
    const { next, limit } = query;

    const currentPage = Number(next) || 0;
    const currentLimit = Number(limit) || 6;

    const formattedExclude = {
      exclude: ["deletedAt", "updatedAt", "province_id", "city_id"],
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
    idFollowTo.push(id);

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

const getUserPost = async (userId, query) => {
  try {
    const { next, limit } = query;

    const currentPage = Number(next) || 0;
    const currentLimit = Number(limit) || 6;

    const formattedExclude = {
      exclude: ["deletedAt", "updatedAt", "province_id", "city_id"],
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

    const userPost = await db.Post.findAll({
      where: { user_id: userId },
      attributes: formattedExclude,
      include: formattedInclude,
      limit: currentLimit,
      offset: currentPage,
      order,
    });

    if (_.isEmpty(userPost)) {
      return Promise.reject(Boom.notFound("Post still empty"));
    }

    return Promise.resolve({
      ok: true,
      result: userPost,
    });
  } catch (err) {
    console.log([fileName, "get user post", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getPostDetail = async (postId) => {
  try {
    const formattedExclude = {
      exclude: ["deletedAt", "updatedAt", "province_id", "city_id"],
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

    const post = await db.Post.findOne({
      where: { id: postId },
      attributes: formattedExclude,
      include: formattedInclude,
    });

    return Promise.resolve({
      ok: true,
      result: post,
    });
  } catch (err) {
    console.log([fileName, "get post detail", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const createPost = async (id, dataObject, image) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { province_id, city_id, caption, location_name } = dataObject;
    console.log(image);
    if (!image) {
      return Promise.reject(Boom.badRequest("Image cannot be empty"));
    }

    let imageResult = null;
    if (image) {
      imageResult = await cloudinary.uploadToCloudinary(image, "image");
      if (!imageResult) throw Boom.internal("Cloudinary image upload failed");
    }
    console.log(imageResult);
    const post = await db.Post.create(
      {
        user_id: id,
        province_id: isNaN(Number(province_id)) ? null : Number(province_id),
        city_id: isNaN(Number(city_id)) ? null : Number(city_id),
        caption,
        location_name: location_name === "undefined" ? "" : location_name,
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

    console.log(isPostExist);

    if (_.isEmpty(isPostExist)) {
      return Promise.reject(Boom.notFound("Post not found"));
    }

    await db.Post.update(
      {
        user_id: id,
        province_id: province_id ? Number(province_id) : null,
        city_id: city_id ? Number(city_id) : null,
        caption,
        location_name: location_name === "undefined" ? "" : location_name,
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

    const isImageExist = await db.ImagePost.findAll({
      where: { post_id: postId },
    });

    const isCommentExist = await db.Comment.findAll({
      where: { post_id: postId },
    });

    if (!_.isEmpty(isImageExist)) {
      await db.ImagePost.destroy({ where: { post_id: postId } }, transaction);
    }

    if (!_.isEmpty(isCommentExist)) {
      await db.Comment.destroy({ where: { post_id: postId } }, transaction);
    }

    await db.Post.destroy({ where: { id: postId, user_id: id }, transaction });

    await transaction.commit();

    return Promise.resolve({
      ok: true,
      message: "Delete post successful",
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "delete post", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const comment = async (id, postId, dataObject) => {
  const transaction = await db.sequelize.transaction();
  const { comment } = dataObject;
  try {
    const isPostExist = await db.Post.findOne({
      where: { id: postId },
    });

    if (_.isEmpty(isPostExist)) {
      return Promise.reject(Boom.notFound("Post not found"));
    }

    await db.Comment.create({
      post_id: postId,
      user_id: id,
      comment,
    });

    return Promise.resolve({
      ok: true,
      message: "Comment successful",
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "delete post", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getCommentPost = async (postId) => {
  try {
    const comment = await db.Comment.findAll({
      where: { post_id: postId },
      attributes: { exclude: ["deletedAt", "updatedAt"] },
      include: [
        {
          model: db.User,
          attributes: ["username", "image"],
        },
      ],
      order: [["id", "DESC"]],
    });

    console.log(comment);

    if (_.isEmpty(comment)) {
      return Promise.resolve({
        ok: true,
        message: "Comment based on post not found",
        result: comment,
      });
    }

    return Promise.resolve({
      ok: true,
      result: comment,
    });
  } catch (err) {
    console.log([fileName, "get Comment Post", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const deleteCommentPost = async (id, commentId) => {
  const transaction = await db.sequelize.transaction();
  try {
    console.log(id, commentId);
    const comment = await db.Comment.findAll({
      where: { id: commentId, user_id: id },
      attributes: { exclude: ["deletedAt", "updatedAt"] },
      include: [
        {
          model: db.User,
          attributes: ["username", "image"],
        },
      ],
    });

    console.log(comment);

    if (_.isEmpty(comment)) {
      await transaction.rollback();
      return Promise.reject(Boom.notFound("Comment based on post not found"));
    }

    await db.Comment.destroy({ where: { id: commentId }, transaction });

    await transaction.commit();
    return Promise.resolve({
      ok: true,
      message: "Delete comment successful",
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "delete Comment Post", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getUserList = async (id, query) => {
  const { next, limit, username } = query;

  const searchUsername = username || "";

  const whereCondition = {
    id: { [Op.not]: id },
    role: { [Op.eq]: "User" },
  };

  if (searchUsername !== "") {
    whereCondition.username = { [Op.like]: `%${searchUsername}%` };
  }

  const currentPage = Number(next) || 0;
  const currentLimit = Number(limit) || 6;
  try {
    const userList = await db.User.findAll({
      where: whereCondition,
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt", "password", "role"],
      },
      include: [
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
        },
        {
          model: db.Follow,
          where: { follow_by: id },
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          required: false,
        },
        {
          model: db.UserDetail,
          attributes: ["phone"],
        },
      ],
      limit: currentLimit,
      offset: currentPage,
    });

    const resultEncrypted = encryptPayload({ decryptedData: userList });
    return Promise.resolve({
      ok: true,
      message: "Get user list successful",
      result: resultEncrypted,
    });
  } catch (err) {
    console.log([fileName, "get Comment Post", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const createFollowTo = async (id, followTo) => {
  const transaction = await db.sequelize.transaction();
  try {
    console.log(id, followTo);
    if (Number(id) === Number(followTo)) {
      await transaction.rollback();
      return Promise.reject(
        Boom.badRequest("You cannot follow or unfollow your self")
      );
    }

    const isFollowed = await db.Follow.findOne({
      where: { follow_by: id, follow_to: followTo },
      paranoid: false,
    });

    console.log(isFollowed);

    if (_.isEmpty(isFollowed)) {
      await db.Follow.create(
        {
          follow_by: id,
          follow_to: followTo,
        },
        transaction
      );
      await transaction.commit();

      return Promise.resolve({
        ok: true,
        message: "Following successful",
      });
    } else if (!isFollowed.deletedAt) {
      await db.Follow.destroy(
        {
          where: { follow_by: id, follow_to: followTo },
        },
        { transaction }
      );
      await transaction.commit();

      return Promise.resolve({
        ok: true,
        message: "unfollowing successful",
      });
    } else if (isFollowed.deletedAt) {
      await db.Follow.restore({
        where: { follow_by: id, follow_to: followTo },
        transaction,
      });

      await transaction.commit();

      return Promise.resolve({
        ok: true,
        message: "following successful",
      });
    }
  } catch (err) {
    console.log([fileName, "create Follow To", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const myFollow = async (id) => {
  try {
    const follower = await db.Follow.findAll({
      where: { follow_to: id },
      attributes: ["follow_by", "id"],
      include: [
        {
          model: db.User,
          as: "followBy",
          attributes: ["username", "image", "id"],
        },
      ],
    });

    const following = await db.Follow.findAll({
      where: { follow_by: id },
      attributes: ["follow_to", "id"],
      include: [
        {
          model: db.User,
          as: "followTo",
          attributes: ["username", "image", "id"],
        },
      ],
    });

    const result = { follower, following };

    const resultEncrypted = encryptPayload({ decryptedData: result });

    return Promise.resolve({ ok: true, result: resultEncrypted });
  } catch (err) {
    console.log([fileName, "follower", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const userFollow = async (userId) => {
  try {
    console.log(userId);

    const follower = await db.Follow.findAll({
      where: { follow_to: userId },
      attributes: ["follow_by", "id"],
      include: [
        {
          model: db.User,
          as: "followBy",
          attributes: ["username", "image", "id"],
        },
      ],
    });

    const following = await db.Follow.findAll({
      where: { follow_by: userId },
      attributes: ["follow_to", "id"],
      include: [
        {
          model: db.User,
          as: "followTo",
          attributes: ["username", "image", "id"],
        },
      ],
    });

    const result = { follower, following };

    const resultEncrypted = encryptPayload({ decryptedData: result });

    return Promise.resolve({ ok: true, result: resultEncrypted });
  } catch (err) {
    console.log([fileName, "follower", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const deleteFollower = async (id, followId) => {
  const transaction = await db.sequelize.transaction();

  try {
    console.log(id, followId);
    const isExist = await db.Follow.findOne({
      where: { id: followId, follow_to: id },
    });

    console.log(isExist);

    if (!isExist) {
      return Promise.reject(Boom.notFound("Follow relationship not found"));
    }

    await db.Follow.destroy({ where: { id: followId }, transaction });
    await transaction.commit();
    return Promise.resolve({
      ok: true,
      message: "Delete Follower successful",
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "delete Followe", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getUserProfile = async (id, userId) => {
  try {
    console.log(id, userId);
    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ["deletedAt", "updatedAt", "role", "password"] },
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
        },
        {
          model: db.Follow,
          where: { follow_by: id },
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          required: false,
        },
      ],
    });
    console.log(user);
    if (!user) {
      return Promise.reject(Boom.notFound("User not found"));
    }

    const resultEncrypted = encryptPayload({ decryptedData: user });

    return Promise.resolve({
      ok: true,
      message: "get User Profile successful",
      result: resultEncrypted,
    });
  } catch (err) {
    console.log([fileName, "get ser Profile", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

module.exports = {
  getMyProfile,
  getMyConnection,
  getConnectionById,
  // getMyAddress,
  // createAddress,
  createRoute,
  getMyRoute,
  createGroup,
  deleteGroup,
  leaveGroup,
  // rejectGroupInvitation,
  // approveGroupInvitation,
  updateMemberGroup,
  editGroup,
  getMyGroup,
  getRegion,
  getNearBy,
  getPost,
  getPostDetail,
  getUserPost,
  createPost,
  updatePost,
  deletePost,
  comment,
  getCommentPost,
  deleteCommentPost,
  getUserList,
  createFollowTo,
  myFollow,
  userFollow,
  deleteFollower,
  getUserProfile,
  getNearByInDirection,
};
