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

module.exports = {
  signUp,
  findUserByEmail,
};
