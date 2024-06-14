const candidateProfileService = require("../service/CandidateService");

const createProfile = async (req, res) => {
  try {
    const userId = req.body.userId;

    const profileData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      website: req.body.website || "",
      dateOfBirth: req.body.dateOfBirth || null,
      sex: req.body.sex,
      jobTitle: req.body.jobTitle,
      user: userId,
    };

    const profile = await candidateProfileService.createProfile(profileData);
    res.status(201).json({ success: true, profile });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Error creating profile: ${error.message}`,
    });
  }
};

// router.get('/:userId', async (req, res) => {
const getProfileById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await candidateProfileService.getProfileByUserId(userId);

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error retrieving profile: ${error.message}`,
    });
  }
};

module.exports = {
  createProfile,
  getProfileById,
};
