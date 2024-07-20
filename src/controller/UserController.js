const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const UserService = require("../service/UserService");

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
    // console.log(req.body);
    if (!email || !password) {
      return res.status(400).json({
        status: "ERROR",
        message: "Email and password are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "ERROR",
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        status: "ERROR",
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      status: "OK",
      message: "Login SUCCESS",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
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

module.exports = {
  signUp,
  login,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
};
