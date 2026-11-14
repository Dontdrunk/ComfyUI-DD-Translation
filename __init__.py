"""ComfyUI-DD-Translation

v3：基于 ComfyUI 官方 locales 机制的中文翻译插件。

- 节点 / 分类 / 设置：locales/zh/*.json，由 ComfyUI 的 /api/i18n 自动收集
- 下拉框选项值、rgthree 与 Manager 自绘面板、核心对话框文案：js/ 里的最小补丁
- 节点 / 画布右键菜单里插件写死的英文：js/contextmenu_zh.js + js/menus_zh.js
"""

__version__ = "3.2.1"

NODE_CLASS_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS = {}

WEB_DIRECTORY = "./js"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
