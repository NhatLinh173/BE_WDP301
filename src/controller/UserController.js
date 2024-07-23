const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const passport = require("passport");
const nodemailer = require("nodemailer");
const UserService = require("../service/UserService");
const user = require("./../models/UserModel");
const { Validator } = require("node-input-validator");

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
          `http://localhost:3006/login?id=${user._id}&token=${token}&email=${user.email}`
        );
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    }
  )(req, res, next);
};
const forgotPassword = async (req, res) => {
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
    console.error(err); // Log error chi tiết để kiểm tra
    res.status(500).send({ err: err.message });
  }
};

const resetPassword = async (req, res) => {
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
};
const changePassword = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      old_password: "required",
      new_password: "required",
      confirm_password: "required|same:new_password",
    });
    const matched = await v.check();
    if (!matched) {
      return res.status(422).send(v.errors);
    }

    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).send({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(
      req.body.old_password,
      currentUser.password
    );
    if (!isMatch) {
      return res.status(400).send({ message: "Old Password does not match" });
    }

    const isSamePassword = await bcrypt.compare(
      req.body.new_password,
      currentUser.password
    );

    if (isSamePassword) {
      return res
        .status(400)
        .send({ message: "Sorry! You entered an old password" });
    }

    const hashPassword = await bcrypt.hash(req.body.new_password, 10);
    await User.updateOne({ _id: currentUser._id }, { password: hashPassword });

    const updatedUser = await User.findOne({ _id: currentUser._id });
    return res
      .status(200)
      .send({ message: "Password successfully updated", data: updatedUser });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(200).json({
        status: "ERRO",
        message: "The userID is required",
      });
    }
    const response = await UserService.getDetailsUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(200).json({
        status: "ERRO",
        message: "The userID is required",
      });
    }
    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userID is required",
      });
    }
    const response = await UserService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  signUp,
  login,
  googleAuthenticate,
  googleAuthenticateCallback,
  forgotPassword,
  resetPassword,
  changePassword,
  getAllUser,
  getDetailsUser,
  deleteUser,
  updateUser,
};
