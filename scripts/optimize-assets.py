#!/usr/bin/env python3
"""Resize embedded GLB textures for the web; leave geometry and approved masters intact."""

import argparse
from copy import deepcopy
from datetime import datetime, timezone
from hashlib import sha256
from io import BytesIO
import json
from pathlib import Path
import struct

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "docs/runtime-assets.json"
RUNTIME_MODELS = ("andrea-character.glb", "hori-character.glb", "jovi-character.glb")
JSON_CHUNK, BIN_CHUNK = 0x4E4F534A, 0x004E4942


def digest(data):
    return sha256(data).hexdigest()


def parse_glb(data):
    assert len(data) >= 20, "Truncated GLB"
    magic, version, length = struct.unpack_from("<4sII", data)
    assert magic == b"glTF" and version == 2 and length == len(data), "Invalid GLB header"
    chunks, offset = {}, 12
    while offset < length:
        size, kind = struct.unpack_from("<II", data, offset)
        offset += 8
        assert size % 4 == 0 and offset + size <= length, "Invalid GLB chunk"
        assert kind not in chunks, "Repeated GLB chunk"
        chunks[kind] = data[offset:offset + size]
        offset += size
    assert offset == length and set(chunks) == {JSON_CHUNK, BIN_CHUNK}, "Expected JSON and BIN"
    doc = json.loads(chunks[JSON_CHUNK])
    binary = chunks[BIN_CHUNK]
    assert doc.get("asset", {}).get("version") == "2.0"
    assert len(doc.get("buffers", [])) == 1 and "uri" not in doc["buffers"][0], "External buffers unsupported"
    assert doc["buffers"][0]["byteLength"] <= len(binary)
    for view in doc.get("bufferViews", []):
        assert view.get("buffer", 0) == 0
        assert view.get("byteOffset", 0) + view["byteLength"] <= len(binary)
    for image in doc.get("images", []):
        assert "uri" not in image and "bufferView" in image, "External images unsupported"
    return doc, binary


def view_bytes(doc, binary, index):
    view = doc["bufferViews"][index]
    offset = view.get("byteOffset", 0)
    return binary[offset:offset + view["byteLength"]]


def triangle_count(doc):
    total = 0
    for mesh in doc.get("meshes", []):
        for primitive in mesh["primitives"]:
            accessor = primitive.get("indices", primitive.get("attributes", {}).get("POSITION"))
            count = doc["accessors"][accessor]["count"]
            mode = primitive.get("mode", 4)
            total += count // 3 if mode == 4 else max(0, count - 2) if mode in (5, 6) else 0
    return total


def pack_glb(doc, binary):
    metadata = json.dumps(doc, separators=(",", ":"), ensure_ascii=False).encode()
    metadata += b" " * (-len(metadata) % 4)
    binary += b"\0" * (-len(binary) % 4)
    length = 12 + 8 + len(metadata) + 8 + len(binary)
    return (struct.pack("<4sII", b"glTF", 2, length)
            + struct.pack("<II", len(metadata), JSON_CHUNK) + metadata
            + struct.pack("<II", len(binary), BIN_CHUNK) + binary)


def resize_image(raw, max_size, quality):
    with Image.open(BytesIO(raw)) as image:
        original_size = list(image.size)
        alpha = image.mode in ("RGBA", "LA") or "transparency" in image.info
        if alpha:
            image = image.convert("RGBA")
            alpha = image.getchannel("A").getextrema()[0] < 255
        image = image.convert("RGBA" if alpha else "RGB")
        image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        output = BytesIO()
        image.save(output, format="PNG" if alpha else "JPEG", **({"optimize": True} if alpha else {"quality": quality, "optimize": True}))
        return output.getvalue(), "image/png" if alpha else "image/jpeg", original_size, list(image.size), alpha


