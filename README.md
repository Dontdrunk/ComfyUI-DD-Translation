# ComfyUI 中文翻译插件

ComfyUI 的简体中文翻译插件，让 ComfyUI 界面和常用插件尽量显示中文。装好后跟随 ComfyUI 的语言设置生效：在设置里选「中文」就是中文，选「English」就恢复英文。

本项目基于 [AIGODLIKE-ComfyUI-Translation](https://github.com/AIGODLIKE/AIGODLIKE-ComfyUI-Translation) 衍生开发，在此特别感谢原项目的开发者们对开源社区的杰出贡献。正是因为有人愿意成为先驱者，后人才能继承前人的薪火。

## 视频展示

<video src="https://cdn.jsdelivr.net/gh/Dontdrunk/ComfyUI-DD-Translation@main/assets/demo.mp4" controls width="100%"></video>

> 如果视频无法播放，可以 [直接打开视频](https://github.com/Dontdrunk/ComfyUI-DD-Translation/blob/main/assets/demo.mp4)。

## 项目背景

由于原作者已停止更新，而 ComfyUI 原生对中文的支持进展缓慢，特别是对自定义节点的适配，因此我决定继续维护这个项目，使其能够：

1. 兼容支持 ComfyUI 的最新版本
2. 添加新的翻译内容
3. 完善翻译体验

## 功能特点

- 更完整的简体中文：节点名称、输入输出、下拉选项、节点分类、设置面板，以及常用插件的面板都会显示中文。
- 右键菜单也是中文：节点 / 画布的右键菜单里，rgthree、VideoHelperSuite、Impact Pack、KJNodes 等插件写死的英文菜单项也会翻译。
- 在官方中文的基础上补上官方没翻或翻得不够的地方，比只用官方中文更完整。
- v3 起跟随 ComfyUI 的语言设置：选中文就是中文，选英文就恢复英文，不再有悬浮开关。
- 目前只做简体中文，暂不考虑其他语言。

## 为什么改用官方中文机制

旧版本是直接改界面上的文字来翻译。ComfyUI 2.0 的新节点系统（Nodes 2.0）和很多插件都依赖界面原本的结构，
文字被外部改掉之后，容易出现按钮失灵、下拉框错乱、节点功能异常等问题——在旧方案里，这类问题基本无解。

改成 ComfyUI 自带的中文机制后，等于由官方方式接管翻译，兼容性最好，也不会破坏插件本身的功能。
所以这不是随便升级，而是目前最稳妥、也是唯一能长期跟得上 ComfyUI 更新的做法。

右键菜单是唯一的例外：里面的文案由 rgthree、VideoHelperSuite 等插件直接写死英文，
没有走 ComfyUI 的翻译接口。为了让这些菜单也显示中文，插件只在菜单弹出时替换菜单项文字，
不碰节点结构、参数和连线。

## 使用建议

建议使用较新版本的 ComfyUI（近半年内的版本即可）。

如果发现有哪里没翻译、或者翻译得不对，欢迎到 [Issues](https://github.com/Dontdrunk/ComfyUI-DD-Translation/issues/94) 反馈——旧版本转换过来的内容难免有遗漏，我会尽快补上。

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

> **安装或更新后请重启 ComfyUI**：只刷新浏览器页面不会生效，必须重启一次。

## 开源协议

本项目以 **GPL-3.0-only**（GNU General Public License v3.0）发布，完整协议见 [LICENSE](./LICENSE)。

你可以自由使用、修改、分发本项目，也可以商用；但**基于本项目代码开发的衍生插件必须同样以 GPL-3.0 开源**，分发时需要提供完整源代码，不能改成闭源插件。

Copyright (C) 2025-2026 Dontdrunk

> 翻译数据来自 AIGODLIKE-ComfyUI-Translation 及各位贡献者，相关权利归原作者和贡献者所有。

## 贡献者名单

感谢以下贡献者对于ComfyUI中文开源生态的支持

- msola-ht丶是小张啊丶alinuo666丶猪的飞行梦丶ZXSZS丶tanglangxia丶AIGCZero丶Artistjjw丶henrylaobai丶FanXiangTM丶xuchenxu168丶LovedeHua丶uiiiaiii丶fuxijun-max丶ANe5s丶cnolka 丶XXXAbit7 丶Yifo98丶xiaobai9009丶Aifredd丶junesnowing-source 

## 更新日志

### v3.2.0 (2026-11-11) 【右键菜单中文化】

- **右键菜单翻译**：节点右键菜单、画布右键菜单里的插件英文菜单项现在会显示中文，包括 rgthree 的「队列所选节点」、KJNodes 的 Set/Get、VideoHelperSuite 的预览控制、Impact Pack 的 SAM 检测等。
- **沿用旧插件的做法**：这些文案在插件 JS 里写死，官方 locales 覆盖不到，所以在菜单弹出时做菜单级文字替换；只替换整段匹配的菜单项，不影响功能。
- **词典来源**：直接复用 `source/zh-CN/Menus` 里旧插件的全部菜单译文（约 5700 条），并补了少量菜单专用译文。
- **切换语言照常生效**：选中文显示中文，选 English 恢复英文。
- **开源协议**：明确为 GPL-3.0-only，基于本项目代码的衍生插件必须同样开源。

### v3.1.0 (2026-11-11) 【更好用的中文翻译】

- **更稳定**：翻译改成跟随 ComfyUI 自带的中文机制，兼容新的 Nodes 2.0 节点系统和更多插件；不再去改界面上的文字，插件功能不容易被影响，ComfyUI 以后升级也不用跟着改代码。
- **更完整**：
  - 节点名称、输入输出、下拉选项、节点分类都是中文
  - 设置面板里的每一项和说明都是中文
  - rgthree-comfy 的设置窗口、ComfyUI 管理器的面板和各个列表页也都是中文
  - 覆盖 4000 多个节点、150 多处下拉选项、40 多个设置项
- **更好用**：不用再点悬浮的翻译开关，直接在 ComfyUI 设置里切换「中文 / English」。
- **升级不丢东西**：以前所有翻译内容都保留，另外补上了以前没翻的设置项和插件面板。
- **怎么升级**：用新版本替换掉旧的插件文件夹，重启 ComfyUI；之前装过其他中文翻译插件的，先把它删掉，避免两个同时生效。

> 更早的 v1.x – v2.x 记录见 [CHANGELOG.md](./CHANGELOG.md)。
