#!/usr/bin/env bash
# 用法: ./rebuild.sh [custom_nodes 路径]
set -e
cd "$(dirname "$0")"
PLUGINS="${1:-$PWD/../../ComfyUI/custom_nodes}"
PY="${PYTHON:-python3}"
"$PY" scripts/build_locales.py \
  --old source/zh-CN \
  --inventory inventory/node_slots_snapshot.json \
  --extra scripts/manual_zh.json \
  --manual-settings scripts/manual_settings_zh.json \
  --plugins-dir "$PLUGINS" \
  --out locales/zh \
  --js-out js/options_zh.js
"$PY" scripts/build_menus.py \
  --old source/zh-CN \
  --out js/menus_zh.js
echo "完成。重启 ComfyUI 生效。"
