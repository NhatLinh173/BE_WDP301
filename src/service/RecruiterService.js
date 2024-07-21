const Recruiter = require("../models/RecruiterModel");
const bcrypt = require("bcrypt");

const signUpRecruiter = (newRecruiter) => {
  return new Promise(async (resolve, reject) => {
    const { email, password, addressCompany, phone, nameCompany, gender } =
      newRecruiter;

    try {
      const checkRecruiter = await Recruiter.findOne({ email });
      if (checkRecruiter !== null) {
        return resolve({
          status: "Ok",
          message: "The email is is already in recruiter",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const createRecruiter = await Recruiter.create({
        email,
        password: hashedPassword,
        addressCompany,
        phone,
        nameCompany,
        gender,
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

const findRecruiterByEmail = async (email) => {
  try {
    return await Recruiter.findOne({ email });
  } catch (error) {
    throw new Error(e.message);
  }
};

module.exports = {
  signUpRecruiter,
  findRecruiterByEmail,
};
