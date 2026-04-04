"""Convert all Jupyter notebooks in ai-engineering-hub to Python modules."""

from __future__ import annotations

import argparse
from pathlib import Path

import nbformat
from nbconvert import PythonExporter


def convert_notebook(notebook_path: Path, output_dir: Path) -> Path:
    exporter = PythonExporter()
    notebook = nbformat.read(str(notebook_path), as_version=4)
    body, _ = exporter.from_notebook_node(notebook)
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"{notebook_path.stem}.py"
    output_path.write_text(body, encoding="utf-8")
    return output_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert notebooks to .py files")
    parser.add_argument(
        "--source",
        default="ai-engineering-hub",
        help="Root directory to scan for notebooks",
    )
    parser.add_argument(
        "--output",
        default="ai-engineering-hub/converted_notebooks",
        help="Directory to write converted python files",
    )
    args = parser.parse_args()

    source_root = Path(args.source)
    output_root = Path(args.output)
    notebooks = list(source_root.rglob("*.ipynb"))

    if not notebooks:
        print("No notebooks found.")
        return

    for notebook in notebooks:
        converted = convert_notebook(notebook, output_root)
        print(f"Converted {notebook} -> {converted}")


if __name__ == "__main__":
    main()