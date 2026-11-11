import { app } from "../../../scripts/app.js";

/**
 * 这两个面板不走 ComfyUI 的 i18n（settings.<id> / locales），
 * 文案是插件 JS 里硬编码的，只能做作用域内的文本替换。
 *
 * - rgthree-comfy 设置弹窗：.rgthree-dialog
 * - ComfyUI Manager 面板：#cm-manager-dialog
 *
 * 只替换“整段文本完全等于词典键”的文本节点，不做子串替换；
 * 切到英文时会把原文还原。
 */

const RGTHREE_ZH = {
  "Features": "功能",
  "Prompt Progress Bar": "提示进度条",
  "Shows a minimal progress bar for nodes and steps at the top of the app.": "在应用顶部为节点和步骤显示一个迷你进度条。",
  "Height of the bar": "进度条高度",
  "Position at top or bottom of window": "位置（窗口顶部/底部）",
  "top": "顶部",
  "bottom": "底部",
  "Import Individual Nodes Widgets": "导入单个节点组件",
  "Dragging & Dropping a similar image/JSON workflow onto (most) current workflow nodeswill allow you to import that workflow's node's widgets when it has the same id and type. This is useful when you have several images and you'd like to import just one part of a previous iteration, like a seed, or prompt.": "把相似的图片/JSON 工作流拖拽到（大多数）当前工作流节点上时，如果节点 id 和类型一致，就会导入那个工作流对应节点的组件。适合你有好几张图、只想导入其中某一次迭代的一部分（比如种子或提示词）时使用。",
  "Menus": "菜单",
  "Enable Top Bar Menu": "启用顶栏菜单",
  "Have quick access from ComfyUI's new top bar to rgthree-comfy bookmarks, settings (and more to come).": "在 ComfyUI 新版顶栏快速访问 rgthree-comfy 的书签、设置（后续还会加更多）。",
  "Show 'Queue Selected Output Nodes'": "显示「排队所选输出节点」",
  "Will show a menu item in the right-click context menus to queue (only) the selected output nodes.": "在右键菜单中增加一项，用于（仅）排队所选的输出节点。",
  "Auto Nest Subdirectories in Menus": "菜单中自动嵌套子目录",
  "When a large, flat list of values contain sub-directories, auto nest them. (Like, for a large list of checkpoints).": "当平铺列表包含子目录时自动嵌套（例如很长的 checkpoint 列表）。",
  "Number of items needed to trigger nesting.": "触发嵌套所需的条目数。",
  "Show Bookmarks in context menu": "在右键菜单中显示书签",
  "Will list bookmarks in the rgthree-comfy right-click context menu.": "在 rgthree-comfy 右键菜单中列出书签。",
  "Groups": "分组",
  "Show fast toggles in Group Headers": "在组标题上显示快捷开关",
  "Show quick toggles in Groups' Headers to quickly mute, bypass or queue.": "在组标题上显示快捷开关，用于快速禁用、旁路或排队。",
  "Which toggles to show.": "要显示哪些开关。",
  "queue": "排队",
  "bypass": "旁路",
  "mute": "禁用",
  "When to show them.": "何时显示。",
  "on hover": "悬停时",
  "always": "总是",
  "Power Lora Loader": "LoRA 加载器",
  "Show info badge/button": "显示信息徽标/按钮",
  "Show an info badge/button on each lora row to signal and open lora details.": "在每一行 LoRA 上显示信息徽标/按钮，用于提示并打开 LoRA 详情。",
  "Autoplay video previews in info dialog.": "信息弹窗中自动播放视频预览",
  "In the info dialog, autoplay video preview images.": "在信息弹窗中自动播放视频预览图。",
  "Advanced": "高级",
  "Detect Corrupt Workflows": "检测损坏的工作流",
  "Will show a message at the top of the screen when loading a workflow that has corrupt linking data.": "加载连线数据损坏的工作流时，在屏幕顶部显示提示。",
  "Log level for browser dev console.": "浏览器控制台日志级别",
  "Further down the list, the more verbose logs to the console will be. For instance, selecting 'IMPORTANT' means only important message will be logged to the browser console, while selecting 'WARN' will log all messages at or higher than WARN, including 'ERROR' and 'IMPORTANT' etc.": "越往下日志越详细。例如选「IMPORTANT」只把重要信息记录到浏览器控制台；选「WARN」则记录 WARN 及以上（含 ERROR、IMPORTANT 等）。",
  "IMPORTANT": "重要",
  "ERROR": "错误",
  "WARN": "警告",
  "INFO": "信息",
  "DEBUG": "调试",
  "DEV": "开发",
  "Allow other extensions to call nodeCreated on rgthree-nodes.": "允许其他扩展对 rgthree 节点调用 nodeCreated",
  "Do not disable unless you are having trouble (and then file an issue at rgthree-comfy).Prior to Apr 2024 it was not possible for other extensions to invoke their nodeCreated event on some rgthree-comfy nodes. Now it's possible and this option is only here in for easy if something is wrong.": "除非遇到问题，否则不要关闭（遇到问题请到 rgthree-comfy 反馈）。2024 年 4 月之前，其他扩展无法在某些 rgthree-comfy 节点上触发 nodeCreated 事件；现在可以了，这个选项只是出问题时方便回退。",
  "Save": "保存",
  "Close": "关闭",
  "Settings (rgthree-comfy)": "设置（rgthree-comfy）",
  "Star on Github": "在 GitHub 上点星"
};

