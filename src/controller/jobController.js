const Job = require("../models/job");
const User = require("../models/UserModel");
const jobService = require("../service/jobService");
const upload = require("../utils/upload");
const CandidateProfile = require("../models/CandidateModel");
const { sendApplicationEmail } = require("../utils/mailer");
const uploadsFirebase = require("../utils/uploadsFirebase");

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

const jobPostController = {
  createJobPost: async (req, res) => {
    const {
      title,
      description,
      jobType,
      jobCategories,
      salaryType,
      minSalary,
      maxSalary,
      skills,
      qualifications,
      experience,
      address,
      country,
      state,
      workingDays,
      nameCompany,
      createdAt,
      workPlace,
      reason,
      userId,
    } = req.body;

    try {
      const createdAtDate = new Date(createdAt);
      const createdAtString = createdAtDate.toISOString().split("T")[0];

      const expiredDate = new Date(createdAtDate);
      expiredDate.setDate(createdAtDate.getDate() + 5);
      const expiredDateString = expiredDate.toISOString().split("T")[0];

      const formData = {
        title,
        description,
        jobType,
        jobCategories,
        salaryType,
        minSalary,
        maxSalary,
        skills,
        qualifications,
        experience,
        address,
        country,
        state,
        workingDays,
        nameCompany,
        createdAt: createdAtString,
        workPlace,
        reason,
        userId,
        status: "ACTIVE",
        expiredDate: expiredDateString,
      };

      if (req.file) {
        formData.image = `uploads/${req.file.filename}`;
      }

      const job = await jobService.createJobPost(formData);

      res.status(201).json({
        message: "Job posted successfully",
        job: job,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to post job",
        error: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const jobPost = await jobService.getAllJobPost();
      res.status(201).json(jobPost);
    } catch (error) {
      console.error("Error fetching job post: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getJobById: async (req, res) => {
    try {
      const jobId = req.params.id;
      const job = await jobService.getJobPostbyId(jobId);
      res.status(201).json(job);
    } catch (error) {
      console.error("Error fetching job post: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updateJobPost: async (req, res) => {
    try {
      const jobId = req.params.id;
      const newData = req.body;
      const updateJob = await jobService.updateJobPost(jobId, newData);
      if (!updateJob) {
        return res.status(404).json({ error: "Job post not found" });
      }
      res.status(200).json(updateJob);
    } catch (error) {
      console.error("Error updating job post: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  removeJobPost: async (req, res) => {
    try {
      const jobId = req.params.id;
      const removeJobPost = await jobService.removeJobPost(jobId);
      if (!removeJobPost) {
        return res.status(404).json({ error: "Job post not found" });
      }
      res.status(200).json({ message: "Job post deleted successfully" });
    } catch (error) {
      console.error("Error delete job post: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  //trieu - chuc nang apply job
  applyForJob: [
    uploadsFirebase.fields([{ name: "cvPath" }, { name: "degreePath" }]),
    async (req, res) => {
      try {
        const { jobId, userId } = req.params;
        let candidateProfile = await CandidateProfile.findOne({ user: userId });
        const selectedJob = await Job.findById(jobId);

        if (!selectedJob) {
          return res.status(404).json({ error: "Job not found" });
        }
        if (!candidateProfile) {
          return res
            .status(404)
            .json({ message: "Candidate profile not found" });
        }

        // const alreadyApplied = selectedJob.applications.some(
        //   (application) => application.applicant.toString() === userId
        // );

        // if (alreadyApplied) {
        //   return res
        //     .status(400)
        //     .json({ message: "You have already applied for this job." });
        // }

        let { fullName, email, phone, image } = candidateProfile;

        if (req.body.fullName) fullName = req.body.fullName;
        if (req.body.email) email = req.body.email;
        if (req.body.phone) phone = req.body.phone;
        if (req.body.image) image = req.body.image;

        let cvURL = null;
        let degreeURL = null;

        // Handle CV upload
        if (req.files["cvPath"]) {
          const { buffer, originalname } = req.files["cvPath"][0];
          const uniqueFileName = `${Date.now()}-${originalname}`;

          const storageRef = ref(storage, `files/${uniqueFileName}`);
          const snapshot = await uploadBytes(storageRef, buffer);

          cvURL = await getDownloadURL(snapshot.ref);
        }

        // Handle Degree upload
        if (req.files["degreePath"]) {
          const { buffer, originalname } = req.files["degreePath"][0];
          const uniqueFileName = `${Date.now()}-${originalname}`;

          const storageRef = ref(storage, `files/${uniqueFileName}`);
          const snapshot = await uploadBytes(storageRef, buffer);

          degreeURL = await getDownloadURL(snapshot.ref);
        }

        const application = {
          applicant: userId,
          cvPath: cvURL,
          degreePath: degreeURL,
          fullName,
          email,
          phone,
          image,
          introduce: req.body.introduce,
          status: "PENDING",
        };

        selectedJob.applications.push(application);
        await selectedJob.save();

        sendApplicationEmail(email, selectedJob.title, fullName);

        res.status(200).json({ message: "Application submitted successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
  ],

  listJobApplicants: async (req, res) => {
    try {
      const jobId = req.params.id;
      const statusFilter = req.query.status; // Lấy trạng thái từ query parameter

      // Tìm job bằng ID
      const job = await jobService.getJobPostById2(jobId);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Lọc ứng viên theo trạng thái nếu có
      let applicants = job.applications.map((application) => ({
        applicantId: application.applicant,
        fullName: application.fullName,
        email: application.email,
        phone: application.phone,
        cvPath: application.cvPath,
        image: application.image,
        degreePath: application.degreePath,
        introduce: application.introduce,
        appliedAt: application.appliedAt,
        status: application.status,
      }));

      if (statusFilter) {
        applicants = applicants.filter(
          (application) => application.status === statusFilter
        );
      }

      res.status(200).json({ applicants });
    } catch (error) {
      console.error("Error listing job applicants: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  listJobsByRecruiter: async (req, res) => {
    try {
      const recruiterId = req.params.userId;
      const jobs = await jobService.getJobsByRecruiter(recruiterId);

      if (!jobs.length) {
        return res
          .status(404)
          .json({ message: "No jobs found for this recruiter" });
      }

      res.status(200).json({ jobs });
    } catch (error) {
      console.error("Error listing jobs by recruiter: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getJobApplications: async (req, res) => {
    try {
      const jobId = req.params.jobId;
      const applications = await jobService.getJobApplications(jobId);
      if (!applications) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = jobPostController;
