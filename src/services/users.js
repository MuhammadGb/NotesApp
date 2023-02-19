require("dotenv").config();
const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const jwt = require("jsonwebtoken");
const path = require("path");

const { JWT_SECRET } = process.env;

const authenticate = async ({ id, email, password }) => {
  const user = await find({ email });
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (user && isPasswordValid) {
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: 24 * 60 * 60,
    });
    user.token = token;
  }
  return user;
};

const create = async ({ email, name, password }) => {
  const newUser = await User.create({
    email,
    name,
    password: await bcrypt.hash(password, 10),
  });

  const token = jwt.sign({ id: newUser.id }, JWT_SECRET, {
    expiresIn: 24 * 60 * 60,
  });

  newUser.token = token;

  return newUser;
};

const find = async ({ email }) => {
  const user = await User.findOne({ email });
  return user;
};

module.exports = {
  authenticate,
  create,
  find,
};