const MANAGER_ZH = {
  "DB": "数据库",
  "Channel": "频道",
  "Channel (1day cache)": "频道（1 天缓存）",
  "Preview method": "预览方式",
  "Loading...": "加载中...",
  "Share": "分享",
  "None": "无",
  "Component": "组件",
  "Use workflow version": "使用工作流版本",
  "Update": "更新",
  "ComfyUI Stable Version": "ComfyUI 稳定版",
  "EXPERIMENTAL": "实验功能",
  "Snapshot Manager": "快照管理",
  "Install PIP packages": "安装 PIP 包",
  "Custom Nodes Manager": "自定义节点管理器",
  "Install Missing Custom Nodes": "安装缺失的自定义节点",
  "Custom Nodes In Workflow": "工作流中的自定义节点",
  "Node Usage Analyzer": "节点使用分析",
  "Model Manager": "模型管理器",
  "Install via Git URL": "通过 Git URL 安装",
  "Update All": "全部更新",
  "Update All Custom Nodes": "更新全部自定义节点",
  "Update ComfyUI": "更新 ComfyUI",
  "Updating ComfyUI...": "正在更新 ComfyUI...",
  "Updating...": "正在更新...",
  "Switch ComfyUI": "切换 ComfyUI",
  "Restart": "重启",
  "Stop": "停止",
  "Community Manual": "社区手册",
  "Workflow Gallery": "工作流画廊",
  "Nodes Info": "节点信息",
  "Select": "选择",
  "Select Version": "选择版本",
  "Cancel": "取消",
  "Close": "关闭",
  "Save": "保存",
  "Filter": "过滤",
  "IMPORT FAILED ↗": "导入失败 ↗",
  "Title": "标题",
  "Version": "版本",
  "Action": "操作",
  "Nodes": "节点",
  "Description": "描述",
  "Author": "作者",
  "Last Update": "最后更新",
  "Alternatives": "替代",
  "Alternatives of A1111": "A1111 的替代",
  "Search": "搜索",
  "Install": "安装",
  "Installed": "已安装",
  "Uninstall": "卸载",
  "Reinstall": "重新安装",
  "Enable": "启用",
  "Disable": "禁用",
  "Enabled": "已启用",
  "Disabled": "已禁用",
  "Try fix": "尝试修复",
  "Try install": "尝试安装",
  "Try update": "尝试更新",
  "Switch Ver": "切换版本",
  "Restart Required": "需要重启",
  "No Results": "无结果",
  "Copied": "已复制",
  "Import Failed": "导入失败",
  "Missing": "缺失",
  "Favorites": "收藏",
  "Used In Any Workflow": "用于任意工作流",
  "Installed and Unused": "已安装但未使用",
  "In Workflow": "在当前工作流",
  "Added to Workflow": "已添加到工作流",
  "Not Installed": "未安装",
  "ComfyRegistry": "Comfy 仓库",
  "Non-ComfyRegistry": "非 Comfy 仓库",
  "All": "全部",
  "Filter keywords...": "过滤关键词...",
  "Filter keywords ...": "过滤关键词...",
  "Tasks done": "任务完成",
  "Remaining tasks will stop after completing the current task.": "剩余任务将在当前任务完成后停止。",
  "Loading external model list ...": "正在加载外部模型列表...",
  "Loading workflow usage analysis ...": "正在加载工作流使用分析...",
  "Analyzing node usage ...": "正在分析节点使用...",
  "No workflows were found for analysis.": "没有找到可分析的工作流。",
  "Failed to get custom node list.": "获取自定义节点列表失败。",
  "Failed to get external model list.": "获取外部模型列表失败。",
  "Failed to fetch versions from ComfyRegistry.": "从 Comfy 仓库获取版本失败。",
  "Please enter the URL of the Git repository to install": "请输入要安装的 Git 仓库 URL",
  "Please select a version.": "请选择一个版本。",
  "ComfyUI is outdated, so some built-in nodes cannot be used.": "ComfyUI 版本过旧，部分内置节点无法使用。",
  "The information is not available.": "该信息不可用。",
  "This author has been active for more than six months in GitHub": "该作者在 GitHub 已活跃超过六个月",
  "N/A": "无",
  "Size": "大小",
  "Type": "类型",
  "Base": "基础",
  "Save Path": "保存路径",
  "Filename": "文件名",
  "Name": "名称",
  "Used in": "用于",
  "Back": "返回",
  "Refresh": "刷新",
  "Check Update": "检查更新",
  "Check Missing": "检查缺失",
  "Used In Workflow": "用于工作流",
  "Save snapshot": "保存快照",
  "Restore": "恢复",
  "Remove": "移除",
  "Black": "黑色",
  "White": "白色",
  "Datetime": "时间",
  "Download file": "下载文件",
  "To apply the installed model, please click the": "要应用已安装的模型，请点击",
  "CM: cannot find": "CM：找不到",
  "not found": "未找到",
  "restart required": "需要重启",
  "from cnr list.": "来自 cnr 列表。",
  "Installation Error:": "安装错误：",
  "[Installation Errors]": "【安装错误】",
  "Operation Error:": "操作错误：",
  "Are you sure you'd like to reboot the server?": "确定要重启服务器吗？",
  "This action is not allowed with this security level configuration.": "当前安全级别不允许该操作。",
  "ComfyUI version is outdated.": "ComfyUI 版本过旧。",
  "Please update ComfyUI to use Manager normally.": "请更新 ComfyUI 以正常使用管理器。",
  "Confirm": "确认"
};