def optimize(data, max_size=512, quality=72):
    original, binary = parse_glb(data)
    doc = deepcopy(original)
    replacements, images = {}, []
    for image in doc.get("images", []):
        index = image["bufferView"]
        raw = view_bytes(original, binary, index)
        resized, mime, before_size, after_size, alpha = resize_image(raw, max_size, quality)
        if len(resized) >= len(raw) and before_size == after_size:
            resized, mime = raw, image["mimeType"]
        if index in replacements:
            assert replacements[index] == resized, "Conflicting shared image bufferView"
        replacements[index] = resized
        image["mimeType"] = mime
        images.append({"name": image.get("name"), "before_size": before_size, "after_size": after_size,
                       "before_bytes": len(raw), "after_bytes": len(resized), "mime_type": mime,
                       "alpha_preserved": alpha})
    rebuilt = bytearray()
    for index, view in enumerate(doc.get("bufferViews", [])):
        rebuilt.extend(b"\0" * (-len(rebuilt) % 4))
        payload = replacements.get(index, view_bytes(original, binary, index))
        view["byteOffset"], view["byteLength"] = len(rebuilt), len(payload)
        rebuilt.extend(payload)
    doc["buffers"][0]["byteLength"] = len(rebuilt)
    result = pack_glb(doc, bytes(rebuilt))
    checked, checked_binary = parse_glb(result)
    # Accessors, UVs, rigging, materials and every non-image byte remain identical.
    for key in original:
        if key not in ("buffers", "bufferViews", "images"):
            assert checked[key] == original[key], f"Changed {key}"
    for index, view in enumerate(original.get("bufferViews", [])):
        if index not in replacements:
            assert view_bytes(original, binary, index) == view_bytes(checked, checked_binary, index), "Changed geometry/animation bytes"
    assert triangle_count(checked) == triangle_count(original)
    return result, images, triangle_count(original)


