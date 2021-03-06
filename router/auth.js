const express = require("express");
const { body } = require("express-validator/check");
const User = require("../models/user");

const router = express.Router();

const authController = require("../controller/auth");

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (!userDoc) {
            return;
          }
          return Promise.reject("Email already exists!");
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().isLength({ min: 1 }),
  ],
  authController.signup
);

router.post("/login", authController.login);

module.exports = router;
