"""Minimal API for document parsing pipeline."""

import logging
from pathlib import Path

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from extractors.docx_extractor import extract_doc_text
from extractors.pdf_extractor import extract_pdf_text
from models.model import structure_with_gemini_verbose


logger = logging.getLogger(__name__)

app = FastAPI(title="Resume Parser API")

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


@app.post("/api/parse-document")
async def parse_document(file: UploadFile = File(None), debug: bool = False):
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
		llm_result = structure_with_gemini_verbose(raw_text)
		structured_data = llm_result["parsed"]
		gemini_raw = llm_result.get("raw_response", "")
	except Exception:
		logger.exception("LLM processing failed")
		error_response = {
			"ok": False,
			"error": "llm_failed",
			"message": "LLM processing failed. Check backend logs.",
		}
		if debug:
			error_response["debug"] = {
				"raw_text": raw_text,
			}
		return error_response

	response = {"ok": True, "data": structured_data}
	if debug:
		response["debug"] = {
			"raw_text": raw_text,
			"gemini_raw": gemini_raw,
		}

	return response



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