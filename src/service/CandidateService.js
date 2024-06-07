const CandidateProfile = require("../models/CandidateModel");
const Joi = require("joi");

const profileSchema = Joi.object({
  fullName: Joi.string()
    .pattern(new RegExp("^[a-zA-Z\\s]+$"))
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.pattern.base": "Name must only contain letters",
      "string.empty": "Name is required",
    }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "edu", "vn"] },
    })
    .required()
    .messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
    }),
  phone: Joi.string().required().messages({
    "string.empty": "Phone number is required",
  }),

  website: Joi.string().allow(""),
  dateOfBirth: Joi.string().allow(""),
  sex: Joi.string().allow(""),
  jobTitle: Joi.string().allow(""),
  address: Joi.string().allow(""),
});

const createProfile = async (profileData) => {
  if (!profileData) {
    throw new Error("Profile data is required");
  }

  const { error } = profileSchema.validate(profileData);
  if (error) {
    throw new Error(error.details[0].message);
  }

  try {
    const profile = new CandidateProfile(profileData);
    return await profile.save();
  } catch (err) {
    throw new Error(`Error creating profile: ${err.message}`);
  }
};

const getProfileById = async (id) => {
  if (!id) {
    throw new Error("Profile ID is required");
  }

  try {
    const profile = await CandidateProfile.findById(id);
    if (!profile) {
      throw new Error("Profile not found");
    }
    return profile;
  } catch (err) {
    throw new Error(`Error fetching profile: ${err.message}`);
  }
};

module.exports = {
  createProfile,
  getProfileById,
};
