"use client";

import React, { useRef, useState } from "react";
import Header from "../../components/header.jsx";
import "../../styles/file-upload.css";

export default function FileUpload() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  // Open file picker
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setFileName(file.name);
      console.log("Uploaded file:", file);
    }
  };

  // Drag Drop handlers
  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];

    if (file) {
      setFileName(file.name);
      console.log("Dropped file:", file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="file-upload-bg">
      <Header />

      {/* HERO SECTION */}
      <div className="upload-hero">
        <h1 className="upload-title">
          Elevate Your <br /> Career Narrative
        </h1>

        <p className="upload-subtitle">
          AI-powered resume optimization that gets you past ATS <br />
          filters and into interviews.
        </p>
      </div>

      {/* UPLOAD CARD */}
      <div className="upload-card">
        <div
          className="upload-dropzone"
          onClick={handleUploadClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="upload-icon">
            ⬆
          </div>

          <p className="upload-text">Drag & drop your resume here</p>
          <p className="upload-hint">or click to browse files</p>

          <button
            className="upload-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleUploadClick();
            }}
          >
            Upload PDF/DOCX
          </button>

          {/* Hidden Input */}
          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />

          {/* Show Selected File */}
          {fileName && (
            <p className="file-selected">
              ✅ Selected: <span>{fileName}</span>
            </p>
          )}
        </div>
      </div>

      {/* FACTORS SECTION */}
      <div className="upload-factors">
        <div className="factor-box">
          <h3>ATS Score Analysis</h3>
          <p>Deep compatibility check against 50+ tracking systems.</p>
        </div>

        <div className="factor-box">
          <h3>Keyword Density</h3>
          <p>Industry-specific keyword optimization for visibility.</p>
        </div>

        <div className="factor-box">
          <h3>Formatting Check</h3>
          <p>Ensure perfect parsing with clean ATS structure.</p>
        </div>
      </div>
    </div>
  );
}
