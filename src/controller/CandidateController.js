const candidateProfileService = require("../service/CandidateService");

const createProfile = async (req, res) => {
  try {
    const profile = await candidateProfileService.createProfile(req.body);
    res.json({ success: true, profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// const getProfileById = async (req, res) => {
//   try {
//     const profileId = req.params.id;
//     if (!profileId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Profile ID is required" });
//     }

//     const profile = await candidateProfileService.getProfileById(profileId);
//     if (profile) {
//       res.status(200).json(profile);
//     } else {
//       res.status(404).json({ message: "Profile not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await profile.findById(id);
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createProfile,
  getProfileById,
};
