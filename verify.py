#!/usr/bin/env python3
"""
verify.py - integrity checker for a reconstructed website project.

Usage:  python3 verify.py website/

Checks by execution (not by claim):
  1. entry point exists
  2. every referenced local file resolves to a file that exists
  3. CSS and JS are linked and non-empty
  4. no absolute / sandbox / file:// paths leaked into the output
  5. no unintended base64 image blobs
  6. every file in assets/ is actually referenced somewhere
  7. assets.json manifest <-> disk <-> HTML three-way agreement
  8. geometry.json section heights <-> what the CSS actually declares
  9. sections with no fixed height (these are the ones that balloon)

Exit code 0 = all checks passed. Non-zero = number of failed checks.
"""

import json
import os
import re
import sys
from pathlib import Path

# ---------------------------------------------------------------- extraction

REF_PATTERNS = [
    re.compile(r"""\b(?:src|href|poster|data-src)\s*=\s*["']([^"']+)["']""", re.I),
    re.compile(r"""url\(\s*['"]?([^'")]+)['"]?\s*\)""", re.I),
]
SRCSET_RE = re.compile(r"""\bsrcset\s*=\s*["']([^"']+)["']""", re.I)
BASE64_RE = re.compile(r"""data:image/[a-z+]+;base64,([A-Za-z0-9+/=]{200,})""", re.I)
BAD_PATH_RE = re.compile(r"""["'(\s](/mnt/data/|file://|[A-Za-z]:\\\\|/Users/|/home/|/tmp/)""")

EXTERNAL = ("http://", "https://", "//", "data:", "mailto:", "tel:", "#", "javascript:")

IMG_EXT = {".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg"}
FONT_EXT = {".woff", ".woff2", ".ttf", ".otf", ".eot"}


def is_local(ref: str) -> bool:
    ref = ref.strip()
    return bool(ref) and not ref.lower().startswith(EXTERNAL)


def extract_refs(text: str):
    """Return set of local reference strings found in a document."""
    found = set()
    for pat in REF_PATTERNS:
        for m in pat.findall(text):
            if is_local(m):
                found.add(m.split("?")[0].split("#")[0].strip())
    for m in SRCSET_RE.findall(text):
        for candidate in m.split(","):
            url = candidate.strip().split(" ")[0]
            if is_local(url):
                found.add(url.split("?")[0].strip())
    return found



# ---------------------------------------------------------------- geometry

CSS_COMMENT_RE = re.compile(r"/\*.*?\*/", re.S)
HEIGHT_RE = re.compile(r"(?<![\w-])(min-height|height)\s*:\s*([^;}]+)", re.I)
PX_RE = re.compile(r"^\s*(\d+(?:\.\d+)?)px\s*$", re.I)


def parse_css_rules(css_text):
    """Return list of (selector_list, body) with comments stripped."""
    css_text = CSS_COMMENT_RE.sub("", css_text)
    rules = []
    depth = 0
    buf = ""
    sel = ""
    for ch in css_text:
        if ch == "{":
            depth += 1
            if depth == 1:
                sel = buf.strip()
                buf = ""
                continue
        elif ch == "}":
            depth -= 1
            if depth == 0:
                rules.append((sel, buf))
                buf = ""
                sel = ""
                continue
        buf += ch
    return rules


def declared_height(rules, selector):
    """Find the last height/min-height in px declared for an exact selector.
    Returns (px_value, raw_string) - px_value is None if absent or non-fixed."""
    raw = None
    for sel_list, body in rules:
        selectors = [s.strip() for s in sel_list.split(",")]
        if selector.strip() not in selectors:
            continue
        for _, value in HEIGHT_RE.findall(body):
            raw = value.strip()
    if raw is None:
        return None, None
    m = PX_RE.match(raw)
    return (float(m.group(1)) if m else None), raw


