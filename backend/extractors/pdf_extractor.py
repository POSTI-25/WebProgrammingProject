"""
PDF Extractor Module
Extracts text from PDF resumes (text-based PDFs)
Uses pdfplumber for robust text extraction

Implements the Template Method pattern hooks from BaseExtractor.
"""

import pdfplumber
from typing import Dict, List, Any, Optional
from .base_extractor import BaseExtractor, ExtractionContext


class PDFExtractor(BaseExtractor):
    """
    Extracts text content from PDF files.

    Handles text-based PDFs (not scanned images - that's for OCR module).
    Implements Template Method hooks for PDF-specific extraction logic.
    """

    def __init__(self):
        self._pages: List[Dict] = []

    def supports_hyperlinks(self) -> bool:
        return True

    def supports_tables(self) -> bool:
        return True

    def _open_file(self, context: ExtractionContext) -> Any:
        """Open PDF file using pdfplumber."""
        pdf = pdfplumber.open(context.file_path)
        return pdf

    def _extract_raw_text(self, context: ExtractionContext) -> str:
        """Extract raw text from all PDF pages."""
        pdf = context.file_handle
        self._pages = []
        extracted_text = []

        for page_num, page in enumerate(pdf.pages, start=1):
            page_text = page.extract_text()
            if page_text:
                extracted_text.append(page_text)
                self._pages.append({
                    'page_number': page_num,
                    'text': page_text
                })

        # Store pages in extra_data for inclusion in result
        context.extra_data['pages'] = self._pages

        return '\n\n'.join(extracted_text)

    def _build_metadata(self, context: ExtractionContext) -> Dict[str, Any]:
        """Build PDF-specific metadata."""
        pdf = context.file_handle
        return {
            'total_pages': len(pdf.pages),
            'pdf_metadata': pdf.metadata,
            'hyperlinks_found': len(context.hyperlinks)
        }

    # =========================================================================
    # TEMPLATE METHOD HOOKS - Optional overrides
    # =========================================================================

    def _extract_hyperlinks(self, context: ExtractionContext) -> List[Dict]:
        """
        Extract all hyperlinks from PDF (including anchor text).

        This is a KEY competitive advantage over Recruit CRM!
        """
        pdf = context.file_handle
        hyperlinks = []

        try:
            for page_num, page in enumerate(pdf.pages, start=1):
                if page.annots:
                    for annot in page.annots:
                        if annot.get('uri'):
                            url = annot['uri']

                            # Try to get anchor text from annotation area
                            x0 = annot.get('x0', 0)
                            y0 = annot.get('top', 0)
                            x1 = annot.get('x1', 0)
                            y1 = annot.get('bottom', 0)

                            anchor_text = url
                            try:
                                bbox = (x0, y0, x1, y1)
                                cropped = page.within_bbox(bbox)
                                anchor_text = cropped.extract_text() or url
                            except:
                                pass

                            hyperlinks.append({
                                'anchor_text': anchor_text.strip(),
                                'url': url,
                                'type': self._classify_link(url),
                                'page': page_num
                            })
        except Exception:
            # If hyperlink extraction fails, continue without links
            pass

        return hyperlinks

    def _validate_extraction(self, context: ExtractionContext) -> Optional[str]:
        """Check if PDF is scanned (no text extracted)."""
        if not context.cleaned_text.strip():
            context.notes.append('PDF appears to be scanned. OCR required.')
            return 'scanned_pdf'
        return None

    def _close_file(self, context: ExtractionContext) -> None:
        """Close the PDF file handle."""
        if context.file_handle:
            try:
                context.file_handle.close()
            except Exception:
                pass

    # =========================================================================
    # ADDITIONAL PUBLIC METHODS
    # =========================================================================

    def extract_tables(self, file_path: str) -> List[Dict]:
        """
        Extract tables from PDF (useful for structured data).

        Args:
            file_path: Path to PDF file

        Returns:
            List of tables found in PDF
        """
        tables = []
        try:
            with pdfplumber.open(file_path) as pdf:
                for page_num, page in enumerate(pdf.pages, start=1):
                    page_tables = page.extract_tables()
                    if page_tables:
                        for table in page_tables:
                            tables.append({
                                'page': page_num,
                                'data': table
                            })
            return tables
        except Exception:
            return []