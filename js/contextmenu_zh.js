import { app } from "../../../scripts/app.js";
import { MENUS } from "./menus_zh.js";

/**
 * 右键菜单中文补丁（沿用旧插件的方式，只替换菜单里的文字）
 *
 * 为什么需要它：
 * - 节点 / 画布右键菜单里有一批文案是插件 JS 里写死的英文
 *   （rgthree、VideoHelperSuite、Impact Pack、KJNodes 等），
 *   ComfyUI 的官方 locales 机制覆盖不到；
 * - 这些菜单是 litegraph 的 DOM 菜单（.litecontextmenu），
 *   新版界面里的部分菜单是 Vue 菜单（[role=menu]），都可以按文本替换。
 *
 * 只替换「整段文本完全等于词典键」的文本节点，不做子串替换；只处理菜单，
 * 不动节点名称、参数值等其它区域。切回英文时还原。
 */

const ENTITY_RE = /&nbsp;?/gi;
const MENU_SELECTOR = ".litecontextmenu, .litemenubar-panel, [role='menu']";
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "CODE", "PRE"]);

// 旧词典没有、或需要按上下文补的菜单文案
const REGEX_RULES = [
  [/^Convert (all|selected) Reroutes$/i,
    (m) => (m[1].toLowerCase() === "all" ? "转换全部转接点" : "转换所选转接点")],
  [/^Add Preview(?:Any|As)TextNode$/i, () => "添加预览文本节点"],
  [/^(Pause|Resume) preview$/i,
    (m) => (m[1].toLowerCase() === "pause" ? "暂停预览" : "继续预览")],
  [/^(Show|Hide) preview$/i,
    (m) => (m[1].toLowerCase() === "show" ? "显示预览" : "隐藏预览")],
  [/^(Mute|Unmute) Preview$/i,
    (m) => (m[1].toLowerCase() === "mute" ? "静音预览" : "取消静音预览")],
  [/^More\.{2,}$/i, () => "更多…"],
  [/^复制 \(Clipspace\)$/i, () => "复制 (剪贴板)"],
  [/^粘贴 \(Clipspace\)$/i, () => "粘贴 (剪贴板)"]
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

const originals = new Map();

function lookup(text) {
  if (Object.prototype.hasOwnProperty.call(MENUS, text)) return MENUS[text];
  const cleaned = text.replace(ENTITY_RE, " ").replace(/\s+/g, " ").trim();
  if (cleaned && cleaned !== text &&
      Object.prototype.hasOwnProperty.call(MENUS, cleaned)) {
    return MENUS[cleaned];
  }
  for (const [re, fn] of REGEX_RULES) {
    const m = re.exec(cleaned || text);
    if (m) return fn(m);
  }
  return "";
}

function translateTextNode(node) {
  if (!node || node.nodeType !== Node.TEXT_NODE) return;
  const raw = node.nodeValue;
  if (!raw) return;
  const trimmed = raw.trim();
  if (!trimmed) return;

  const parent = node.parentElement;
  if (!parent || SKIP_TAGS.has(parent.tagName)) return;
  if (parent.closest('[contenteditable="true"]')) return;

  const zh = lookup(trimmed);
  if (!zh || zh === trimmed) return;

  if (!originals.has(node)) originals.set(node, raw);
  let next = raw.replace(trimmed, zh);
  if (/&nbsp;?/i.test(trimmed)) next = next.replace(ENTITY_RE, "");
  node.nodeValue = next;
}

function translateSubtree(root) {
  if (!root || !localeIsZh()) return;
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root);
    return;
  }
  if (!root.querySelectorAll) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) translateTextNode(n);
}

function translateAllMenus() {
  if (!localeIsZh()) return;
  document.querySelectorAll(MENU_SELECTOR).forEach((el) => translateSubtree(el));
  pruneOriginals();
}

function pruneOriginals() {
  if (originals.size < 1000) return;
  for (const [node] of originals) {
    if (!node.isConnected) originals.delete(node);
  }
}

function restoreAll() {
  // 菜单 DOM 可能被缓存后重新挂载，游离的文本节点也要恢复。
  for (const [node, raw] of originals) {
    node.nodeValue = raw;
  }
  originals.clear();
}

function onMenuAdded(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const parent = node.parentElement;
    if (parent && parent.closest(MENU_SELECTOR)) translateTextNode(node);
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  if (node.matches(MENU_SELECTOR) || node.closest(MENU_SELECTOR)) {
    translateSubtree(node);
    return;
  }
  for (const menu of node.querySelectorAll(MENU_SELECTOR)) translateSubtree(menu);
}

const observer = new MutationObserver((mutations) => {
  if (!localeIsZh()) return;
  for (const mutation of mutations) {
    if (mutation.type === "characterData") {
      const parent = mutation.target.parentElement;
      if (parent && parent.closest(MENU_SELECTOR)) {
        translateTextNode(mutation.target);
      }
      continue;
    }
    for (const node of mutation.addedNodes) onMenuAdded(node);
  }
  pruneOriginals();
});

function onLocaleChanged() {
  restoreAll();
  translateAllMenus();
}

app.registerExtension({
  name: "DD-Translation-Native.ContextMenuZh",
  async setup() {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    try {
      app?.ui?.settings?.addEventListener?.("Comfy.Locale.change", onLocaleChanged);
    } catch (e) { /* 老版本没有该事件 */ }

    // 兜底轮询：语言切换时还原 / 重新翻译（只比较一个字符串）
    let last = localeCode();
    setInterval(() => {
      const now = localeCode();
      if (now !== last) {
        last = now;
        onLocaleChanged();
      }
    }, 1000);

    translateAllMenus();
    console.log("[DD] 右键菜单词典已就绪：" + Object.keys(MENUS).length + " 条");
  }
});