def check_geometry(root, rep):
    """Compare geometry.json against what the CSS actually declares."""
    geo_path = root / "geometry.json"
    if not geo_path.is_file():
        rep.add("geometry.json present", False,
                "no geometry.json - section proportions are unverifiable (MASTER.md P1)")
        return

    try:
        geo = json.loads(geo_path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as exc:
        rep.add("geometry.json parses", False, str(exc))
        return

    sections = geo.get("sections", [])
    target_total = geo.get("page_height")
    ref_width = geo.get("reference_width", 1440)
    tolerance = float(geo.get("tolerance_pct", 3))

    css_text = "\n".join(f.read_text(encoding="utf-8", errors="ignore")
                         for f in sorted(root.rglob("*.css")))
    rules = parse_css_rules(css_text)

    unbounded, mismatched = [], []
    css_total = 0.0
    print(f"\n  GEOMETRY  (reference width {ref_width}px, tolerance +/-{tolerance:g}%)")
    print(f"  {'section':<18}{'spec':>9}{'css':>11}{'delta':>10}")
    print("  " + "-" * 48)

    for s in sections:
        sid = str(s.get("id", "?"))
        selector = s.get("selector", "")
        spec_h = s.get("height")
        css_h, raw = declared_height(rules, selector)

        if css_h is None:
            shown = raw if raw else "none"
            unbounded.append(f"{sid} ({shown})")
            print(f"  {sid:<18}{str(spec_h) + 'px':>9}{shown:>11}{'GROWS':>10}")
            continue

        css_total += css_h
        if spec_h:
            delta_pct = (css_h - spec_h) / spec_h * 100
            flag = "" if abs(delta_pct) <= tolerance else "  <<"
            print(f"  {sid:<18}{str(spec_h) + 'px':>9}"
                  f"{str(int(css_h)) + 'px':>11}{delta_pct:>+9.1f}%{flag}")
            if abs(delta_pct) > tolerance:
                mismatched.append(f"{sid} {int(spec_h)}->{int(css_h)}px ({delta_pct:+.0f}%)")

    print("  " + "-" * 48)

    rep.add("every section has a fixed height", not unbounded,
            "" if not unbounded else
            f"{len(unbounded)} section(s) will grow with content: {', '.join(unbounded[:6])}")

    rep.add("section heights match spec", not mismatched,
            "" if not mismatched else
            f"{len(mismatched)} off by >{tolerance:g}%: {', '.join(mismatched[:6])}")

    if target_total:
        total_delta = (css_total - target_total) / target_total * 100
        ok = abs(total_delta) <= tolerance and not unbounded
        detail = f"spec {int(target_total)}px vs css {int(css_total)}px ({total_delta:+.1f}%)"
        if unbounded:
            detail += f" - plus {len(unbounded)} unbounded section(s), real total is higher"
        rep.add("total page height matches spec", ok, detail)
        print(f"  total: spec {int(target_total)}px   css {int(css_total)}px   "
              f"{total_delta:+.1f}%")
        print(f"  page ratio: spec {target_total / ref_width:.2f}   "
              f"css {css_total / ref_width:.2f}\n")


# ---------------------------------------------------------------- reporting

class Report:
    def __init__(self):
        self.checks = []

    def add(self, name, ok, detail=""):
        self.checks.append((name, ok, detail))

    def failures(self):
        return [c for c in self.checks if not c[1]]

    def render(self):
        width = max(len(c[0]) for c in self.checks) + 2
        lines = ["", "=" * 68, "  VERIFY REPORT", "=" * 68]
        for name, ok, detail in self.checks:
            status = "PASS" if ok else "FAIL"
            lines.append(f"  [{status}] {name.ljust(width)} {detail}")
        lines.append("-" * 68)
        failed = self.failures()
        if failed:
            lines.append(f"  RESULT: {len(failed)} CHECK(S) FAILED - DO NOT DELIVER")
            lines.append("")
            for name, _, detail in failed:
                lines.append(f"  -> {name}: {detail}")
        else:
            lines.append("  RESULT: ALL CHECKS PASSED")
        lines.append("=" * 68)
        return "\n".join(lines)


# ---------------------------------------------------------------- main

def main(root: Path) -> int:
    rep = Report()

    if not root.is_dir():
        print(f"ERROR: {root} is not a directory")
        return 1

    # -- 1. entry point ----------------------------------------------------
    index = root / "index.html"
    rep.add("entry point index.html", index.is_file(),
            "" if index.is_file() else "index.html not found")
    if not index.is_file():
        print(rep.render())
        return len(rep.failures())

    html_files = sorted(root.rglob("*.html"))
    css_files = sorted(root.rglob("*.css"))
    js_files = sorted(root.rglob("*.js"))

    # -- 2. collect all references, resolved against their own file's dir --
    resolved = {}          # abs path -> set of origin files
    unresolved = []        # (origin, ref)
    for doc in html_files + css_files:
        try:
            text = doc.read_text(encoding="utf-8", errors="ignore")
        except OSError as exc:
            unresolved.append((doc.name, f"<unreadable: {exc}>"))
            continue
        for ref in extract_refs(text):
            target = (doc.parent / ref).resolve()
            if target.is_file():
                resolved.setdefault(target, set()).add(doc.name)
            else:
                unresolved.append((doc.name, ref))

    rep.add("all referenced files exist", not unresolved,
            "" if not unresolved else f"{len(unresolved)} broken: " +
            ", ".join(f"{o}->{r}" for o, r in unresolved[:6]))

    # -- 3. css / js linked and non-empty ----------------------------------
    index_text = index.read_text(encoding="utf-8", errors="ignore")
    linked_css = [r for r in extract_refs(index_text) if r.lower().endswith(".css")]
    has_inline_style = "<style" in index_text.lower()
    css_ok = bool(linked_css) or has_inline_style
    rep.add("stylesheet linked", css_ok,
            "" if css_ok else "no <link rel=stylesheet> and no <style> block in index.html")

    empty_css = [f.name for f in css_files if f.stat().st_size < 200]
    rep.add("stylesheets non-trivial", not empty_css,
            "" if not empty_css else f"suspiciously small: {', '.join(empty_css)}")

    empty_js = [f.name for f in js_files if f.stat().st_size == 0]
    rep.add("scripts non-empty", not empty_js,
            "" if not empty_js else f"empty: {', '.join(empty_js)}")

    # -- 4. leaked absolute / sandbox paths --------------------------------
    leaks = []
    for doc in html_files + css_files + js_files:
        text = doc.read_text(encoding="utf-8", errors="ignore")
        for m in BAD_PATH_RE.findall(text):
            leaks.append(f"{doc.name}:{m}")
    rep.add("no absolute/sandbox paths", not leaks,
            "" if not leaks else f"{len(leaks)} found: {', '.join(sorted(set(leaks))[:5])}")

    # -- 5. base64 image blobs ---------------------------------------------
    blobs = []
    for doc in html_files + css_files:
        text = doc.read_text(encoding="utf-8", errors="ignore")
        for m in BASE64_RE.findall(text):
            blobs.append(f"{doc.name} (~{len(m) * 3 // 4 // 1024}KB)")
    rep.add("no embedded base64 images", not blobs,
            "" if not blobs else f"{len(blobs)} blob(s): {', '.join(blobs[:4])}")

    # -- 6. orphaned assets -------------------------------------------------
    assets_dir = root / "assets"
    orphans = []
    asset_files = []
    if assets_dir.is_dir():
        asset_files = [p for p in assets_dir.rglob("*")
                       if p.is_file() and p.suffix.lower() in IMG_EXT | FONT_EXT]
        orphans = [p.name for p in asset_files if p.resolve() not in resolved]
    rep.add("no orphaned assets", not orphans,
            "" if not orphans else
            f"{len(orphans)} generated but never referenced: {', '.join(orphans[:6])}")

    # -- 7. manifest three-way diff ----------------------------------------
    manifest_path = root / "assets.json"
    if manifest_path.is_file():
        try:
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
            entries = manifest.get("assets", [])
            missing_on_disk, missing_in_html = [], []
            for entry in entries:
                rel = entry.get("file", "")
                aid = entry.get("id", rel or "?")
                target = (root / rel).resolve()
                if not target.is_file():
                    missing_on_disk.append(aid)
                elif target not in resolved:
                    missing_in_html.append(aid)
            rep.add("manifest assets exist on disk", not missing_on_disk,
                    "" if not missing_on_disk else
                    f"{len(missing_on_disk)} planned but not generated: {', '.join(missing_on_disk[:6])}")
            rep.add("manifest assets used in code", not missing_in_html,
                    "" if not missing_in_html else
                    f"{len(missing_in_html)} generated but not integrated: {', '.join(missing_in_html[:6])}")
            print(f"\n  manifest entries: {len(entries)}   "
                  f"asset files on disk: {len(asset_files)}   "
                  f"referenced files: {len(resolved)}")
        except (json.JSONDecodeError, OSError) as exc:
            rep.add("assets.json parses", False, str(exc))
    else:
        rep.add("assets.json present", False,
                "no manifest - three-way asset check skipped (required by MASTER.md P2)")

    check_geometry(root, rep)

    print(rep.render())
    return len(rep.failures())


if __name__ == "__main__":
    target = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    sys.exit(main(target))
