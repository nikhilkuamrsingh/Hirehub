import React from "react";

const ResumeModal = ({ imageUrl, onClose }) => {
  const isPDF = imageUrl?.toLowerCase().endsWith(".pdf");

  return (
    <div
      className="resume-modal"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          width: "80%",
          maxWidth: "800px",
          position: "relative",
        }}
      >
        <span
          onClick={onClose}
          style={{
            cursor: "pointer",
            fontSize: "24px",
            position: "absolute",
            top: "10px",
            right: "20px",
          }}
        >
          &times;
        </span>

        {isPDF ? (
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              borderRadius: "5px",
              textDecoration: "none",
              marginTop: "20px",
            }}
          >
            View PDF
          </a>
        ) : (
          <img
            src={imageUrl}
            alt="resume"
            style={{ maxWidth: "100%", maxHeight: "600px", marginTop: "20px" }}
          />
        )}
      </div>
    </div>
  );
};

export default ResumeModal;
