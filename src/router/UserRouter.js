const express = require("express");
const User = require("../models/UserModel");
const passport = require("passport");
const authenticate = require("../models/authenticate");
const router = express.Router();
const candidateController = require("../controller/CandidateController");
const userController = require("../controller/UserController");

router.post("/sign-up", userController.signUp);
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const user = require("./../models/UserModel");
const { Validator } = require("node-input-validator");
const {
  googleAuthenticate,
  googleAuthenticateCallback,
  forgotPassword,
  resetPassword,
} = require("../controller/UserController");
router.post("/sign-up", userController.signUp);
router.post("/login", userController.login);
router.get("/google", googleAuthenticate);
router.get("/google/callback", googleAuthenticateCallback);
router.get("/list", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    const err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});

router.get(
  "/facebook/token",
  passport.authenticate("facebook-token", { session: false }),
  (req, res) => {
    if (req.user) {
      const token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        token: token,
        user: req.user,
        status: "You are successfully logged in!",
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Authentication failed" });
    }
  }
);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token", resetPassword);

router.post(
  "/changePassword/:id",
  authenticate.verifyUser,
  userController.changePassword
);

module.exports = router;
