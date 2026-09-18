#!/usr/bin/env python3
"""Source-preserving raster optimizer for AnatoQuest.

Scans app/src/assets for PNG/JPEG source art and writes WebP candidates into
a git-ignored mirror directory (app/src/assets-optimized). Source files are
never modified. See docs/architecture/02-assets-performance-and-verification.md.
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

from PIL import Image, ImageOps

REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = REPO_ROOT / "app" / "src" / "assets"
OUTPUT_DIR = REPO_ROOT / "app" / "src" / "assets-optimized"
CACHE_PATH = OUTPUT_DIR / ".cache.json"
MANIFEST_PATH = OUTPUT_DIR / "manifest.json"
SOURCE_EXTS = {".png", ".jpg", ".jpeg"}
QUALITY = 80
MAX_WIDTH = 2048


def fingerprint(path: Path) -> str:
    stat = path.stat()
    return f"{stat.st_size}:{int(stat.st_mtime)}"


def load_cache() -> dict[str, str]:
    if CACHE_PATH.exists():
        return json.loads(CACHE_PATH.read_text(encoding="utf-8"))
    return {}


def optimize_one(src: Path, dst: Path) -> dict | None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    tmp = dst.with_suffix(dst.suffix + ".tmp")

    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)  # normalize orientation, then drop EXIF
        if im.mode not in ("RGBA", "RGB", "LA", "L"):
            im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
        if im.width > MAX_WIDTH:
            ratio = MAX_WIDTH / im.width
            im = im.resize((MAX_WIDTH, round(im.height * ratio)), Image.LANCZOS)
        im.save(tmp, format="WEBP", quality=QUALITY, method=6)

    src_size = src.stat().st_size
    out_size = tmp.stat().st_size
    if out_size >= src_size:
        tmp.unlink(missing_ok=True)
        return None

    tmp.replace(dst)  # atomic on same filesystem
    return {"source": str(src.relative_to(REPO_ROOT)), "output": str(dst.relative_to(REPO_ROOT)),
             "sourceBytes": src_size, "outputBytes": out_size}


def main() -> int:
    if not SOURCE_DIR.exists():
        print(f"source dir not found: {SOURCE_DIR}", file=sys.stderr)
        return 1

    cache = load_cache()
    new_cache: dict[str, str] = {}
    manifest: list[dict] = []
    failures: list[str] = []
    processed = skipped = 0

    for src in sorted(SOURCE_DIR.rglob("*")):
        if not src.is_file() or src.suffix.lower() not in SOURCE_EXTS:
            continue

        rel = src.relative_to(SOURCE_DIR)
        dst = (OUTPUT_DIR / rel).with_suffix(".webp")
        key = str(rel)
        fp = fingerprint(src)
        new_cache[key] = fp

        if cache.get(key) == fp and dst.exists():
            skipped += 1
            continue

        try:
            result = optimize_one(src, dst)
        except Exception as exc:  # noqa: BLE001 - report and fail CI below
            failures.append(f"{rel}: {exc}")
            continue

        if result:
            manifest.append(result)
            processed += 1
        else:
            dst.unlink(missing_ok=True)  # optimized candidate wasn't smaller

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    CACHE_PATH.write_text(json.dumps(new_cache, indent=2), encoding="utf-8")
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    print(f"optimized={processed} skipped(unchanged)={skipped} total_source={len(new_cache)}")
    if failures:
        print("failures:", file=sys.stderr)
        for line in failures:
            print(f"  {line}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
