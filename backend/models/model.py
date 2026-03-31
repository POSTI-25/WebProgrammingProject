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
Your task is to extract and organize ALL information into a JSON object faithfully.

Return JSON only. No markdown. No explanation. Do NOT invent or expand any content.

Use this schema:
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

Extraction rules:
- Copy text EXACTLY as it appears. Do not rephrase or expand anything.
- If a field is missing in the source text, use empty string or empty array.
- For each experience item, extract a "responsibilities" array of bullet points.
- For each education item, always extract "gpa" or "cgpa" if present in the text.
- For "contact", join all contact info into one string separated by " | ".

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


def _strip_empty(data: Any) -> Any:
	"""Recursively remove empty strings, dicts, and lists to save LLM tokens."""
	if isinstance(data, dict):
		cleaned = {k: _strip_empty(v) for k, v in data.items()}
		return {k: v for k, v in cleaned.items() if v not in ("", [], {})}
	if isinstance(data, list):
		cleaned = [_strip_empty(item) for item in data]
		return [item for item in cleaned if item not in ("", [], {})]
	return data


def enhance_with_groq_once(
	structured_json: Dict[str, Any],
	selected_options: List[str],
) -> Dict[str, Any]:
	"""Targeted Groq enhancement — only sends fields that benefit from AI rewriting.

	Fields sent to Groq  : summary, experience (responsibilities), skills
	Fields bypassed       : name, contact, education, projects, certifications, others
	                        (kept exactly from Gemini extraction to prevent hallucination)
	"""
	api_key = os.getenv("GROQ_API_KEY")
	if not api_key:
		raise RuntimeError("Missing GROQ_API_KEY")

	from groq import Groq

	if not selected_options:
		return structured_json

	client = Groq(api_key=api_key)

	# ── Build a lean payload — only fields benefitting from enhancement ────────
	BYPASS_KEYS = {"name", "contact", "education", "projects", "certifications", "others"}
	groq_payload = _strip_empty({
		k: v for k, v in structured_json.items() if k not in BYPASS_KEYS
	})

	prompt = f"""You are a resume enhancement engine.

Rules:
1) Input is a PARTIAL JSON resume object (summary, experience, skills only).
2) Output must be valid JSON only — no markdown, no explanation.
3) Keep EXACT same schema and keys as input. Do NOT rename any key.
4) Do not add or remove fields.
5) Improve textual content based on selected options below.
6) "summary" MUST be 2-3 complete, impactful professional sentences covering background, technical expertise, and career goal.
7) "responsibilities" arrays MUST remain arrays of strings — do NOT merge or change data between different experience entries.

Selected options: {json.dumps(selected_options)}

Option meanings:
- ATS Compatibility: improve ATS-friendly wording and clarity.
- Grammar & Style Fixes: correct grammar, spelling, and phrasing.
- Keyword Optimization: improve relevant keyword usage naturally.
- Soft Skills Integration: strengthen soft skills phrasing naturally.

Input JSON:
{json.dumps(groq_payload, ensure_ascii=False)}
"""

	try:
		response = client.chat.completions.create(
			model="llama-3.1-8b-instant",
			messages=[
				{"role": "system", "content": "Return JSON only. Preserve all original data across different entries."},
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
		enhanced_partial = json.loads(cleaned)
	except json.JSONDecodeError as exc:
		raise RuntimeError("Groq did not return valid JSON") from exc

	# ── Merge: Groq-enhanced fields + bypassed fields from original ────────────
	result = {**structured_json, **enhanced_partial}

	# Coerce the enhanced portion back to original schema to prevent type drift
	return _coerce_to_schema(structured_json, result)








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