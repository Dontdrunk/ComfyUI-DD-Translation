# -*- coding: utf-8 -*-
r"""生成 js/menus_zh.js：把旧插件 source/zh-CN/Menus 里的菜单译文打包给前端。

右键菜单（litegraph 的 .litecontextmenu、新版 Vue 菜单）里的不少文案是插件
JS 里硬编码的英文，ComfyUI 官方 locales 覆盖不到。这里沿用旧插件的做法，
在运行时按「整段文本完全相等」替换，所以需要一个前端可用的词典。

用法:
    python scripts/build_menus.py --old source/zh-CN --out js/menus_zh.js
"""
import argparse
import glob
import json
import os
import re

# 不同插件里同名字段含义不同；这里统一成「菜单语境」下更合适的说法。
OVERRIDES = {
    "Nodes": "节点",
    "All": "全部",
    "Actions": "操作",
    "More...": "更多…",
    "Bypass": "绕过",
    "Add GetNode": "添加获取节点",
    "Add SetNode": "添加设置节点",
    "Add PreviewAnyTextNode": "添加预览文本节点",
    "Add PreviewAsTextNode": "添加预览文本节点",
    "Nodes Map (Shift+m)": "节点地图 (Shift+m)",
}

MAX_KEY = 80          # 菜单项不会这么长；更长的多半是设置说明
MAX_VALUE = 120
CJK = re.compile(r"[\u3400-\u9fff\uf900-\ufaff]")


def load_json(path):
    try:
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
        return data if isinstance(data, dict) else {}
    except Exception as exc:  # 单个文件坏掉不影响整体
        print("跳过无法读取的菜单文件: %s (%s)" % (path, exc))
        return {}


def ordered_sources(old_dir):
    """Internal.json 优先；Comfy.json 最大最杂，放最后兜底。"""
    menus_dir = os.path.join(old_dir, "Menus")
    files = sorted(glob.glob(os.path.join(menus_dir, "*.json")))
    ordered = []
    for name in ("Internal.json", "Official-Nodes.json"):
        path = os.path.join(menus_dir, name)
        if os.path.exists(path):
            ordered.append(path)
    ordered += [
        p for p in files
        if p not in ordered and os.path.basename(p) != "Comfy.json"
    ]
    comfy = os.path.join(menus_dir, "Comfy.json")
    if os.path.exists(comfy):
        ordered.append(comfy)
    return ordered


def build_table(old_dir):
    table = {}
    for path in ordered_sources(old_dir):
        for key, value in load_json(path).items():
            if not isinstance(key, str) or not isinstance(value, str):
                continue
            key = key.strip()
            value = value.strip()
            if not key or key in table:
                continue
            if len(key) > MAX_KEY or len(value) > MAX_VALUE:
                continue
            if key.startswith("__") or "\n" in key:
                continue
            if not value or value == key:
                continue
            if CJK.search(key):  # 原文已是中文
                continue
            if not re.search(r"[A-Za-z]", key):
                continue
            table[key] = value
    table.update(OVERRIDES)
    return table


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--old", default="source/zh-CN")
    ap.add_argument("--out", default="js/menus_zh.js")
    args = ap.parse_args()

    table = build_table(args.old)
    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
    with open(args.out, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("// 由 scripts/build_menus.py 生成，勿手改\n")
        fh.write("export const MENUS = ")
        json.dump(dict(sorted(table.items())), fh, ensure_ascii=False,
                  separators=(",", ":"))
        fh.write(";\n")
    print("菜单词典: %d 条 / %.0f KiB" % (
        len(table), os.path.getsize(args.out) / 1024))


if __name__ == "__main__":
    main()
