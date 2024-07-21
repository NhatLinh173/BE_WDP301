const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
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

// const changePassword = async (req, res) => {
//   try {
//     const v = new Validator(req.body, {
//       old_password: "required",
//       new_password: "required",
//       confirm_password: "required|same:new_password",
//     });
//     const matched = await v.check();
//     if (!matched) {
//       return res.status(422).send(v.errors);
//     }

//     const currentUser = await User.findById(req.user._id);
//     if (!currentUser) {
//       return res.status(404).send({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(
//       req.body.old_password,
//       currentUser.password
//     );
//     if (!isMatch) {
//       return res.status(400).send({ message: "Old Password does not match" });
//     }

//     const isSamePassword = await bcrypt.compare(
//       req.body.new_password,
//       currentUser.password
//     );

//     if (isSamePassword) {
//       return res
//         .status(400)
//         .send({ message: "Sorry! You entered an old password" });
//     }

//     const hashPassword = await bcrypt.hash(req.body.new_password, 10);
//     await User.updateOne({ _id: currentUser._id }, { password: hashPassword });

//     const updatedUser = await User.findOne({ _id: currentUser._id });
//     return res
//       .status(200)
//       .send({ message: "Password successfully updated", data: updatedUser });
//   } catch (error) {
//     return res.status(500).send({ message: error.message });
//   }
// };

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

module.exports = {
  signUp,
  login,
  changePassword,
};
