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
    main.DOCUMENT_STORE.clear()
    response = client.post("/api/parse-document")
    payload = response.json()

    assert payload["ok"] is False
    assert payload["error"] == "file_missing"


def test_unsupported_type_returns_error():
    main.DOCUMENT_STORE.clear()
    response = client.post(
        "/api/parse-document",
        files={"file": ("resume.txt", b"plain text", "text/plain")},
    )
    payload = response.json()

    assert payload["ok"] is False
    assert payload["error"] == "unsupported_type"


def test_docx_upload_returns_document_id_and_stores_json(monkeypatch):
    main.DOCUMENT_STORE.clear()

    def fake_llm(raw_text: str):
        return {
            "name": "Jane Doe",
            "contact": "",
            "summary": "",
            "skills": ["Python"],
            "education": [],
            "experience": [],
            "projects": [],
            "certifications": [],
            "others": [],
        }

    monkeypatch.setattr(main, "structure_with_gemini", fake_llm)

    docx_bytes = _create_docx_bytes("Jane Doe Python Developer")
    response = client.post(
        "/api/parse-document",
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
    assert "document_id" in payload
    document_id = payload["document_id"]
    assert main.DOCUMENT_STORE[document_id]["name"] == "Jane Doe"


def test_pdf_upload_returns_document_id_and_stores_json(monkeypatch):
    main.DOCUMENT_STORE.clear()

    def fake_llm(raw_text: str):
        return {
            "name": "John Doe",
            "contact": "",
            "summary": "",
            "skills": ["SQL"],
            "education": [],
            "experience": [],
            "projects": [],
            "certifications": [],
            "others": [],
        }

    monkeypatch.setattr(main, "structure_with_gemini", fake_llm)

    pdf_bytes = _create_pdf_bytes("John Doe Data Analyst")
    response = client.post(
        "/api/parse-document",
        files={"file": ("resume.pdf", pdf_bytes, "application/pdf")},
    )
    payload = response.json()

    assert payload["ok"] is True
    assert "document_id" in payload
    document_id = payload["document_id"]
    assert main.DOCUMENT_STORE[document_id]["name"] == "John Doe"


def test_enhance_document_updates_store(monkeypatch):
    main.DOCUMENT_STORE.clear()

    document_id = "doc-test-1"
    main.DOCUMENT_STORE[document_id] = {
        "name": "Jane Doe",
        "contact": "",
        "summary": "good communicator",
        "skills": ["Python"],
        "education": [],
        "experience": [],
        "projects": [],
        "certifications": [],
        "others": [],
    }

    def fake_enhance(structured_json, selected_options):
        assert "Grammar & Style Fixes" in selected_options
        updated = dict(structured_json)
        updated["summary"] = "Strong communicator"
        return updated

    monkeypatch.setattr(main, "enhance_with_groq_once", fake_enhance)

    response = client.post(
        "/api/enhance-document",
        json={
            "document_id": document_id,
            "selected_options": ["Grammar & Style Fixes"],
        },
    )
    payload = response.json()

    assert payload["ok"] is True
    assert payload["document_id"] == document_id
    assert payload["data"]["summary"] == "Strong communicator"
    assert main.DOCUMENT_STORE[document_id]["summary"] == "Strong communicator"
