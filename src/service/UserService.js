const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

const signUp = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = newUser;
    try {
      const checkUser = await User.findOne({ email });
      if (checkUser !== null) {
        return resolve({
          status: "OK",
          message: "The email is already in use",
        });
      }

      const hash = bcrypt.hashSync(password, 10);
      // console.log("hash", hash);
      const createdUser = await User.create({
        email,
        password: hash,
      });

      if (createdUser) {
        return resolve({
          status: "OK",
          message: "signUp SUCCESS",
          data: createdUser,
        });
      }
      resolve({});
    } catch (e) {
      reject(e);
    }
  });
};

const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (e) {
    throw new Error(e.message);
  }
};


const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });

      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }

      const updateUser = await User.findByIdAndUpdate(id, data, { new: true });
      // console.log('updateUser', updateUser)
      resolve({
        status: "OK",
        message: "UPDATE_SUCCESS",
        data: updateUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });

      console.log("checkUser", checkUser);

      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }

      await User.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "DELETE_SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find();
      resolve({
        status: "OK",
        message: "GETALL_SUCCESS",
        data: allUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        _id: id,
      });

      if (user === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "GET_DETAIL_USER_SUCCESS",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  signUp,
  findUserByEmail,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
};
