@echo off
setlocal
cd /d "%~dp0"

rem 可选参数：ComfyUI 的 custom_nodes 目录（用于扫描插件设置项）
set PLUGINS=%~1
if "%PLUGINS%"=="" set PLUGINS=D:\Projects\Procedure\ComfyUI-X\ComfyUI\custom_nodes

set PY=python
if exist "D:\Projects\Procedure\ComfyUI-X\python_embeded\python.exe" set PY=D:\Projects\Procedure\ComfyUI-X\python_embeded\python.exe

"%PY%" scripts\build_locales.py ^
  --old source\zh-CN ^
  --inventory inventory\node_slots_snapshot.json ^
  --extra scripts\manual_zh.json ^
  --manual-settings scripts\manual_settings_zh.json ^
  --plugins-dir "%PLUGINS%" ^
  --out locales\zh ^
  --js-out js\options_zh.js

echo.
echo 完成。重启 ComfyUI 生效。
pause
