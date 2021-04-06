const { validationResult } = require("express-validator/check");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error();
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashPassword) => {
      const user = new User({
        name: name,
        email: email,
        password: hashPassword,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "User created",
        userId: result._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("A user with this email could not be found!");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, loadedUser.password);
    })
    .then((isLoaded) => {
      if (!isLoaded) {
        const error = new Error("Invalid password!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        { email: loadedUser.email, userId: loadedUser._id.toString() },
        "ShadyKaSecret",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        userId: loadedUser._id.toString(),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        next(err);
      }
    });
};
