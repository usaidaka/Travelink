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

const addGroup = (data) => {
  const schema = Joi.object({
    group_name: Joi.string().required().description("MTMA"),
    member: Joi.array().optional().allow(null),
    route_id: Joi.number().optional(),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const deleteGroup = (data) => {
  const schema = Joi.object({
    groupId: Joi.string().required().description("1"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const getPost = (data) => {
  const schema = Joi.object({
    next: Joi.number().optional().description("1"),
    limit: Joi.number().optional().description("1"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const createPost = (data) => {
  const schema = Joi.object({
    province_id: Joi.string().allow("").optional().description("1"),
    city_id: Joi.string().allow("").optional().description("1"),
    caption: Joi.string().allow("").optional().description("My post"),
    location_name: Joi.string()
      .allow("")
      .optional()
      .description("Batu, Malang"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const updateProfileValidation = (data) => {
  const schema = Joi.object({
    file: Joi.object({
      mimetype: Joi.string()
        .valid("image/jpeg", "image/png", "application/pdf")
        .optional(),
    }).optional(),
    username: Joi.string().optional().description("User's username"),
    email: Joi.string().optional().description("Active email"),
    first_name: Joi.string().optional().description("User's first name"),
    last_name: Joi.string().optional().description("User's last name"),
    gender: Joi.string().optional().description("Male"),
    email_contact: Joi.string().optional().description("User's parent email "),
    phone: Joi.string().optional().description("User's phone "),
    phone_contact: Joi.string().optional().description("User's parent phone "),
    mbti: Joi.string().optional(),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const changePassword = (data) => {
  const schema = Joi.object({
    password: Joi.string()
      .min(6)
      .required()
      .description("Should be between 8-20 characters"),
    newPassword: Joi.string()
      .min(6)
      .required()
      .description("Should be between 8-20 characters"),
    confirmPassword: Joi.string()
      .min(6)
      .required()
      .valid(Joi.ref("newPassword"))
      .description("Should match password"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const comment = (data) => {
  const schema = Joi.object({
    comment: Joi.string()
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
  addGroup,
  deleteGroup,
  getPost,
  createPost,
  updateProfileValidation,
  changePassword,
  comment,
};
