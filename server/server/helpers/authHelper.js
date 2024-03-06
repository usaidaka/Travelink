const Boom = require("boom");
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
const { getKey, setKey } = require("../service/redis");

const jwtSecretTokenCredential =
  process.env.JWT_SECRET_TOKEN_CREDENTIAL || "super_strong_key";
const jwtSecretToken = process.env.JWT_SECRET_TOKEN || "super_strong_key";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "24h";
const jwtExpiresCredentialIn = process.env.JWT_EXPIRES_CREDENTIAL_IN || "24h";
const salt = bcrypt.genSaltSync(10);

const fileName = "server/helpers/authHelper.js";

// eslint-disable-next-line arrow-body-style
const __hashPassword = (password) => {
  return bcrypt.hashSync(password, salt);
};

// eslint-disable-next-line arrow-body-style
const __comparePassword = (payloadPass, dbPass) => {
  return bcrypt.compareSync(payloadPass, dbPass);
};

// eslint-disable-next-line arrow-body-style
const __generateToken = (data) => {
  return jwt.sign(data, jwtSecretToken, { expiresIn: jwtExpiresIn });
};

const __generateTokenCredential = (data) => {
  return jwt.sign(data, jwtSecretTokenCredential, {
    expiresIn: jwtExpiresCredentialIn,
  });
};

