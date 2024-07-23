const Recruiter = require("../models/RecruiterModel");
const bcrypt = require("bcrypt");

const signUpRecruiter = (newRecruiter) => {
  return new Promise(async (resolve, reject) => {
    const {
      emailRecruiter,
      password,
      fullName,
      phone,
      company,
      gender,
      city,
      district,
    } = newRecruiter;

    try {
      const checkRecruiter = await Recruiter.findOne({ emailRecruiter });
      if (checkRecruiter !== null) {
        return resolve({
          status: "Ok",
          message: "The email is is already in recruiter",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const createRecruiter = await Recruiter.create({
        emailRecruiter,
        password: hashedPassword,
        fullName,
        phone,
        company,
        gender,
        city,
        district,
      });

      if (createRecruiter) {
        return resolve({
          status: "Ok",
          message: "Sign Up successfully",
          data: createRecruiter,
        });
      }
      resolve({});
    } catch (error) {
      reject(error);
    }
  });
};

const findRecruiterByEmail = async (emailRecruiter) => {
  try {
    return await Recruiter.findOne({ emailRecruiter });
  } catch (error) {
    throw new Error(e.message);
  }
};

module.exports = {
  signUpRecruiter,
  findRecruiterByEmail,
};
