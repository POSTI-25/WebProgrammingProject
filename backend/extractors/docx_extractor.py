"""
DOCX Extractor Module
Extracts text from Microsoft Word documents (.docx, .doc)
Uses python-docx for text and hyperlink extraction

Implements the Template Method pattern hooks from BaseExtractor.
"""

from docx import Document
from typing import Dict, List, Any
from .base_extractor import BaseExtractor, ExtractionContext


class DOCXExtractor(BaseExtractor):
    """
    Extracts text content from DOCX/DOC files.

    Also extracts hyperlinks (solves Recruit CRM's anchor text problem).
    Implements Template Method hooks for DOCX-specific extraction logic.
    """

    def supports_hyperlinks(self) -> bool:
        return True

    def supports_tables(self) -> bool:
        return True

    # =========================================================================
    # TEMPLATE METHOD HOOKS - Required implementations
    # =========================================================================

    def _open_file(self, context: ExtractionContext) -> Any:
        """Open DOCX file using python-docx."""
        return Document(context.file_path)

    def _extract_raw_text(self, context: ExtractionContext) -> str:
        """Extract raw text from paragraphs and tables."""
        doc = context.file_handle

        # Extract text from paragraphs
        paragraphs_text = []
        for para in doc.paragraphs:
            if para.text.strip():
                paragraphs_text.append(para.text)

        # Extract text from tables (resumes often have tables)
        tables_text = []
        for table in doc.tables:
            for row in table.rows:
                row_text = []
                for cell in row.cells:
                    if cell.text.strip():
                        row_text.append(cell.text.strip())
                if row_text:
                    tables_text.append(' | '.join(row_text))

        # Combine all text
        full_text = '\n'.join(paragraphs_text)
        if tables_text:
            full_text += '\n\n' + '\n'.join(tables_text)

        return full_text

    def _build_metadata(self, context: ExtractionContext) -> Dict[str, Any]:
        """Build DOCX-specific metadata."""
        doc = context.file_handle
        return {
            'paragraphs_count': len(doc.paragraphs),
            'tables_count': len(doc.tables),
            'hyperlinks_found': len(context.hyperlinks)
        }

    def _extract_hyperlinks(self, context: ExtractionContext) -> List[Dict]:
        """
        Extract all hyperlinks from document (including anchor text).

        This is a KEY competitive advantage over Recruit CRM!
        """
        doc = context.file_handle
        hyperlinks = []

        # Iterate through all paragraphs
        for para in doc.paragraphs:
            # Access the paragraph's XML
            for hyperlink in para._element.xpath('.//w:hyperlink'):
                # Get the hyperlink ID
                r_id = hyperlink.get(
                    '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id'
                )
                if r_id:
                    try:
                        # Get the actual URL
                        url = doc.part.rels[r_id].target_ref

                        # Get the anchor text
                        anchor_text = ''.join(
                            node.text for node in hyperlink.iter() if node.text
                        )

                        hyperlinks.append({
                            'anchor_text': anchor_text.strip(),
                            'url': url,
                            'type': self._classify_link(url)
                        })
                    except Exception:
                        continue

        return hyperlinks