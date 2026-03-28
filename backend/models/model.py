"""LLM helpers for converting and enhancing structured resume JSON."""

import json
import logging
import os
from pathlib import Path
from typing import Any, Dict, List

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


def _coerce_to_schema(schema_source: Any, candidate: Any) -> Any:
	"""Force candidate to keep the same JSON shape as schema_source."""
	if isinstance(schema_source, dict):
		if not isinstance(candidate, dict):
			return schema_source
		return {
			key: _coerce_to_schema(schema_source[key], candidate.get(key, schema_source[key]))
			for key in schema_source
		}

	if isinstance(schema_source, list):
		if not isinstance(candidate, list):
			return schema_source
		if not schema_source:
			return candidate
		exemplar = schema_source[0]
		return [_coerce_to_schema(exemplar, item) for item in candidate]

	if isinstance(schema_source, str):
		return candidate if isinstance(candidate, str) else schema_source

	if isinstance(schema_source, bool):
		return candidate if isinstance(candidate, bool) else schema_source

	if isinstance(schema_source, int):
		return candidate if isinstance(candidate, int) else schema_source

	if isinstance(schema_source, float):
		return candidate if isinstance(candidate, (int, float)) else schema_source

	return candidate


def enhance_with_groq_once(
	structured_json: Dict[str, Any],
	selected_options: List[str],
) -> Dict[str, Any]:
	"""Use exactly one Groq call to enhance content while preserving JSON schema."""
	api_key = os.getenv("GROQ_API_KEY")
	if not api_key:
		raise RuntimeError("Missing GROQ_API_KEY")

	# Imported here to keep startup resilient when Groq isn't needed.
	from groq import Groq

	if not selected_options:
		return structured_json

	client = Groq(api_key=api_key)

	prompt = f"""
You are a resume enhancement engine.

Rules:
1) Input is a JSON resume object.
2) Output must be valid JSON only (no markdown, no explanation).
3) Keep EXACT same schema and keys as input JSON.
4) Do not add or remove fields.
5) Improve only textual content related to selected options.

Selected options:
{json.dumps(selected_options)}

Option meanings:
- ATS Compatibility: improve ATS-friendly wording and clarity.
- Grammar & Style Fixes: correct grammar, spelling, and phrasing.
- Keyword Optimization: improve relevant keyword usage naturally.
- Soft Skills Integration: strengthen soft skills phrasing.

Input JSON:
{json.dumps(structured_json, ensure_ascii=False)}
"""

	try:
		response = client.chat.completions.create(
			model="llama-3.1-8b-instant",
			messages=[
				{"role": "system", "content": "Return JSON only."},
				{"role": "user", "content": prompt},
			],
			temperature=0.2,
		)
		raw_output = response.choices[0].message.content or ""
	except Exception:
		logger.exception("Groq enhancement call failed")
		raise

	cleaned = _extract_json_block(raw_output)
	try:
		parsed = json.loads(cleaned)
	except json.JSONDecodeError as exc:
		raise RuntimeError("Groq did not return valid JSON") from exc

	return _coerce_to_schema(structured_json, parsed)







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