const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { mongooseHandleError } = require("../helpers");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const subscriptionList = ["starter", "pro", "business"];

const userSchema = new Schema({
  password: {
    type: String,
    minlength: 6,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    match: emailRegexp,
    unique: true,
    required: [true, "Email is required"],
  },
  subscription: {
    type: String,
    enum: subscriptionList,
    default: "starter",
  },
  token: {
    type: String,
    default: "",
  },
  avatarURL: {
    type: String,
    required: true,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
});

userSchema.post("save", mongooseHandleError);

const registerSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  subscription: Joi.string().valid(...subscriptionList),
});

const verifySchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "missing required email field",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const subscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required(),
});

const schemas = {
  registerSchema,
  loginSchema,
  subscriptionSchema,
  verifySchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
