const CandidateProfile = require("../models/CandidateModel");

// Mai - function
const createProfile = async (profileData) => {
  if (!profileData) {
    throw new Error("Profile data is required");
  }

  try {
    const profile = new CandidateProfile(profileData);
    return await profile.save();
  } catch (err) {
    throw new Error(`Error creating profile: ${err.message}`);
  }
};

// Mai - function
const getProfileByUserId = async (userId) => {
  try {
    const profile = await CandidateProfile.findOne({ user: userId });
    return profile;
  } catch (err) {
    throw new Error(`Error retrieving profile: ${err.message}`);
  }
};

// Mai - function
const updateProfile = async (userId, updateData) => {
  try {
    const updateProfile = await CandidateProfile.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true }
    );
    return updateProfile;
  } catch (err) {
    throw new Error(`Error updating profile: ${err.message}`);
  }
};

module.exports = {
  createProfile,
  // getProfileById,
  getProfileByUserId,
  updateProfile,
};
