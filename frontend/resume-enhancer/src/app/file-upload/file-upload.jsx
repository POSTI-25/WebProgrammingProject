"use client";

import React, { useRef, useState } from "react";
import Header from "../../components/header.jsx";
import "../../styles/file-upload.css";

const ENHANCEMENT_OPTIONS = [
  "ATS Compatibility",
  "Grammar & Style Fixes",
  "Keyword Optimization",
  "Soft Skills Integration",
];

export default function FileUpload() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [currentStep, setCurrentStep] = useState("upload");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [enhancedData, setEnhancedData] = useState(null);

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
      setDocumentId("");
      setCurrentStep("upload");
      setSelectedOptions([]);
      setEnhancedData(null);
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
      setDocumentId("");
      setCurrentStep("upload");
      setSelectedOptions([]);
      setEnhancedData(null);
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
    setEnhancedData(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://127.0.0.1:8000/api/parse-document", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.ok) {
        setErrorMessage("Processing failed. Check backend terminal logs.");
        return;
      }

      setDocumentId(result.document_id);
      setCurrentStep("enhance");
    } catch {
      setErrorMessage("Could not connect to backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleEnhanceDocument = async () => {
    if (!documentId) {
      setErrorMessage("Missing document id. Please upload again.");
      return;
    }

    if (selectedOptions.length === 0) {
      setErrorMessage("Please select at least one enhancement option.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/enhance-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document_id: documentId,
          selected_options: selectedOptions,
        }),
      });

      const result = await response.json();

      if (!result.ok) {
        setErrorMessage(result.message || "Enhancement failed.");
        return;
      }

      setEnhancedData(result.data);
      setCurrentStep("result");
    } catch {
      setErrorMessage("Could not connect to backend.");
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

          {currentStep === "upload" && (
            <button
              className="upload-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleParseDocument();
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Parsing..." : "Parse Resume"}
            </button>
          )}

          {currentStep === "enhance" && (
            <div
              className="enhancement-options"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="enhancement-title">Select Enhancements</p>

              <div className="enhancement-grid">
                {ENHANCEMENT_OPTIONS.map((option) => (
                  <label key={option} className="enhancement-option">
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option)}
                      onChange={() => toggleOption(option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>

              <button
                className="upload-btn"
                type="button"
                onClick={handleEnhanceDocument}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enhancing..." : "Enhance Resume"}
              </button>
            </div>
          )}

          {errorMessage && <p className="file-selected">{errorMessage}</p>}

          {currentStep === "result" && enhancedData && (
            <pre className="file-selected" style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
              {JSON.stringify(enhancedData, null, 2)}
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
