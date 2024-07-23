// Mai - function
const candidateProfileService = require("../service/CandidateService");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const { initializeApp } = require("firebase/app");
const config = require("../config/firebase.config");

initializeApp(config.firebaseConfig);
const storage = getStorage();

// Mai - function
const createProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
    let imageURL = null;

    if (req.file) {
      const { buffer, originalname } = req.file;
      const uniqueFileName = `${Date.now()}-${originalname}`;

      const storageRef = ref(storage, `files/${uniqueFileName}`);
      const snapshot = await uploadBytes(storageRef, buffer);

      imageURL = await getDownloadURL(snapshot.ref);
    }

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
      image: imageURL,
    };

    const profile = await candidateProfileService.createProfile(profileData);
    res.status(201).json({ success: true, profile });
  } catch (error) {
    console.error("Error creating profile:", error.message);
    res.status(400).json({
      success: false,
      message: `Error creating profile: ${error.message}`,
    });
  }
};

// Mai - function
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
    console.error("Error retrieving profile:", error.message);
    res.status(500).json({
      success: false,
      message: `Error retrieving profile: ${error.message}`,
    });
  }
};

// Mai - function
const updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    let imageURL = null;
    const updateData = req.body;

    if (req.file) {
      const { buffer, originalname } = req.file;
      const uniqueFileName = `${Date.now()}-${originalname}`;

      const storageRef = ref(storage, `files/${uniqueFileName}`);
      const snapshot = await uploadBytes(storageRef, buffer);

      imageURL = await getDownloadURL(snapshot.ref);
    }

    if (imageURL) {
      updateData.image = imageURL;
    }

    const updatedProfile = await candidateProfileService.updateProfile(
      userId,
      updateData
    );

    if (!updatedProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(400).json({
      success: false,
      message: `Error updating profile: ${error.message}`,
    });
  }
};

module.exports = {
  createProfile,
  getProfileById,
  updateProfile,
};
