#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""校验 locales/ 里的原生翻译键名，是否和运行中的 ComfyUI 对得上。

用法:
    python scripts/check_native_locales.py
    python scripts/check_native_locales.py --url http://127.0.0.1:8188 --prune

检查项:
    1. nodeDefs.json 里的节点类名，在 /object_info 里是否存在
    2. 每个节点下的 inputs 槽位名，是否是该节点真实的输入
    3. main.json 的 nodeCategories 是否被节点实际使用

退出码: 0 全部通过；1 存在不匹配；2 连不上 ComfyUI。
"""
import argparse
import json
import os
import sys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DIR = os.path.normpath(os.path.join(HERE, "..", "locales", "zh"))


def fetch_json(url, timeout=60):
    with urllib.request.urlopen(url, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def valid_slots(node_info):
    """节点真实存在的输入名（required + optional）。

    ComfyUI 会把 widget 也放在 required/optional 里，所以这里就是全部可翻译槽位。
    """
    slots = set()
    for section in ("required", "optional"):
        slots.update((node_info.get("input") or {}).get(section) or {})
    return slots


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default="http://127.0.0.1:8188", help="ComfyUI 地址")
    ap.add_argument("--dir", default=DEFAULT_DIR, help="locales 语言目录，默认 locales/zh")
    ap.add_argument("--prune", action="store_true", help="删掉实例里不存在的类/槽位并写回文件")
    ap.add_argument("--verbose", action="store_true", help="打印每个节点的槽位明细")
    args = ap.parse_args()

    node_defs_path = os.path.join(args.dir, "nodeDefs.json")
    main_path = os.path.join(args.dir, "main.json")
    if not os.path.exists(node_defs_path):
        print("找不到 %s" % node_defs_path)
        return 2

    try:
        object_info = fetch_json(args.url.rstrip("/") + "/object_info")
    except Exception as exc:  # noqa: BLE001
        print("连不上 ComfyUI (%s): %s" % (args.url, exc))
        return 2

    node_defs = json.load(open(node_defs_path, encoding="utf-8"))

    missing_class, missing_slot = [], []
    total_slots = translated_slots = 0
    pruned_defs = {}

    for cls, entry in node_defs.items():
        info = object_info.get(cls)
        if info is None:
            missing_class.append(cls)
            continue
        slots = valid_slots(info)
        total_slots += len(slots)
        kept = {}
        for key, val in (entry.get("inputs") or {}).items():
            if key in slots:
                kept[key] = val
                translated_slots += 1
            else:
                missing_slot.append((cls, key))
        new_entry = dict(entry)
        if kept:
            new_entry["inputs"] = kept
        else:
            new_entry.pop("inputs", None)
        pruned_defs[cls] = new_entry
        if args.verbose:
            covered = ", ".join(sorted(kept)) or "-"
            print("  [OK] %-34s %d/%d 槽位已覆盖: %s" % (cls, len(kept), len(slots), covered))

    print("")
    print("节点类: %d / %d 在当前实例中存在" % (len(node_defs) - len(missing_class), len(node_defs)))
    if total_slots:
        print("槽位:   %d / %d 命中（约 %.0f%%）" % (translated_slots, total_slots, 100.0 * translated_slots / total_slots))
    if missing_class:
        print("")
        print("!! 实例里不存在的节点类（多半没装对应插件，或类名已改）:")
        for cls in missing_class:
            print("   - %s" % cls)
    if missing_slot:
        print("")
        print("!! 对不上的槽位（键名漂移，需按新版插件改名）:")
        for cls, key in missing_slot:
            print("   - %s.%s" % (cls, key))

    if os.path.exists(main_path):
        cats = (json.load(open(main_path, encoding="utf-8")) or {}).get("nodeCategories") or {}
        used = set()
        for info in object_info.values():
            used.update(str(info.get("category") or "").split("/"))
        unused = sorted(k for k in cats if k not in used)
        if unused:
            print("")
            print("提示: main.json 里有 %d 条分类翻译当前实例没用到: %s" % (len(unused), ", ".join(unused[:10])))

    if args.prune:
        with open(node_defs_path, "w", encoding="utf-8") as f:
            json.dump(pruned_defs, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print("")
        print("已写回 %s（剩 %d 个节点类）" % (node_defs_path, len(pruned_defs)))
        return 0

    bad = bool(missing_class or missing_slot)
    print("")
    print("结论: %s" % ("发现问题，加 --prune 可自动清理" if bad else "全部对齐 ✅"))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
