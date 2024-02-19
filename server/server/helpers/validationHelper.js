const Joi = require("joi");
const Boom = require("boom");

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().required().description("User's username"),
    email: Joi.string().required().description("Active email"),
    password: Joi.string()
      .min(6)
      .max(20)
      .required()
      .description("Should be between 8-20 characters"),
    confirmPassword: Joi.string()
      .min(8)
      .max(20)
      .required()
      .valid(Joi.ref("password"))
      .description("Should match password"),
    role: Joi.string().optional(),
    first_name: Joi.string().required().description("User's first name"),
    last_name: Joi.string().required().description("User's last name"),
    gender: Joi.string().required().description("Male"),
    email_contact: Joi.string().optional().description("User's parent email "),
    phone: Joi.string().required().description("User's phone "),
    phone_contact: Joi.string().optional().description("User's parent phone "),
    mbti: Joi.string().required(),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().description("Active email"),
    password: Joi.string()
      .min(6)
      .max(20)
      .required()
      .description("Should be between 8-20 characters"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const forgotPasswordValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().description("Active email"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const resetPasswordValidation = (data) => {
  const schema = Joi.object({
    otp: Joi.string().required().description("one time password"),
    newPassword: Joi.string()
      .min(6)
      .max(20)
      .required()
      .description("Should be between 8-20 characters"),
    confirmNewPassword: Joi.string()
      .min(8)
      .max(20)
      .required()
      .valid(Joi.ref("newPassword"))
      .description("Should match new password"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
