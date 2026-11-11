# 翻译源数据

从旧插件仓库 ComfyUI-DD-Translation 的 `zh-CN/` 原样迁移过来：

- `Nodes/`      —— 253 个插件、4253 个节点类的节点翻译
- `Categories/` —— 节点分类名
- `Menus/`      —— 菜单 / 设置项等文案（旧插件用 JS 替换；现在用于生成 settings.json 和右键菜单词典 js/menus_zh.js）

这些是生成的**源数据**，不要直接改 `locales/zh/`；改完这里跑 `rebuild.bat`。