const registerUser = async (dataObject) => {
  const transaction = await db.sequelize.transaction();
  const {
    username,
    email,
    password,
    confirmPassword,
    role = "User",
    first_name,
    last_name,
    gender,
    email_contact,
    phone,
    phone_contact,
    mbti,
  } = dataObject;

  try {
    const user = await db.User.findOne({
      where: { email },
    });

    const userDetail = await db.UserDetail.findOne({
      where: { phone },
    });

    const isUsernameExist = await db.User.findOne({
      where: { username },
    });

    if (!_.isEmpty(isUsernameExist)) {
      await transaction.rollback();
      return Promise.reject(Boom.badRequest("Username has been used"));
    }

    if (!_.isEmpty(user)) {
      await transaction.rollback();
      return Promise.reject(Boom.badRequest("Email has been used"));
    }

    if (!_.isEqual(password, confirmPassword)) {
      await transaction.rollback();
      return Promise.reject(
        Boom.badRequest("Password and confirm password must to match")
      );
    }

    if (userDetail) {
      await transaction.rollback();
      return Promise.reject(Boom.badRequest("Phone number has been used"));
    }

    const hashedPass = __hashPassword(password);
    const newUser = await db.User.create(
      {
        username,
        email,
        password: hashedPass,
        image: `${
          gender === "Male"
            ? "https://cdn.vectorstock.com/i/preview-1x/66/14/default-avatar-photo-placeholder-profile-picture-vector-21806614.jpg"
            : "https://i2.wp.com/bllhlaw.com/wp-content/uploads/2018/06/blank-female-profile.png"
        }`,
        role,
      },
      { transaction }
    );

    await db.UserDetail.create(
      {
        user_id: newUser.id,
        first_name,
        last_name,
        phone,
        email_contact,
        phone_contact,
        mbti,
      },
      { transaction }
    );
    await transaction.commit();
    return Promise.resolve({ ok: true, message: "register user successfully" });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "registerUser", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const login = async (dataObject) => {
  const { email, password } = dataObject;

  try {
    const user = await db.User.findOne({
      where: { email },
      attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
      include: [
        {
          model: db.UserDetail,
          attributes: {
            exclude: ["deletedAt", "createdAt", "updatedAt", "id", "user_id"],
          },
        },
      ],
    });

    if (_.isEmpty(user)) {
      return Promise.reject(Boom.notFound("User not found"));
    }
    const wrongPasswordKey = `wrong-password/${user.id}`;
    const isWrongPassword = await getKey({
      key: wrongPasswordKey,
    });

    console.log(user.id);

    const wrongPasswordData = JSON.parse(isWrongPassword) || { count: 0 };
    console.log(wrongPasswordData);
    if (wrongPasswordData.count >= 3) {
      return Promise.reject(
        Boom.badRequest(
          `You have entered the wrong password 3 times. Please try again in 5 minutes`
        )
      );
    }

    const isPassMatched = __comparePassword(password, user.password);
    if (!isPassMatched) {
      wrongPasswordData.count += 1;
      await setKey({
        key: wrongPasswordKey,
        value: JSON.stringify(wrongPasswordData),
        isSetExpired: true,
        second: 60,
      });
      return Promise.reject(Boom.badRequest("Wrong Password"));
    }

    await setKey({
      key: wrongPasswordKey,
      value: JSON.stringify({ count: 0 }),
      isSetExpired: true,
      second: 0,
    });

    const token = __generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    const result = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      image: user.image,
      first_name: user.UserDetail?.first_name,
      last_name: user.UserDetail?.last_name,
      gender: user.UserDetail?.gender,
      mbti: user.UserDetail?.mbti,
      is_verify: user.UserDetail?.is_verify,
    };

    const resultEncrypted = encryptPayload({ decryptedData: result });

    return Promise.resolve({
      ok: true,
      message: "Log in successful",
      token,
      result: resultEncrypted,
    });
  } catch (err) {
    console.log([fileName, "login", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const forgotPassword = async (dataObject) => {
  const { email } = dataObject;
  const transaction = await db.sequelize.transaction();
  console.log(email);
  try {
    const user = await db.User.findOne({
      where: { email },
    });

    if (_.isEmpty(user)) {
      await transaction.rollback();
      return Promise.reject(Boom.notFound("User not found"));
    }

    const __generateCredential = crypto.lib.WordArray.random(16)
      .toString()
      .substring(2, 8);

    const resetPasswordToken = __generateTokenCredential({
      username: user.username,
      email: user.email,
      type: "reset-password",
    }).replace(/\./g, "_");

    const expDate = new Date(moment().add(10, "minutes").format());

    const isCredentialExist = await db.Credential.findOne({
      where: { user_id: user.id },
    });

    if (isCredentialExist) {
      await db.Credential.update(
        {
          otp: __generateCredential,
          token: resetPasswordToken,
          expiredAt: expDate,
        },
        { where: { user_id: user.id }, transaction }
      );
    } else {
      await db.Credential.create(
        {
          user_id: user.id,
          otp: __generateCredential,
          token: resetPasswordToken,
          expiredAt: expDate,
        },
        { transaction }
      );
    }

    const link = `${process.env.BASEPATH_FRONTEND}/reset-password/${resetPasswordToken}`;
    const message = `You've requested a password reset for your account. You only have 10 minutes to change new password. Please use the following code to reset your password: <strong>${__generateCredential}</strong>`;
    const mailing = {
      recipient_email: email,
      link,
      subject: "RESET PASSWORD",
      receiver: user.username,
      message,
      buttonText: "Reset Password",
    };
    await transaction.commit();
    const response = await Mailer.sendEmail(mailing);

    return Promise.resolve({
      ok: true,
      message: `${response.message}, Check your email`,
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "forgotPassword helper", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const resetPassword = async (dataObject) => {
  const { otp, newPassword, confirmNewPassword, token } = dataObject;

  console.log(token, "<<<<<< token");

  const transaction = await db.sequelize.transaction();
  try {
    const credential = await db.Credential.findOne({
      where: { otp },
    });

    const paranoidFalse = await db.Credential.findOne({
      where: { otp },
      paranoid: false,
    });

    if (paranoidFalse.deletedAt) {
      await transaction.rollback();
      return Promise.reject(Boom.badRequest("OTP already used"));
    }

    const newToken = token.replace(/\./g, "_");

    const isTokenExist = await db.Credential.findOne({
      where: { token: newToken },
    });

    if (_.isEmpty(isTokenExist)) {
      await transaction.rollback();
      return Promise.reject(Boom.badRequest("Token reset invalid"));
    }

    if (!_.isEqual(newPassword, confirmNewPassword)) {
      await transaction.rollback();
      return Promise.reject(
        Boom.badRequest("Password and confirm password should to be equal")
      );
    }

    if (_.isEmpty(credential)) {
      await transaction.rollback();
      return Promise.reject(Boom.notFound("Wrong OTP"));
    }

    if (!_.isEqual(otp, credential.otp)) {
      await transaction.rollback();
      return Promise.reject(Boom.notFound("Invalid OTP"));
    }

    const hashedPass = __hashPassword(newPassword);

    await db.User.update(
      {
        password: hashedPass,
      },
      { where: { id: credential.user_id }, transaction }
    );
    await db.Credential.destroy({ where: { otp }, transaction });

    await transaction.commit();
    const response = {
      ok: true,
      message: `Congrats! Password successfully reset`,
    };
    return Promise.resolve(response);
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "resetPassword helper", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const updateProfile = async (id, dataObject, image) => {
  const transaction = await db.sequelize.transaction();

  console.log(dataObject, ">>>dataObject<<<");
  console.log(image, "<<<<<<image");
  try {
    const {
      username,
      first_name,
      last_name,
      gender,
      email_contact,
      phone,
      phone_contact,
      mbti,
    } = dataObject;

    console.log(
      username,
      first_name,
      last_name,
      gender,
      email_contact,
      phone,
      phone_contact,
      mbti
    );

    console.log(image);

    const isExist = await db.User.findOne({
      where: { id },
      include: [{ model: db.UserDetail }],
    });

    console.log(isExist);

    if (isExist.username === username) {
      await transaction.rollback();
      return Promise.reject(Boom.badRequest("Username already used"));
    }

    if (isExist.UserDetail.phone === phone) {
      await transaction.rollback();
      return Promise.reject(Boom.badRequest("Phone already used"));
    }

    let imageResult = null;
    if (image) {
      imageResult = await cloudinary.uploadToCloudinary(image, "image");
      if (!imageResult) throw Boom.internal("Cloudinary image upload failed");
    }

    // console.log(imageResult.url);

    console.log(id);

    if (!_.isEmpty(username)) {
      await db.User.update(
        {
          username,
        },
        { where: { id }, transaction }
      );
    }

    await db.User.update(
      {
        image: image ? imageResult.url : isExist.image,
      },
      { where: { id }, transaction }
    );

    if (phone) {
      await db.UserDetail.update(
        {
          phone,
        },
        { where: { user_id: id }, transaction }
      );
    }

    await db.UserDetail.update(
      {
        first_name: first_name ? first_name : isExist?.UserDetail?.first_name,
        last_name: last_name ? last_name : isExist?.UserDetail?.last_name,
        gender: gender ? gender : isExist?.UserDetail?.gender,
        email_contact: email_contact
          ? email_contact
          : isExist?.UserDetail?.email_contact,

        phone_contact: phone_contact
          ? phone_contact
          : isExist?.UserDetail?.phone_contact,
        mbti: mbti ? mbti : isExist?.UserDetail?.mbti,
      },
      { where: { user_id: id }, transaction }
    );

    await transaction.commit();
    return Promise.resolve({
      ok: true,
      message: "Profile successfully updated",
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "update Profile", "ERROR"], {
      info: `${err}`,
    });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const changePassword = async (id, dataObject) => {
  const transaction = await db.sequelize.transaction();

  const { password, newPassword, confirmPassword } = dataObject;
  try {
    const user = await db.User.findByPk(id);

    const isPassMatched = __comparePassword(password, user.password);
    if (!isPassMatched) {
      return Promise.reject(Boom.badRequest("Wrong Password"));
    }

    if (!_.isEqual(newPassword, confirmPassword)) {
      return Promise.reject(
        Boom.badRequest("Password and Confirm Password must be much")
      );
    }

    const hashedPass = __hashPassword(newPassword);

    await db.User.update(
      {
        password: hashedPass,
      },
      { where: { id }, transaction }
    );
    await transaction.commit();
    return Promise.resolve({
      ok: true,
      message: "Change password successfully updated",
    });
  } catch (err) {
    await transaction.rollback();
    console.log([fileName, "change Password", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

module.exports = {
  registerUser,
  login,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
};