def self_test():
    png = BytesIO()
    Image.new("RGBA", (768, 32), (25, 105, 225, 100)).save(png, "PNG")
    geometry = struct.pack("<9f", 0, 0, 0, 1, 0, 0, 0, 1, 0)
    image = png.getvalue()
    doc = {"asset": {"version": "2.0"}, "buffers": [{"byteLength": len(geometry) + len(image)}],
           "bufferViews": [{"buffer": 0, "byteOffset": 0, "byteLength": len(geometry)},
                           {"buffer": 0, "byteOffset": len(geometry), "byteLength": len(image)}],
           "accessors": [{"bufferView": 0, "componentType": 5126, "count": 3, "type": "VEC3"}],
           "meshes": [{"primitives": [{"attributes": {"POSITION": 0}}]}],
           "images": [{"bufferView": 1, "mimeType": "image/png", "name": "alpha-test"}]}
    source = pack_glb(doc, geometry + image)
    output, images, count = optimize(source)
    assert count == 1 and images[0]["alpha_preserved"] and images[0]["after_size"] == [512, 21]
    assert parse_glb(output)[0]["images"][0]["name"] == "alpha-test"
    try:
        parse_glb(source[:-1])
    except AssertionError:
        pass
    else:
        raise AssertionError("Truncated GLB accepted")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--masters", type=Path, help="Approved Brick Figure master directory; never modified")
    parser.add_argument("--hori-master", type=Path, help="Approved native Hori web derivative; never modified")
    parser.add_argument("--source", action="append", default=[], metavar="MODEL=PATH",
                        help="Explicit approved source for a selected resident; repeat per model")
    parser.add_argument("--provenance", action="append", default=[], metavar="MODEL=PATH",
                        help="Local derivation metadata for an explicit resident source; never a replacement master")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    self_test()
    if args.self_test:
        print("GLB texture optimizer self-check passed (geometry, alpha, corrupt input).")
        return
    previous = json.loads(REPORT.read_text()) if REPORT.exists() else {"assets": []}
    known = {item["runtime_path"]: item for item in previous["assets"]}
    paths = [ROOT / "public" / name for name in RUNTIME_MODELS]
    assert all(path.is_file() for path in paths), "Missing selected resident model"
    masters = {}
    if args.masters:
        for target, source in {"andrea-character.glb": "andrea/model.glb", "jovi-character.glb": "jovi/model.glb"}.items():
            master = args.masters / source
            if master.exists():
                masters[ROOT / "public" / target] = master
    if args.hori_master:
        masters[ROOT / "public/hori-character.glb"] = args.hori_master
    explicit = set()
    for entry in args.source:
        name, separator, value = entry.partition("=")
        assert separator and name in RUNTIME_MODELS and value and name not in explicit, "Invalid/duplicate resident source"
        master = Path(value).resolve()
        assert master.is_file(), "Resident source does not exist"
        masters[ROOT / "public" / name] = master
        explicit.add(name)
    derivations = {}
    for entry in args.provenance:
        name, separator, value = entry.partition("=")
        assert separator and name in explicit and value and name not in derivations, "Provenance requires one explicit source"
        metadata_path = Path(value).resolve()
        metadata = json.loads(metadata_path.read_text())
        source = masters[ROOT / "public" / name]
        assert metadata["derived_sha256"] == digest(source.read_bytes()), "Derivation/source hash mismatch"
        required = ("approved_master", "approved_master_sha256", "source_untouched", "method", "derived_triangles")
        optional = ("approved_master_bytes", "source_blend", "source_blend_sha256", "clip", "frame_range", "fps",
                    "pose", "source_triangles", "identity_triangles_unchanged", "merged_component_count",
                    "derivation_script_sha256")
        derivations[name] = {"provenance_path": str(metadata_path), **{key: metadata[key] for key in required},
                             **{key: metadata[key] for key in optional if key in metadata}}
    records, pending, changed = [], [], 0
    for path in paths:
        relative = path.relative_to(ROOT).as_posix()
        current = path.read_bytes()
        old = known.get(relative)
        source = masters.get(path, path)
        data = source.read_bytes() if source != path else current
        source_doc, _ = parse_glb(data)
        rig = {"skin_count": len(source_doc.get("skins", [])),
               "joint_counts": [len(skin["joints"]) for skin in source_doc.get("skins", [])],
               "animation_names": [clip.get("name", "") for clip in source_doc.get("animations", [])],
               "mesh_count": len(source_doc.get("meshes", [])), "material_count": len(source_doc.get("materials", [])),
               "draw_primitives": sum(len(mesh["primitives"]) for mesh in source_doc.get("meshes", []))}
        if path.name in derivations:
            assert derivations[path.name]["derived_triangles"] == triangle_count(source_doc), "Derivation triangle mismatch"
            rig["source_derivation"] = derivations[path.name]
        if old and digest(current) == old["runtime_sha256"] and (source == path or digest(data) == old["source_sha256"]):
            records.append({**old, **rig, **({"source_path": str(source)} if source != path else {})})
            continue
        optimized, images, triangles = optimize(data)
        record = {"runtime_path": relative, "source_path": str(source), "source_sha256": digest(data),
                  "source_bytes": len(data), "replaced_runtime_bytes": len(current), "runtime_bytes": len(optimized),
                  "runtime_sha256": digest(optimized), "triangles": triangles, "images": images,
                  "geometry_animations_uv_materials_unchanged": True, **rig}
        pending.append((path, optimized))
        records.append(record)
        changed += 1
    for path, data in pending:
        temporary = path.with_suffix(".glb.tmp")
        temporary.write_bytes(data)
        temporary.replace(path)
    report = {"generated_at_utc": datetime.now(timezone.utc).isoformat(),
              "policy": {"maximum_texture_edge": 512, "jpeg_quality": 72, "alpha_format": "PNG", "geometry": "unchanged from source"},
              "source_bytes": sum(item["source_bytes"] for item in records),
              "runtime_bytes": sum(item["runtime_bytes"] for item in records), "assets": records}
    if changed or records != previous["assets"] or not REPORT.exists():
        REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n")
    print(json.dumps({"changed": changed, "assets": len(records), "source_bytes": report["source_bytes"],
                      "runtime_bytes": report["runtime_bytes"], "report": str(REPORT)}))


if __name__ == "__main__":
    main()
