const express = require("express");
const User = require("../models/UserModel");
const passport = require("passport");
const authenticate = require("../models/authenticate");
const router = express.Router();
userController = require("../controller/UserController");
candidateController = require("../controller/CandidateController");

router.post("/sign-up", userController.signUp);
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
userController = require("../controller/UserController");

router.post("/sign-up", userController.signUp);
router.post("/login", userController.login);

router.get(
  "/list",
  //   authenticate.verifyUser,
  //   authenticate.verifyAdmin,
  async (req, res, next) => {
    try {
      const users = await User.find({});
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(users);
    } catch (err) {
      next(err);
    }
  }
);

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

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ Status: "User not existed" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password Link",
      text: `http://localhost:3006/reset_password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).send({ Status: "Failed to send email" });
      } else {
        return res.send({ Status: "Success" });
      }
    });
  } catch (err) {
    res.status(500).send({ err: err });
  }
});
router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  try {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ Status: "Error with token" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(id, { password: hashedPassword });
      res.send({ Status: "Success" });
    });
  } catch (err) {
    res.status(500).send({ Status: err.message });
  }
});

module.exports = router;
