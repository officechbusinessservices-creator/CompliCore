from __future__ import annotations

import os
from pathlib import Path

import httpx


class OpenVikingContextClient:
    """Context backbone client.

    - Primary: OpenViking HTTP API (if OPENVIKING_BASE_URL is configured)
    - Fallback: local workspace files under data/workspaces/<workspace>
    """

    def __init__(self, base_url: str | None = None, timeout_s: float = 8.0) -> None:
        self.base_url = (base_url or os.getenv("OPENVIKING_BASE_URL", "")).rstrip("/")
        self.timeout_s = timeout_s

    async def retrieve(
        self,
        workspace: str,
        role: str,
        query: str,
        max_chunks: int = 5,
    ) -> dict:
        uri_root = f"viking://resources/{workspace}/"

        if self.base_url:
            payload = {
                "workspace": workspace,
                "role": role,
                "query": query,
                "uri_root": uri_root,
                "tiers": ["L0", "L1", "L2"],
                "max_chunks": max_chunks,
            }
            try:
                async with httpx.AsyncClient(timeout=self.timeout_s) as client:
                    response = await client.post(f"{self.base_url}/context/retrieve", json=payload)
                    response.raise_for_status()
                    data = response.json()
                    return {
                        "provider": "openviking",
                        "uri_root": uri_root,
                        "chunks": data.get("chunks", []),
                        "raw": data,
                    }
            except Exception as exc:  # noqa: BLE001
                return {
                    "provider": "openviking-error",
                    "uri_root": uri_root,
                    "chunks": [],
                    "error": str(exc),
                }

        return self._local_fallback(workspace=workspace, role=role, query=query, max_chunks=max_chunks)

    def _local_fallback(self, workspace: str, role: str, query: str, max_chunks: int) -> dict:
        base = Path("data") / "workspaces" / workspace
        chunks: list[dict] = []

        if base.exists():
            for file_path in sorted(base.rglob("*.md"))[: max_chunks * 2]:
                try:
                    text = file_path.read_text(encoding="utf-8")
                except Exception:  # noqa: BLE001
                    continue
                if query.lower() in text.lower() or role.lower() in text.lower():
                    snippet = text[:400].replace("\n", " ")
                    chunks.append(
                        {
                            "uri": f"viking://resources/{workspace}/{file_path.relative_to(base).as_posix()}",
                            "snippet": snippet,
                        }
                    )
                if len(chunks) >= max_chunks:
                    break

        return {
            "provider": "local-fallback",
            "uri_root": f"viking://resources/{workspace}/",
            "chunks": chunks,
            "note": "OPENVIKING_BASE_URL not configured; using filesystem fallback",
        }
