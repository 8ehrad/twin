import json
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None


DATA_DIR = Path(__file__).resolve().parent / "data"


def read_text_file(filename: str, fallback: str = "") -> str:
    """Read a UTF-8 data file from the backend data directory."""
    try:
        return (DATA_DIR / filename).read_text(encoding="utf-8")
    except FileNotFoundError:
        return fallback


def read_json_file(filename: str):
    with (DATA_DIR / filename).open("r", encoding="utf-8") as f:
        return json.load(f)


# Read LinkedIn PDF
if PdfReader is None:
    linkedin = "LinkedIn profile not available because pypdf is not installed"
else:
    try:
        reader = PdfReader(DATA_DIR / "linkedin.pdf")
        linkedin = ""
        for page in reader.pages:
            text = page.extract_text()
            if text:
                linkedin += text
    except FileNotFoundError:
        linkedin = "LinkedIn profile not available"

# Read other data files
summary = read_text_file("summary.txt")

style = read_text_file("style.txt")

cv = read_text_file("cv.md")

ai_capabilities = read_text_file("ai_capabilities.md")

projects = read_text_file("projects.md")

claims = read_text_file("claims.md")

qa = read_text_file("qa.md")

facts = read_json_file("facts.json")
