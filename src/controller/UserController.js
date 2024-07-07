const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const passport = require("passport");
UserService = require("../service/UserService");

const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!email || !password) {
      return res.status(400).json({
        status: "ERROR",
        message: "Email and password are required",
      });
    } else if (!reg.test(email)) {
      return res.status(400).json({
        status: "ERROR",
        message: "Invalid email format",
      });
    }
    const response = await UserService.signUp(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "Incorrect password" });
    }
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      status: "OK",
      message: "Login SUCCESS",
      token,
      user: { id: user._id, email: user.email, token },
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const googleAuthenticate = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
};
const googleAuthenticateCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login", failureMessage: true },
    async (err, user) => {
      if (err || !user) {
        return res.status(400).send({ message: "Login failed" });
      }

      try {
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
          expiresIn: "1d",
        });
        console.log("email : " + user.email);
        // Redirect to the client with user info in URL
        res.redirect(
          `http://localhost:3006/login?userId=${user._id}&token=${token}&email=${user.email}`
        );
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    }
  )(req, res, next);
};

module.exports = {
  signUp,
  login,
  googleAuthenticate,
  googleAuthenticateCallback,
};
