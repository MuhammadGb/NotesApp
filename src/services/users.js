require("dotenv").config();
const User = require('../models/userModels');
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const jwt = require("jsonwebtoken");
const path = require("path");

const { JWT_SECRET } = process.env;

// Authenticate the user and return an authorization token for the user.
// Use this function to authenticate a user who's logging in.
const authenticate = async ({ id, email, password }) => {
  const user = await find({ email });
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if(user && isPasswordValid){
  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: 24 * 60 * 60, // Expire tokens after a certain amount of time so users can't stay logged in forever
  });
  user.token = token
}
return user
};

// Save the new user to the database and return an authorization token for the user
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

  // save the new user to our database

  return newUser;
};

const find = async ({ email }) => {
  const user = await User.findOne({email})
  return user
};

module.exports = {
  authenticate,
  create,
  find,
};
