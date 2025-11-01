import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      if (user && user.role === "Employer") {
        axios
          .get("http://localhost:4000/api/v1/application/employer/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      } else {
        axios
          .get("http://localhost:4000/api/v1/application/jobseeker/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }, [isAuthorized, user]);

  if (!isAuthorized) {
    navigateTo("/");
  }

  const deleteApplication = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:4000/api/v1/application/delete/${id}`,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setApplications((prev) =>
        prev.filter((application) => application._id !== id)
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting application");
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <section className="my_applications page">
      {user && user.role === "Job Seeker" ? (
        <div className="container">
          <h1>My Applications</h1>
          {applications.length <= 0 ? (
            <h4>No Applications Found</h4>
          ) : (
            applications.map((element) => (
              <JobSeekerCard
                element={element}
                key={element._id}
                deleteApplication={deleteApplication}
                openModal={openModal}
              />
            ))
          )}
        </div>
      ) : (
        <div className="container">
          <h1>Applications From Job Seekers</h1>
          {applications.length <= 0 ? (
            <h4>No Applications Found</h4>
          ) : (
            applications.map((element) => (
              <EmployerCard
                element={element}
                key={element._id}
                openModal={openModal}
              />
            ))
          )}
        </div>
      )}

      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
    </section>
  );
};

export default MyApplications;

// ✅ Job Seeker Card
const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  const isPDF = element.resume.url.endsWith(".pdf");

  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p><span>Name:</span> {element.name}</p>
        <p><span>Email:</span> {element.email}</p>
        <p><span>Phone:</span> {element.phone}</p>
        <p><span>Address:</span> {element.address}</p>
        <p><span>CoverLetter:</span> {element.coverLetter}</p>
      </div>

      <div className="resume">
        {isPDF ? (
          <a
            href={element.resume.url}
            target="_blank"
            rel="noopener noreferrer"
            className="pdf-view-link"
          >
            <button className="view-btn">View PDF</button>
          </a>
        ) : (
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        )}
      </div>

      <div className="btn_area">
        <button onClick={() => deleteApplication(element._id)}>
          Delete Application
        </button>
      </div>
    </div>
  );
};

// ✅ Employer Card
const EmployerCard = ({ element, openModal }) => {
  const isPDF = element.resume.url.endsWith(".pdf");

  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p><span>Name:</span> {element.name}</p>
        <p><span>Email:</span> {element.email}</p>
        <p><span>Phone:</span> {element.phone}</p>
        <p><span>Address:</span> {element.address}</p>
        <p><span>CoverLetter:</span> {element.coverLetter}</p>
      </div>

      <div className="resume">
        {isPDF ? (
          <a
            href={element.resume.url}
            target="_blank"
            rel="noopener noreferrer"
            className="pdf-view-link"
          >
            <button className="view-btn">View PDF</button>
          </a>
        ) : (
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        )}
      </div>
    </div>
  );
};
