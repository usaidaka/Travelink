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

const addAddressValidation = (data) => {
  const schema = Joi.object({
    province_id: Joi.number()
      .required()
      .description("Should be between 8-20 characters"),
    city_id: Joi.number()
      .required()
      .description("Should be between 8-20 characters"),
    detail: Joi.string()
      .required()
      .description("Should be at least 8 characters"),
    longitude: Joi.number()
      .required()
      .description("Should be between 8-20 characters"),
    latitude: Joi.number()
      .required()
      .description("Should be between 8-20 characters"),
    postal_code: Joi.string()
      .required()
      .description("Should be between 8-20 characters"),
    title: Joi.string()
      .required()
      .description("Should be between 8-20 characters"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const addRouteValidation = (data) => {
  const schema = Joi.object({
    // current
    current_province_id: Joi.number().required().description("1"),
    current_city_id: Joi.number().required().description("1"),
    current_detail: Joi.string()
      .required()
      .description("Should be at least 8 characters"),
    current_longitude: Joi.number()
      .required()
      .description("Should be between 8-20 characters"),
    current_latitude: Joi.number()
      .required()
      .description("Should be between 8-20 characters"),
    // direction
    direction_detail: Joi.string()
      .required()
      .description("Should be at least 8 characters"),
    direction_province_id: Joi.number().required().description("1"),
    direction_city_id: Joi.number().required().description("1"),
    direction_longitude: Joi.number()
      .required()
      .description("Should be between 8-20 characters"),
    direction_latitude: Joi.number()
      .required()
      .description("Should be between 8-20 characters"),
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
  addAddressValidation,
  addRouteValidation,
};
