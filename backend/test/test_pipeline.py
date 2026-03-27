from io import BytesIO

from docx import Document
from fastapi.testclient import TestClient
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

import main


client = TestClient(main.app)


def _create_docx_bytes(text: str) -> bytes:
    buffer = BytesIO()
    doc = Document()
    doc.add_paragraph(text)
    doc.save(buffer)
    return buffer.getvalue()


def _create_pdf_bytes(text: str) -> bytes:
    buffer = BytesIO()
    pdf_canvas = canvas.Canvas(buffer, pagesize=letter)
    pdf_canvas.drawString(72, 720, text)
    pdf_canvas.save()
    return buffer.getvalue()


def test_missing_file_returns_error():
    response = client.post("/api/parse-document")
    payload = response.json()

    assert payload["ok"] is False
    assert payload["error"] == "file_missing"


def test_unsupported_type_returns_error():
    response = client.post(
        "/api/parse-document",
        files={"file": ("resume.txt", b"plain text", "text/plain")},
    )
    payload = response.json()

    assert payload["ok"] is False
    assert payload["error"] == "unsupported_type"


def test_docx_upload_debug_contains_raw_and_gemini(monkeypatch):
    def fake_llm(raw_text: str):
        return {
            "parsed": {
                "name": "Jane Doe",
                "contact": "",
                "summary": "",
                "skills": ["Python"],
                "education": [],
                "experience": [],
                "projects": [],
                "certifications": [],
                "others": [],
            },
            "raw_response": '{"name":"Jane Doe"}',
        }

    monkeypatch.setattr(main, "structure_with_gemini_verbose", fake_llm)

    docx_bytes = _create_docx_bytes("Jane Doe Python Developer")
    response = client.post(
        "/api/parse-document?debug=true",
        files={
            "file": (
                "resume.docx",
                docx_bytes,
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            )
        },
    )
    payload = response.json()

    assert payload["ok"] is True
    assert "Jane Doe" in payload["debug"]["raw_text"]
    assert payload["debug"]["gemini_raw"] == '{"name":"Jane Doe"}'
    assert payload["data"]["name"] == "Jane Doe"


def test_pdf_upload_debug_contains_raw_and_gemini(monkeypatch):
    def fake_llm(raw_text: str):
        return {
            "parsed": {
                "name": "John Doe",
                "contact": "",
                "summary": "",
                "skills": ["SQL"],
                "education": [],
                "experience": [],
                "projects": [],
                "certifications": [],
                "others": [],
            },
            "raw_response": '{"name":"John Doe"}',
        }

    monkeypatch.setattr(main, "structure_with_gemini_verbose", fake_llm)

    pdf_bytes = _create_pdf_bytes("John Doe Data Analyst")
    response = client.post(
        "/api/parse-document?debug=true",
        files={"file": ("resume.pdf", pdf_bytes, "application/pdf")},
    )
    payload = response.json()

    assert payload["ok"] is True
    assert "John Doe" in payload["debug"]["raw_text"]
    assert payload["debug"]["gemini_raw"] == '{"name":"John Doe"}'
    assert payload["data"]["name"] == "John Doe"
