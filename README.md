ComfyUI 中文翻译插件

> **v3.1.0（2026-11-11）｜实现方式已切换为官方 locales**
>
> 节点 / 分类 / 设置面板的翻译改由 ComfyUI 官方 locales 机制加载（数据在 `locales/zh/`），
> 不再依赖 JS 钩子，官方前端更新后无需跟着改代码。
> 旧版翻译成果已完整迁移（`source/zh-CN/`，253 个文件 / 4253 个节点类）。
>
> 旧版的「悬浮翻译开关」「/agl 路由」「web/extensions 拷贝」已移除——
> 现在直接在 ComfyUI 设置里切换语言即可。仅下拉框选项值、rgthree / Manager 自绘面板
> 保留少量 JS 补丁（官方机制覆盖不到的部分）。
>
> 升级方式：用本仓库覆盖 `custom_nodes` 里的同名文件夹后重启，不需要先卸载旧版。
> 详细改动见下方 **v3.1.0** 更新日志。

本项目是基于 [AIGODLIKE-ComfyUI-Translation](https://github.com/AIGODLIKE/AIGODLIKE-ComfyUI-Translation) 的衍生分支，在此特别感谢原项目的开发者们对开源社区的杰出贡献。正是因为有人愿意成为先驱者，后人才能继承前人的薪火.

\==视频展示==

<https://github.com/user-attachments/assets/1ec662ba-da6c-4712-8be7-61168b08940e>

## 项目背景

由于原作者已停止更新，而 ComfyUI 原生对中文的支持进展缓慢，特别是对自定义节点的适配，因此我决定继续维护这个项目，使其能够：

1. 兼容支持 ComfyUI 的最新版本
2. 添加新的翻译内容
3. 完善翻译体验

## 功能特点

- 更强大的简体中文汉化，暂不考虑多语言支持，个人精力有限只支持翻译中文。
- 在官方汉化的基础上嵌入额外的翻译内容，实现更完整的翻译。
- 在界面上提供便捷的翻译功能切换按钮，可以选择使用附加翻译和官方实现
  （使用官方实现的意思就是关闭插件，翻译插件就不生效了，使用官方已经翻译的中文内容）
  - **v3 起已改为跟随 ComfyUI 语言设置，不再有悬浮开关**（设置 → 语言 → 中文）
- 支持大部分常用自定义节点的翻译

## 使用建议

本项目主要面向使用 ComfyUI 最新版本的用户：

- 与老版本翻译插件 AIGODLIKE/AIGODLIKE-ComfyUI-Translation 并不兼容，安装前请先卸载它
- **v3 升级方式**：直接用本仓库覆盖 `custom_nodes` 里的同名文件夹 `ComfyUI-DD-Translation`，重启即可，不需要先卸载旧版本
- 为确保最佳兼容性，项目将优先支持最新版 ComfyUI
- 可能会放弃对旧版本的兼容支持，推荐使用以下内容：
- 【最新版本整合包（至少半年内）或官方桌面版】
- 【整合包用户推荐使用谷歌或Edge浏览器确保最佳前端兼容性】

  如果有翻译问题请在这里反馈：[点击反馈翻译问题](https://github.com/Dontdrunk/ComfyUI-DD-Translation/issues/94)

## 安装方法

方法1:

1. 下载本项目
2. 将整个文件夹放入 ComfyUI 的 `custom_nodes` 目录下
3. 重启 ComfyUI

方法2（推荐）：
直接在Manager或启动器中使用git进行安装

`https://github.com/Dontdrunk/ComfyUI-DD-Translation.git`

方法3（推荐）：
直接在Manager中搜索插件名称安装

> **安装或更新后必须重启 ComfyUI**：翻译走官方 `locales` 机制，服务端有缓存（lru_cache），只刷新浏览器页面不会生效。

## 贡献者名单

感谢以下贡献者对于ComfyUI中文开源生态的支持

- msola-ht丶是小张啊丶alinuo666丶猪的飞行梦丶ZXSZS丶tanglangxia丶AIGCZero丶Artistjjw丶henrylaobai丶FanXiangTM丶xuchenxu168丶LovedeHua丶uiiiaiii丶fuxijun-max丶ANe5s丶cnolka 丶XXXAbit7 丶Yifo98丶xiaobai9009丶Aifredd丶junesnowing-source 

## 更新日志

### v3.1.0 (2026-11-11) 【重构：改用官方 locales，替代旧实现】

**实现方式**

- 节点 / 分类 / 设置面板改为官方 locales：`locales/zh/{nodeDefs,main,settings}.json`
  - 节点 4253 个类；槽位 1209（本机真机对齐）+ 25263（未安装插件按旧格式映射）；输出名 398；tooltip 708
  - 下拉选项 150 个槽位 / 671 条
  - 节点分类 804 条、设置分类 57 条、设置项 42 个
- 移除旧实现的全部前端钩子（`js/main.js`、`MenuTranslate.js`、`ui.js`、`utils.js`）、
  `/agl/get_translation` 等 3 个自定义路由、`config.json`、`web/extensions` junction/copytree、
  悬浮翻译开关、`翻译生成器.html`
- 仅保留三处 JS（官方机制覆盖不到的部分）：`combo_labels.js`（下拉值）、
  `ui_zh.js`（rgthree / Manager 自绘面板与核心对话框词典）、`options_zh.js`（生成数据）

**新增作用域**

- rgthree 设置弹窗（`.rgthree-dialog`）：标签 / 描述 / 下拉值 / 底部按钮，共 53 条
- rgthree 顶栏菜单（`.rgthree-menu`）
- ComfyUI Manager 主面板（`#cm-manager-dialog`）38 条
- 自定义节点管理器（`#cn-manager-dialog`）、模型管理器（`#cmm-manager-dialog`）、
  节点使用分析（`.nu-manager`）、快照管理（`#snapshot-manager-dialog`）
- 核心对话框：包装 `app.extensionManager.dialog` 的 prompt / confirm / alert 与 `window.confirm` 文案
- 动态文案规则：N 个自定义节点 / N 个外部模型 / N 个已安装包 / 各类加载中提示 / 错误前缀
- 语言切换实时同步：监听官方 `Comfy.Locale.change`，切英文时还原被替换的文本与属性

**迁移与工具**

- 旧翻译源数据迁入 `source/zh-CN/`（Nodes 253 + Categories 50 + Menus 48），未丢失任何词条
- 新增 `scripts/build_locales.py`（源数据 → 官方 locales）、`manual_zh.json`、`manual_settings_zh.json`
- 新增 `rebuild.bat` / `rebuild.sh`，一键重建 `locales/zh/*.json` 与 `js/options_zh.js`
- 新增 `.gitignore`：排除 `inventory/`（本机快照）、`__pycache__`、日志与临时文件

### v3.0.0a2 (2026-11-11)

- 新增节点下拉框选项值的显示补丁（官方 `nodeDefs.options` 字段前端暂未读取）
- 修正 V3 API 节点的信息抓取方式（`GET_NODE_INFO_V1`），DLSS 三个节点补全至 18 个槽位

### v3.0.0a1 (2026-11-11)

- 官方 locales 原型：20 个节点 + 119 条分类，验证 `/api/i18n` 加载链路

> 更早的 v1.x – v2.x 记录见 [CHANGELOG.md](./CHANGELOG.md)。
