"use client";

import React, { useRef, useState } from "react";
import Header from "../../components/header.jsx";
import "../../styles/file-upload.css";

export default function FileUpload() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [parsedData, setParsedData] = useState(null);

  // Open file picker
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setErrorMessage("");
      setParsedData(null);
    }
  };

  // Drag Drop handlers
  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];

    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setErrorMessage("");
      setParsedData(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleParseDocument = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file first.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setParsedData(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://127.0.0.1:8000/api/parse-document", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.ok) {
        setErrorMessage(result.message || "Failed to parse document.");
        return;
      }

      setParsedData(result.data);
    } catch {
      setErrorMessage("Could not connect to backend. Make sure API is running.");
    } finally {
      setIsSubmitting(false);
    }
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
            <img src="/assets/file-upload.png" alt="Upload" />
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
              Selected: <span>{fileName}</span>
            </p>
          )}

          <button
            className="upload-btn"
            type="button"
            onClick={handleParseDocument}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Parsing..." : "Parse Resume"}
          </button>

          {errorMessage && <p className="file-selected">Error: {errorMessage}</p>}

          {parsedData && (
            <pre className="file-selected" style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
              {JSON.stringify(parsedData, null, 2)}
            </pre>
          )}
        </div>
      </div>

      {/* Factors Section */}
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
