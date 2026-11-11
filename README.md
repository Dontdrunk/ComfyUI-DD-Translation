ComfyUI 中文翻译插件

> **v3.1.0 更新：更稳定、更完整的中文翻译**
>
> 新版换成了 ComfyUI 自带的中文机制。装好之后，节点名称、输入输出、下拉选项、分类、
> 设置面板，以及 rgthree-comfy、ComfyUI 管理器这些扩展面板都会显示中文。
> ComfyUI 以后升级，翻译不容易再被搞挂。
>
> 以前所有翻译内容都保留，没有丢；另外补上了以前没翻的设置项和插件面板。
> 想用中文就选中文、想看英文就切英文，直接在 ComfyUI 设置里换语言即可，不用再点悬浮开关。
>
> 升级方法：用新版本替换掉旧的插件文件夹，重启 ComfyUI 就行，不需要先卸载。

本项目是基于 [AIGODLIKE-ComfyUI-Translation](https://github.com/AIGODLIKE/AIGODLIKE-ComfyUI-Translation) 的衍生分支，在此特别感谢原项目的开发者们对开源社区的杰出贡献。正是因为有人愿意成为先驱者，后人才能继承前人的薪火.

\==视频展示==

<https://github.com/user-attachments/assets/1ec662ba-da6c-4712-8be7-61168b08940e>

## 项目背景

由于原作者已停止更新，而 ComfyUI 原生对中文的支持进展缓慢，特别是对自定义节点的适配，因此我决定继续维护这个项目，使其能够：

1. 兼容支持 ComfyUI 的最新版本
2. 添加新的翻译内容
3. 完善翻译体验

## 功能特点

- 更完整的简体中文：节点名称、输入输出、下拉选项、节点分类、设置面板，以及常用插件的面板都会显示中文。
- 在官方中文的基础上补上官方没翻或翻得不够的地方，比只用官方中文更完整。
- v3 起跟随 ComfyUI 的语言设置：选中文就是中文，选英文就恢复英文，不再有悬浮开关。
- 目前只做简体中文，暂不考虑其他语言。

## 使用建议

本项目主要面向使用 ComfyUI 最新版本的用户：

- 与老版本翻译插件 AIGODLIKE/AIGODLIKE-ComfyUI-Translation 并不兼容，安装前请先卸载它
- **v3 升级方式**：把旧的插件文件夹换成新版本，重启 ComfyUI 即可，不需要先卸载
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

> **安装或更新后请重启 ComfyUI**：只刷新浏览器页面不会生效，必须重启一次。

## 贡献者名单

感谢以下贡献者对于ComfyUI中文开源生态的支持

- msola-ht丶是小张啊丶alinuo666丶猪的飞行梦丶ZXSZS丶tanglangxia丶AIGCZero丶Artistjjw丶henrylaobai丶FanXiangTM丶xuchenxu168丶LovedeHua丶uiiiaiii丶fuxijun-max丶ANe5s丶cnolka 丶XXXAbit7 丶Yifo98丶xiaobai9009丶Aifredd丶junesnowing-source 

## 更新日志

### v3.1.0 (2026-11-11) 【更好用的中文翻译】

- **更稳定**：翻译改成跟随 ComfyUI 自带的中文机制，ComfyUI 以后升级不需要再跟着改代码，也不容易因为界面改版突然失效。
- **更完整**：
  - 节点名称、输入输出、下拉选项、节点分类都是中文
  - 设置面板里的每一项和说明都是中文
  - rgthree-comfy 的设置窗口、ComfyUI 管理器的面板和各个列表页也都是中文
  - 覆盖 4000 多个节点、150 多处下拉选项、40 多个设置项
- **更好用**：不用再点悬浮的翻译开关，直接在 ComfyUI 设置里切换「中文 / English」。
- **升级不丢东西**：以前所有翻译内容都保留，另外补上了以前没翻的设置项和插件面板。
- **怎么升级**：用新版本替换掉旧的插件文件夹，重启 ComfyUI；之前装过其他中文翻译插件的，先把它删掉，避免两个同时生效。

> 更早的 v1.x – v2.x 记录见 [CHANGELOG.md](./CHANGELOG.md)。
