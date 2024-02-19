const Boom = require("boom");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const crypto = require("crypto-js");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const db = require("../../models");
const GeneralHelper = require("./generalHelper");
const Mailer = require("../service/mailer");

const jwtSecretToken = process.env.JWT_SECRET_TOKEN || "super_strong_key";
const jwtSecretTokenCredential =
  process.env.JWT_SECRET_TOKEN_CREDENTIAL || "super_strong_key";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "24h";
const jwtExpiresCredentialIn = process.env.JWT_EXPIRES_CREDENTIAL_IN || "24h";
const fileName = "server/helpers/authHelper.js";
const salt = bcrypt.genSaltSync(10);
const cloudinary = require("../service/cloudinary");
const { encryptData } = require("../service/encrypt");

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
      attributes: { exclude: ["id", "deletedAt", "createdAt", "updatedAt"] },
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
      return Promise.reject(Boom.notFound("USER_NOT_FOUND"));
    }

    const isPassMatched = __comparePassword(password, user.password);
    if (!isPassMatched) {
      return Promise.reject(Boom.badRequest("WRONG_CREDENTIALS"));
    }

    const token = __generateToken({
      username: user.username,
      email: user.email,
      role: user.role,
    });

    const result = {
      username: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      first_name: user.UserDetail?.first_name,
      last_name: user.UserDetail?.last_name,
      gender: user.UserDetail?.gender,
      mbti: user.UserDetail?.mbti,
      is_verify: user.UserDetail?.is_verify,
    };

    const resultEncrypted = encryptData(JSON.stringify(result));

    return Promise.resolve({
      ok: true,
      message: "log in successful",
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

  try {
    const user = await db.User.findOne({
      where: { email },
    });
    console.log(user.id, "<<<<");
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
      role: user.role,
    });

    const expDate = new Date(moment().add(10, "minutes").format());

    const isCredentialExist = await db.Credential.findOne({
      where: { user_id: user.id },
    });

    if (isCredentialExist) {
      await db.Credential.update(
        {
          otp: __generateCredential,
          expiredAt: expDate,
        },
        { where: { user_id: user.id }, transaction }
      );
    } else {
      await db.Credential.create(
        {
          user_id: user.id,
          otp: __generateCredential,
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
  const { otp, newPassword, confirmNewPassword } = dataObject;
  const transaction = await db.sequelize.transaction();
  try {
    const credential = await db.Credential.findOne({
      where: { otp },
    });

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

const test = async (data) => {
  try {
    let imageResult = null;
    if (data) {
      imageResult = await cloudinary.uploadToCloudinary(data, "image");
      if (!imageResult) throw Boom.internal("Cloudinary image upload failed");
    }
    return Promise.resolve(imageResult.url);
  } catch (err) {
    console.log([fileName, "test", "ERROR"], { info: `${err}` });
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

module.exports = {
  registerUser,
  login,
  test,
  forgotPassword,
  resetPassword,
};