const SETTINGS_ZH = {
  "rgthree-comfy settings": "rgthree-comfy 设置",
};

const CONTAINER_SELECTOR = "[data-testid=\"settings-dialog\"], .comfy-dialog, #cm-manager-dialog, #cn-manager-dialog, #cmm-manager-dialog, #snapshot-manager-dialog, .cn-manager, .cmm-manager, .nu-manager, .rgthree-dialog, .rgthree-menu";

const PREFIX_RULES = [
  ["Installation Error:\n", "安装错误：\n"],
  ["[Installation Errors]\n", "【安装错误】\n"],
  ["Operation Error:\n", "操作错误：\n"],
];

const REGEX_RULES = [
  [/^ComfyUI Manager\s+V?([\d.]+)$/i, (m) => "ComfyUI 管理器 V" + m[1]],
  [/^Settings - rgthree-comfy$/i, () => "设置 - rgthree-comfy"],
  [/^(\d[\d,]*)\s+custom nodes$/i, (m) => m[1] + " 个自定义节点"],
  [/^(\d[\d,]*)\s+external models$/i, (m) => m[1] + " 个外部模型"],
  [/^(\d[\d,]*)\s+installed packages$/i, (m) => m[1] + " 个已安装包"],
  [/^(\d[\d,]*)\s+workflows?$/i, (m) => m[1] + " 个工作流"],
  [/^Loading custom nodes\b.*\.\.\.$/i, () => "正在加载自定义节点..."],
  [/^Loading node mappings\b.*\.\.\.$/i, () => "正在加载节点映射..."],
  [/^Loading missing nodes\b.*\.\.\.$/i, () => "正在加载缺失节点..."],
  [/^Loading alternatives\b.*\.\.\.$/i, () => "正在加载替代项..."],
  [/^Loading workflow usage analysis\b.*\.\.\.$/i, () => "正在加载工作流使用分析..."],
  [/^Loading external model list\b.*\.\.\.$/i, () => "正在加载外部模型列表..."],
];

