"""LLM helpers for converting raw resume text into structured JSON."""

import json
import logging
import os
from pathlib import Path
from typing import Any, Dict

from google import genai
from dotenv import load_dotenv


_BACKEND_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(_BACKEND_ROOT / ".env")

logger = logging.getLogger(__name__)


def _extract_json_block(response_text: str) -> str:
	"""Handle cases where the model wraps JSON in markdown fences."""
	text = response_text.strip()
	if text.startswith("```"):
		lines = text.splitlines()
		if lines and lines[0].startswith("```"):
			lines = lines[1:]
		if lines and lines[-1].startswith("```"):
			lines = lines[:-1]
		text = "\n".join(lines).strip()
	return text


def structure_with_gemini_verbose(raw_text: str) -> Dict[str, Any]:
	"""Send raw extracted text to Gemini and return parsed JSON plus raw output."""
	api_key = os.getenv("GEMINI_API_KEY")
	if not api_key:
		raise RuntimeError("Missing GEMINI_API_KEY")

	client = genai.Client(api_key=api_key)

	prompt = f"""
You are given raw unstructured resume text.
Your task is to organize it into a JSON object.

Return JSON only. No markdown. No explanation.

Use this loose schema:
{{
  "name": "",
  "contact": "",
  "summary": "",
  "skills": [],
  "education": [],
  "experience": [],
  "projects": [],
  "certifications": [],
  "others": []
}}

If a field is missing, use empty string or empty array.
Capture as much information as possible.

Raw text:
{raw_text}
"""

	try:
		response = client.models.generate_content(
			model="gemini-2.5-flash",
			contents=prompt,
		)
		response_text = getattr(response, "text", "") or ""
	except Exception:
		logger.exception("Gemini generate_content failed for model gemini-1.5-flash-latest")
		raise
	cleaned = _extract_json_block(response_text)

	try:
		parsed = json.loads(cleaned)
	except json.JSONDecodeError as exc:
		raise RuntimeError("LLM did not return valid JSON") from exc

	return {
		"parsed": parsed,
		"raw_response": response_text,
	}


def structure_with_gemini(raw_text: str) -> Dict[str, Any]:
	"""Backwards-compatible helper that returns only parsed JSON."""
	return structure_with_gemini_verbose(raw_text)["parsed"]







# from google import genai
# import os
# from dotenv import load_dotenv

# load_dotenv()

# def get_client():
#     api_key = os.getenv("GEMINI_API_KEY")
#     if not api_key:
#         raise ValueError("❌ GEMINI_API_KEY not found")
#     return genai.Client(api_key=api_key)


# def list_all_models():
#     client = get_client()

#     models = client.models.list()
#     model_names = []

#     for model in models:
#         model_names.append(model.name)

#     return model_names