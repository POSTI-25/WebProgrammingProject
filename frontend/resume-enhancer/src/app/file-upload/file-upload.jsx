"use client";

import React, { useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import Header from "../../components/header.jsx";
import { ResumePDF } from "../../components/resume-pdf.jsx";
import "../../styles/file-upload.css";

import dynamic from "next/dynamic";
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false }
);
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFViewer),
  { ssr: false }
);

const ENHANCEMENT_OPTIONS = [
  "ATS Compatibility",
  "Grammar & Style Fixes",
  "Keyword Optimization",
  "Soft Skills Integration",
];

const PARSING_MESSAGES = [
  "Analyzing your resume...",
  "Extracting content...",
  "Structuring data...",
];

const ENHANCEMENT_MESSAGE_MAP = {
  "ATS Compatibility": "Improving ATS compatibility...",
  "Grammar & Style Fixes": "Refining content...",
  "Keyword Optimization": "Optimizing keywords...",
  "Soft Skills Integration": "Strengthening soft skills...",
};

export default function FileUpload() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [currentStep, setCurrentStep] = useState("upload");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [enhancedData, setEnhancedData] = useState(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const enhancementMessages = useMemo(() => {
    if (selectedOptions.length === 0) {
      return [
        "Improving ATS compatibility...",
        "Refining content...",
        "Optimizing keywords...",
      ];
    }

    return selectedOptions.map(
      (option) => ENHANCEMENT_MESSAGE_MAP[option] || "Enhancing your resume..."
    );
  }, [selectedOptions]);

  const activeLoadingMessages = isParsing ? PARSING_MESSAGES : enhancementMessages;

  useEffect(() => {
    if (!isParsing && !isEnhancing) {
      setLoadingMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % activeLoadingMessages.length);
    }, 1700);

    return () => clearInterval(interval);
  }, [isParsing, isEnhancing, activeLoadingMessages.length]);

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
    setIsParsing(true);
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
      setIsParsing(false);
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
    setIsEnhancing(true);
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
      setIsEnhancing(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="file-upload-bg">
      <Header />

      {(isParsing || isEnhancing) && (
        <div className="processing-overlay" aria-live="polite" aria-busy="true">
          <div className="processing-card">
            <div className="processing-spinner" />

            <p className="processing-stage">
              {isParsing ? "Parsing Resume" : "Applying Enhancements"}
            </p>

            <p className="processing-message">
              {activeLoadingMessages[loadingMessageIndex]}
            </p>

            <div className="processing-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      )}

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
    {currentStep !== "result" && (
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
            disabled={isSubmitting}
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
        </div>
      </div>
    )}

    {/* PDF RESULT SECTION */}
    {currentStep === "result" && enhancedData && (
      <div className="result-section">
        <div className="result-header">
          <div>
            <h2 className="result-title">Your Enhanced Resume</h2>
            <p className="result-subtitle">
              {enhancedData.name} - preview below, download as PDF
            </p>
          </div>
          <div className="result-btns">
            <PDFDownloadLink
              document={<ResumePDF data={enhancedData} />}
              fileName={`${enhancedData?.name || "resume"}_enhanced.pdf`}
            >
              {({ loading }) => (
                <button className="upload-btn download-btn" disabled={loading}>
                  {loading ? "Preparing PDF…" : "⬇ Download PDF"}
                </button>
              )}
            </PDFDownloadLink>

            <button
              className="upload-btn reset-btn"
              onClick={() => {
                setCurrentStep("upload");
                setEnhancedData(null);
                setFileName("");
                setSelectedFile(null);
                setDocumentId("");
                setSelectedOptions([]);
              }}
            >
              ↩ Enhance Another
            </button>
          </div>
        </div>

        {/* Embedded live PDF preview */}
        <div className="pdf-preview-wrapper">
          <PDFViewer width="100%" height="100%" showToolbar={false}>
            <ResumePDF data={enhancedData} />
          </PDFViewer>
        </div>
      </div>
    )}

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
