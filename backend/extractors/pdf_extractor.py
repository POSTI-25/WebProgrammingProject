"""Simple PDF text extraction utilities."""

from io import BytesIO

import pdfplumber


def extract_pdf_text(file_bytes: bytes) -> str:
    """Extract raw plain text from a PDF file represented as bytes."""
    extracted_text = []

    with pdfplumber.open(BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                extracted_text.append(page_text)

    return "\n\n".join(extracted_text)