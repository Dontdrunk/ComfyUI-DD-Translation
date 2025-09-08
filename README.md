ComfyUI 中文翻译插件

本项目是基于 [AIGODLIKE-ComfyUI-Translation](https://github.com/AIGODLIKE/AIGODLIKE-ComfyUI-Translation) 的衍生分支，在此特别感谢原项目的开发者们对开源社区的杰出贡献。正是因为有人愿意成为先驱者，后人才能继承前人的薪火.

==视频展示==

https://github.com/user-attachments/assets/1ec662ba-da6c-4712-8be7-61168b08940e

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
- 支持大部分常用自定义节点的翻译

## 使用建议

本项目主要面向使用 ComfyUI 最新版本的用户：
- 与老版本翻译插件AIGODLIKE/AIGODLIKE-ComfyUI-Translation并不兼容，在安装新翻译插件前请先卸载老插件
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

`https://github.com/1761696257/ComfyUI-DD-Translation.git`

方法3（推荐）：
直接在Manager中搜索插件名称安装

## 贡献者名单
感谢以下贡献者对于ComfyUI中文开源生态的支持

- msola-ht丶是小张啊丶alinuo666丶猪的飞行梦丶ZXSZS丶tanglangxia丶AIGCZero丶Artistjjw丶henrylaobai丶FanXiangTM

## 更新日志
### v1.9.12(2025-9-08) 
- 合并贡献者（FanXiangTM）提交的翻译涉及以下插件：
- ComfyUI_Prompt-All-In-One插件的翻译

### v1.9.11(2025-9-05) 
- 合并贡献者（FanXiangTM）提交的翻译涉及以下插件：
- ComfyUI_MegaTTS3丶ComfyUI-SeedVR2_VideoUpscaler丶Comfyui-HYPIR丶VibeVoice-ComfyUI插件的翻译

### v1.9.10(2025-8-29) 
- 合并贡献者（FanXiangTM）提交的翻译涉及以下插件：
- 众多界面翻译补充
- ComfyUI-EdgeTTS 丶ComfyUI_Seed-VC丶Comfyui-Memory_Cleanup插件的翻译

### v1.9.9 (2025-8-23) 
- 合并贡献者（FanXiangTM）提交的翻译涉及以下插件：
- Comfy设置菜单及管理器菜单部分翻译
-  ComfyUI_NTCosyVoice和ComfyUI_IndexTT插件翻译

### v1.9.8 (2025-8-19) 
- 合并贡献者（猪的飞行梦）提交的翻译涉及以下插件：
- 官方工作流的模板翻译补充
- 合并贡献者（FanXiangTM ）提交的翻译涉及以下插件：
- ComfyUI-Manager和rgthree-comfy插件翻译补充

### v1.9.7 (2025-8-04) 
- 合并贡献者（猪的飞行梦）提交的翻译涉及以下插件：
- 官方工作流的模板翻译
- ComfyUI_StoryDiffusion丶civitai_comfy_nodes插件的完整翻译

### v1.9.6 (2025-7-29) 
- 合并贡献者（猪的飞行梦）提交的翻译涉及以下插件
- ComfyUI-MimicMotionWrapper节点的完整翻译
- rgthree-comfy丶BizyAir插件的翻译补全优化
- 完善部分分类翻译

### v1.9.5 (2025-7-26) 
- 合并贡献者（henrylaobai）提交的翻译涉及以下插件：
- ComfyUI-RBG-ImageStitchPlus插件的完整翻译

### v1.9.4 (2025-7-16) 
- 合并贡献者（是小张啊）提交的翻译涉及以下插件：
- ComfyUI-LBMWrapper丶wavespeed
- 合并贡献者（AIGCZero）提交的翻译涉及以下插件：
- ComfyUI-MagCache丶ComfyUI-WanVideoWrapper丶dio-separation-nodes-comfyui以及部分下拉菜单
- 合并贡献者（Artistjjw）提交的翻译涉及以下插件：
- ComfyUI-EsesImageEffectBloom

### v1.9.3 (2025-7-09) 
- 调整部分节点翻译
- 合并贡献者（AIGCZero）提交的ComfyUI_AdvancedRefluxControl插件的完整翻译

### v1.9.2 (2025-7-08) 
- 补全ComfyUI_Custom_Nodes_AlekPe插件的面板翻译
- 补全comfy_mtb插件的面板翻译

### v1.9.1 (2025-7-07) 
- 合并贡献者（AIGCZero）提交的ComfyUI_Custom_Nodes_AlekPet插件的部分翻译补充
- 一个ComfyUI_LayerStyle插件输出接口翻译错误的临时性解决方案。点击链接查看https://github.com/Dontdrunk/ComfyUI-DD-Translation/issues/76
  
### v1.9.0 (2025-7-06) 【功能性重构】
- 删除了所有残留的浏览器翻译缓存机制，现在插件的所有通信完全通过后端API进行动态交互
- 在根目录添加了配置json文件，方便云端用户进行翻译开关的控制

### v1.8.14 (2025-7-05) 
- 合并贡献者（是小张啊）提交的comfyui_face_parsing插件翻译

### v1.8.13 (2025-7-04) 
- 合并贡献者（是小张啊）提交的插件翻译包含：
- ComfyUI-utils-nodes丶comfyui_facetools丶Comfyui_LG_Tools丶Comfyui_Object_Detect_QWen_VL
- 以上插件的完整翻译内容

- 添加comfyui-ollama与ComfyUI_MatAnyone_Kytra插件的完整翻译

### v1.8.12 (2025-7-03) 
添加ComfyUI-PuLID-Flux-Enhanced插件的完整翻译

### v1.8.11 (2025-7-02) 
- 合并贡献者（猪的飞行梦）提交的插件翻译包含：
- ComfyUI-Fluxtapoz插件的完整翻译与x-flux-comfyui的翻译补全
- 删除了RMBG和LayerStyle的翻译文件，因为这两个插件自带原生翻译，里面90%的内容都已经汉化，剩下一些下拉项没有翻译的后续单独补充即可。

### v1.8.10 (2025-6-30) 
- 合并贡献者（猪的飞行梦）提交的插件翻译包含：

- ComfyUI-VideoHelperSuite丶comfyui-reactor-node丶comfyui-mixlab-nodes丶ComfyUI-LivePortraitKJ丶ComfyUI-InstantID丶ComfyUI-Inpaint-CropAndStitch
- 以上插件的翻译补全和翻译重构

- was-node-suite-comfyui丶CosyVoice-ComfyUI丶ComfyUI-YOLOWorld丶ComfyUI-YOLO丶ComfyUI-SparkTTS丶ComfyUI-Sonic丶ComfyUI-RyanOnTheInside丶ComfyUI-RMBG丶comfyui-mxtoolkit丶ComfyUI-InstantIR-Wrapper丶comfyui-fk-server丶ComfyUI-FFmpeg丶ComfyUI-essentials
- 以上插件的完整翻译内容

### v1.8.9 (2025-6-27) 
- 合并贡献者（猪的飞行梦）提交的插件翻译包含：
- AlekPet nodes丶 comfy_mtb丶Comfyui_ControlNet_aux丶ComfyUl_IPAdapter_plus丶ComfyUI-CogVideoXWrapper丶ComfyUI-Easy-Use丶ComfyUI-Advanced-ControlNet
- 以上插件的翻译补全和翻译重构

- AuraSR-ComfyUI丶comfy-image-saver丶ComfyUI_GraftingRayman丶ComfyUI_KokoroTTS_MW丶ComfyUI-CatVTON-Wrapper丶ComfyUI-DiffBIR丶ComfyUI-PuLID-Flux-GR
- 以上插件的完整翻译内容

- 合并贡献者（tanglangxia）提交的ComfyUI-Advanced-ControlNet插件翻译补全

- 将两个贡献者提交的ComfyUI-Advanced-ControlNet插件翻译文件合并成一个，并调整部分术语

- 添加ComfyUI-GIMM-VFI插件的完整翻译。

### v1.8.8 (2025-6-25) 
- 合并贡献者（是小张啊）提交的插件翻译：
- ComfyUI-Fill-Nodes丶ComfyUI-TTP-Toolset插件的完整翻译
- ComfyUI-Inpaint-CropAndStitch丶ComfyUI-BrushNet丶ComfyUl-Align补全以上节点翻译
- 对部分右键菜单栏中的原生节点翻译和DOM内部翻译进行补全

### v1.8.7 (2025-6-24) 
- 合并贡献者（ZXSZS）提交的两个插件翻译，包含以下插件的完整翻译内容：
- ComfyUI-PMRF丶ComfyUI-Lora-Manager

- 修正了一部分不太合适的翻译内容.
- 补全了因为删除原生节点翻译导致的节点拖拽翻译缺失的问题
- 添加了ComfyUl-wanBlockswap插件的完整翻译
- 补全ComfyUI-WanVideoWrapper插件的部分翻译内容

### v1.8.6 (2025-6-23) 
- 合并贡献者（猪的飞行梦）提交的一系列节点翻译，包含以下插件的完整翻译内容：
- ComfyUI-HunyuanVideoWrapper丶ComfyUI-Hunyuan3DWrapper丶 ComfyUI-AnimateDiff-Evolved（补全）丶BizyAir
- 对部分类别翻译进行补全

### v1.8.5 (2025-6-21) 
- 合并贡献者(是小张啊)提交的KJNodes翻译补全
- 调整了部分Nunchaku节点的翻译

### v1.8.4 (2025-6-20) 
- 合并贡献者(是小张啊)提交的官方原生节点分类，删除了原来的官方翻译文件（因为太多重复翻译，很多内容官方已经有中文实现）
- 合并贡献者（alinuo666）提交的ComfyUI-VideoUpscale_WithModel插件的翻译

### v1.8.3 (2025-6-19) 
- 翻译生成器添加新功能，现在可以导入Json翻译文件直接进行编辑了

### v1.8.2 (2025-6-19) 
- 合并贡献者(是小张啊)提交的RG插件补全翻译
- 合并贡献者(是小张啊)提交的teacache与comfyui_ttp_toolset插件的完整翻译
- 补全和修正部分插件的翻译

### v1.8.1 (2025-6-18) 
- 合并贡献者(是小张啊)提交的一系列节点翻译，包含以下插件的完整翻译内容：
- 【ComfyUI-nunchaku丶ComfyUI-MingNodes丶ComfyUI-Align】
- 补全MTB和UE最新版本的一些翻译

### v1.8.0 (2025-6-17) 【兼容性修复】
- 修复了"附加翻译"模式与 ComfyUI 官方原生翻译的兼容性问题，确保真正的增量补充
- 实现正确的翻译优先级：插件附加翻译 > 节点原生翻译 > 原文
- 修复了附加翻译错误覆盖官方已翻译内容的 BUG，保护官方翻译不被替换
- 优化了节点标题检测逻辑，增加中文字符识别和翻译状态判断
- 重构了核心翻译应用方法，移除强制重置逻辑，改为智能增量补充
- 修复了 Vue 组件节点名称翻译的覆盖问题，避免与官方翻译冲突

### v1.7.0 (2025-6-16) 【功能性修复】
- 解决了在附加翻译模式下，用户手动修改节点标题后重新加载工作流时标题被重置的问题。
- 重新将Label (rgthree)节点翻译为标签，现在它能在附加模式下正常工作了。
- 修复了翻译生成器工具的小BUG
- 添加ComfyUI-Redux-Prompt插件的节点翻译

### v1.6.0 (2025-6-15)
- 由于大部分翻译者其实并没有什么技术基础，原有的翻译贡献指南对于零代码基础的人来说可能太过复杂，所以我删除了它，并制作了一个小工具
- 这个小工具可以让不懂任何技术的人能轻松创建翻译文件，极大降低了贡献翻译的门槛，并简化了翻译贡献流程
- 小工具在插件的根目录中，打开即可使用

- 【这两天会发布小工具的演示教程，请关注我的B站账号】

### v1.5.1 (2025-5-27)
- 更新ComfyUI-WanVideoWrapper KJ系列插件的完整翻译

### v1.5.0 (2025-5-21)
- 删除了ComfyUI-Manager的重启按钮的翻译，因为它会导致一直请求UI更新，与ComfyUI-Manager抢夺UI更新权限，现在修复了这个问题。
- 修复了模型侧边栏的一些显示BUG

### v1.4.3 (2025-5-20)
- 审查并合并 msola-ht贡献者给ComfyUI_LayerStyle_Advance 插件>Joy Beta系列节点的翻译
- 添加ComfyUI-GGUF完整翻译
- 进一步优化界面翻译
- 完善翻译贡献文档

### v1.4.2 (2025-5-12)
- 重构插件cg-use-everywhere 6.1最新版本的翻译内容

### v1.4.1 (2025-4-28)
- 新增 Comfyui-LG_GroupExecutor 插件的节点翻译补充，包括"🎈图像发送器"、"🎈图像接收器"、"🎈列表图像分割器"、"🎈列表蒙版分割器"、"🎈列表图像重复器"、"🎈列表蒙版重复器"和"🎈累积预览"等节点
- 修正了部分节点标题匹配问题，确保翻译正确应用到界面

### v1.4.0 (2025-4-27)
- 完善MTB面板的翻译覆盖率，修复部分切换选项卡时翻译丢失的问题

### v1.3.1 (2025-4-26)
- 移除了RG节点标签节点Label (rgthree)的翻译，避免功能异常和重复刷新问题
- 注意：标签节点现在将显示原始英文名称，用户需要通过搜索"Label"来找到此节点
- 补充完善 CG-Use-Everywhere 最新节点的翻译
- 新增 Comfyui-LG_GroupExecutor 插件的完整翻译，包括"🎈组执行器"、"🎈单次组执行器"、"🎈组重复执行器"和"🎈组发送器"四个节点

### v1.3.0 (2025-4-25) 【重大更新！！完全重构插件，性能提升巨大】
- 补充完善ComfyUI-Manager管理器界面翻译，包括筛选选项和表格标题
- 新增ComfyUI-Detail-Daemon插件的完整翻译，包括"细节魔灵图表Sigma值"、"细节魔灵采样器"、"倍增Sigma值"和"谎言Sigma采样器"四个节点
- 新增PixelOE插件的完整翻译，包括"预调整尺寸"、"轮廓扩展"和"像素轮廓增强"三个节点
- 完全重构代码结构，引入模块化设计，显著提高执行效率
- 新增utils.js工具模块，将通用功能抽离，减少代码重复
- 将XMLHttpRequest同步请求替换为异步Fetch API，避免主线程阻塞
- 优化MutationObserver使用方式，减少观察者数量，降低内存占用
- 重写DOM处理逻辑，减少不必要的重复处理
- 【提供了详细的开发文档，便于社区贡献新的翻译内容】

### v1.2.0 (2025-4-24)
- 删除了ComfyUI-Easy-Use插件的所有类别和面板翻译，转为使用官方原生中文实现，并补充了ComfyUI-Easy-Use插件节点的额外翻译内容
- 删除了除简体中文以外的所有语言支持，简化插件结构
- 移除了设置面板中的语言选择选项，只保留顶部的语言切换按钮，使用更加直观
- 修复了ComfyUI-VideoHelperSuite的部分节点翻译问题，补充了VideoHelperSuite插件中视频加载和保存节点的额外翻译内容
- 完全重构翻译切换功能，改为"附加翻译"和"官方实现"两种模式切换

### v1.1.0 (2025-4-23)
- 删除大部分过时翻译内容，重构最新节点的翻译内容
- 对 KJNodes 节点进行补充修正，添加"中键默认添加节点"和"设定设置/获取节点菜单"的翻译
- 全面重构 rgthree-comfy 节点翻译，支持最新版本界面
- 为 Crystools 监视器界面添加缺失的翻译选项
- 重构 ComfyUI-Custom-Scripts 插件翻译，添加带有 🐍 符号的新选项翻译，补充工具提示和说明文本的翻译
- 修复了右键菜单中部分翻译失效的BUG，并添加了更多右键菜单项的翻译

### v1.0.0 (2025-4-22)
- 修复了最新版本 ComfyUI 的一些兼容性问题
- 修复 MTB Crystools VHS 视频节点的翻译问题
- 修复了设置界面中的部分错位问题
- 修复语言切换按钮的显示 BUG