function localeCode() {
  try {
    const v = app?.ui?.settings?.getSettingValue?.("Comfy.Locale");
    if (typeof v === "string" && v) return v;
  } catch (e) { /* settings 未就绪 */ }
  return (document.documentElement.lang || "").toLowerCase();
}

function localeIsZh() {
  return localeCode().toLowerCase().startsWith("zh");
}

function dictFor(el) {
  if (!el || !el.closest) return null;
  if (el.closest(".rgthree-dialog")) return RGTHREE_ZH;
  if (el.closest(".rgthree-menu")) return RGTHREE_ZH;
  if (el.closest('[data-testid="settings-dialog"]')) return SETTINGS_ZH;
  if (el.closest(".comfy-dialog, #cm-manager-dialog, #cn-manager-dialog, #cmm-manager-dialog, #snapshot-manager-dialog, .cn-manager, .cmm-manager, .nu-manager")) return MANAGER_ZH;
  return null;
}

const originals = new Map();

function translateTextNode(node) {
  if (!node || node.nodeType !== Node.TEXT_NODE) return;
  const text = node.nodeValue;
  if (!text) return;
  const parent = node.parentElement;
  if (!parent) return;
  const tag = parent.tagName;
  if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA" || tag === "INPUT" || tag === "CODE" || tag === "PRE") return;
  const dict = dictFor(parent);
  if (!dict) return;
  const trimmed = text.trim();
  if (!trimmed) return;

  let zh = dict[trimmed];
  let prefixLen = 0;

  if (!zh) {
    for (const [re, fn] of REGEX_RULES) {
      const m = re.exec(trimmed);
      if (m) { zh = fn(m); break; }
    }
  }
  if (!zh) {
    for (const [prefix, rep] of PREFIX_RULES) {
      if (text.startsWith(prefix)) { zh = rep; prefixLen = prefix.length; break; }
    }
  }
  if (!zh) return;

  if (!originals.has(node)) originals.set(node, text);
  node.nodeValue = prefixLen ? zh + text.slice(prefixLen) : text.replace(trimmed, zh);
}

const ATTRIBUTES = ["placeholder", "title", "aria-label"];
const attrOriginals = new Map();

function translateElementAttrs(el) {
  const dict = dictFor(el);
  if (!dict) return;
  for (const attr of ATTRIBUTES) {
    const value = el.getAttribute ? el.getAttribute(attr) : null;
    if (!value) continue;
    const trimmed = value.trim();
    const zh = dict[trimmed];
    if (!zh) continue;
    let m = attrOriginals.get(el);
    if (!m) { m = new Map(); attrOriginals.set(el, m); }
    if (!m.has(attr)) m.set(attr, value);
    el.setAttribute(attr, value.replace(trimmed, zh));
  }
}

function translateRoot(root) {
  if (!root) return;
  if (root.nodeType === Node.TEXT_NODE) { translateTextNode(root); return; }
  if (!root.querySelectorAll) return;
  translateElementAttrs(root);
  for (const el of root.querySelectorAll("*")) translateElementAttrs(el);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) translateTextNode(n);
}

