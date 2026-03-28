"""Minimal API for document parsing pipeline."""

import logging
from pathlib import Path
from typing import Any, Dict, List
from uuid import uuid4

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from extractors.docx_extractor import extract_doc_text
from extractors.pdf_extractor import extract_pdf_text
from models.model import enhance_with_groq_once, structure_with_gemini


logger = logging.getLogger(__name__)

app = FastAPI(title="Resume Parser API")

# One-session in-memory store. Key: document_id, Value: structured/enhanced resume JSON.
DOCUMENT_STORE: Dict[str, Dict[str, Any]] = {}

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.get("/health")
def health_check():
	return {"ok": True}


class EnhanceRequest(BaseModel):
	document_id: str
	selected_options: List[str]


@app.post("/api/parse-document")
async def parse_document(file: UploadFile = File(None)):
	if file is None:
		logger.warning("parse_document called without file")
		return {"ok": False, "error": "file_missing", "message": "No file uploaded"}

	extension = Path(file.filename or "").suffix.lower()
	if extension not in {".pdf", ".doc", ".docx"}:
		logger.warning("Unsupported file type received: %s", extension)
		return {
			"ok": False,
			"error": "unsupported_type",
			"message": "Supported file types are .pdf, .doc, .docx",
		}

	try:
		file_bytes = await file.read()
	except Exception:
		logger.exception("Failed to read uploaded file")
		return {
			"ok": False,
			"error": "file_read_failed",
			"message": "File read failed. Check backend logs.",
		}

	try:
		if extension == ".pdf":
			raw_text = extract_pdf_text(file_bytes)
		else:
			raw_text = extract_doc_text(file_bytes, extension)
	except Exception:
		logger.exception("Extraction failed for file: %s", file.filename)
		return {
			"ok": False,
			"error": "extraction_failed",
			"message": "Extraction failed. Check backend logs.",
		}

	if not raw_text.strip():
		return {
			"ok": False,
			"error": "extraction_failed",
			"message": "No text extracted from document",
		}

	try:
		structured_data = structure_with_gemini(raw_text)
	except Exception:
		logger.exception("LLM processing failed")
		return {
			"ok": False,
			"error": "llm_failed",
			"message": "LLM processing failed. Check backend logs.",
		}

	document_id = str(uuid4())
	DOCUMENT_STORE[document_id] = structured_data

	return {"ok": True, "document_id": document_id}


@app.post("/api/enhance-document")
def enhance_document(payload: EnhanceRequest):
	document_id = payload.document_id.strip()
	if not document_id:
		return {
			"ok": False,
			"error": "document_id_missing",
			"message": "document_id is required",
		}

	if document_id not in DOCUMENT_STORE:
		return {
			"ok": False,
			"error": "document_not_found",
			"message": "Document not found in current session",
		}

	structured_json = DOCUMENT_STORE[document_id]

	try:
		enhanced_json = enhance_with_groq_once(structured_json, payload.selected_options)
	except Exception:
		logger.exception("Enhancement failed for document_id=%s", document_id)
		return {
			"ok": False,
			"error": "enhancement_failed",
			"message": "Enhancement failed. Check backend logs.",
		}

	DOCUMENT_STORE[document_id] = enhanced_json
	return {
		"ok": True,
		"document_id": document_id,
		"data": enhanced_json,
	}



# from fastapi import FastAPI
# from models.model import list_all_models

# app = FastAPI()

# @app.get("/models")
# def get_models():
#     try:
#         models = list_all_models()
#         return {
#             "count": len(models),
#             "models": models
#         }
#     except Exception as e:
#         return {"error": str(e)}