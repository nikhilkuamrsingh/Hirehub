import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import cloudinary from "cloudinary";

// Upload resume and create application
export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;

  if (role === "Employer") {
    return next(new ErrorHandler("Employer not allowed to access this resource.", 400));
  }

  if (!req.files || !req.files.resume) {
    return next(new ErrorHandler("Resume file is required!", 400));
  }

  const { resume } = req.files;

  const allowedFormats = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // DOCX
  ];

  if (!allowedFormats.includes(resume.mimetype)) {
    return next(new ErrorHandler("Invalid file type. Allowed types: PNG, JPEG, WEBP, PDF, DOC, DOCX.", 400));
  }

  // Upload to Cloudinary with proper resource_type
  const cloudinaryResponse = await cloudinary.v2.uploader.upload(resume.tempFilePath, {
    resource_type: "auto", // handles PDF, DOC, images automatically
    folder: "resumes",
    pages: 1 // if PDF, generate preview of first page
  });

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown error");
    return next(new ErrorHandler("Failed to upload resume to Cloudinary", 500));
  }

  const { name, email, coverLetter, phone, address, jobId } = req.body;

  if (!jobId) return next(new ErrorHandler("Job ID is required!", 400));

  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) return next(new ErrorHandler("Job not found!", 404));

  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID: { user: req.user._id, role: "Job Seeker" },
    employerID: { user: jobDetails.postedBy, role: "Employer" },
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url
    }
  });

  res.status(200).json({
    success: true,
    message: "Application Submitted!",
    application
  });
});

// Get all applications for employer
export const employerGetAllApplications = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "Employer") {
    return next(new ErrorHandler("Job Seeker not allowed to access this resource.", 400));
  }

  const applications = await Application.find({ "employerID.user": req.user._id });
  res.status(200).json({
    success: true,
    applications
  });
});

// Get all applications for jobseeker
export const jobseekerGetAllApplications = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "Job Seeker") {
    return next(new ErrorHandler("Employer not allowed to access this resource.", 400));
  }

  const applications = await Application.find({ "applicantID.user": req.user._id });
  res.status(200).json({
    success: true,
    applications
  });
});

// Delete application by jobseeker
export const jobseekerDeleteApplication = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "Job Seeker") {
    return next(new ErrorHandler("Employer not allowed to access this resource.", 400));
  }

  const application = await Application.findById(req.params.id);
  if (!application) return next(new ErrorHandler("Application not found!", 404));

  await application.deleteOne();
  res.status(200).json({
    success: true,
    message: "Application Deleted!"
  });
});