function translateDocument() {
  document.querySelectorAll(CONTAINER_SELECTOR).forEach((el) => translateRoot(el));
}

function restoreAll() {
  for (const [node, orig] of originals) {
    if (node.isConnected) node.nodeValue = orig;
  }
  originals.clear();
  for (const [el, attrs] of attrOriginals) {
    if (!el.isConnected) continue;
    for (const [attr, value] of attrs) el.setAttribute(attr, value);
  }
  attrOriginals.clear();
}

const observer = new MutationObserver((mutations) => {
  if (!localeIsZh()) return;
  for (const m of mutations) {
    if (m.type === "characterData") { translateTextNode(m.target); continue; }
    for (const n of m.addedNodes) {
      if (n.nodeType === Node.ELEMENT_NODE) translateRoot(n);
      else if (n.nodeType === Node.TEXT_NODE) translateTextNode(n);
    }
  }
});


const CONFIRM_ZH = {
  "Looks like there are unsaved changes. Are you sure you want close?": "有未保存的更改，确定要关闭吗？",
};

function translateMessage(message) {
  if (!localeIsZh() || typeof message !== "string" || !message) return message;
  const trimmed = message.trim();
  let zh = CONFIRM_ZH[trimmed] || MANAGER_ZH[trimmed] || RGTHREE_ZH[trimmed];
  if (!zh) {
    for (const [re, fn] of REGEX_RULES) {
      const m = re.exec(trimmed);
      if (m) { zh = fn(m); break; }
    }
  }
  if (!zh) {
    for (const [prefix, rep] of PREFIX_RULES) {
      if (message.startsWith(prefix)) return rep + message.slice(prefix.length);
    }
  }
  return zh ? message.replace(trimmed, zh) : message;
}

const nativeConfirm = window.confirm.bind(window);
window.confirm = (message) => nativeConfirm(translateMessage(message));

function onLocaleChanged() {
  restoreAll();
  if (localeIsZh()) translateDocument();
  console.log("[DD] 语言切换 ->", localeCode());
}

app.registerExtension({
  name: "DD-Translation-Native.UiZh",
  async setup() {
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    // 官方语言切换信号：GraphCanvas 会在设置变更时 dispatch `${id}.change`
    try {
      app?.ui?.settings?.addEventListener?.("Comfy.Locale.change", onLocaleChanged);
    } catch (e) { /* 老版本没有该事件 */ }

    // 包装核心对话框服务：prompt / confirm / alert 的 title+message
    try {
      const dlg = app?.extensionManager?.dialog;
      for (const method of ["prompt", "confirm", "alert"]) {
        const orig = dlg && dlg[method];
        if (typeof orig !== "function" || orig.__ddWrapped) continue;
        const wrapped = function (...args) {
          if (args[0] && typeof args[0] === "object") {
            const opts = { ...args[0] };
            if (typeof opts.title === "string") opts.title = translateMessage(opts.title);
            if (typeof opts.message === "string") opts.message = translateMessage(opts.message);
            args[0] = opts;
          } else if (typeof args[0] === "string") {
            args[0] = translateMessage(args[0]);
          }
          return orig.apply(dlg, args);
        };
        wrapped.__ddWrapped = true;
        dlg[method] = wrapped;
      }
    } catch (e) { /* 老版本没有该服务 */ }

    // 兜底轮询（800ms，只比较一个字符串）
    let last = localeCode();
    setInterval(() => {
      const now = localeCode();
      if (now !== last) { last = now; onLocaleChanged(); }
    }, 800);

    // 兼容 <html lang> 变化
    new MutationObserver(() => {
      if (localeIsZh()) translateDocument(); else restoreAll();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    translateDocument();
    for (const d of [300, 1000, 3000]) setTimeout(translateDocument, d);
    console.log("[DD] UI 词典已就绪：rgthree " + Object.keys(RGTHREE_ZH).length + " 条 / Manager " + Object.keys(MANAGER_ZH).length + " 条");
  },
});
