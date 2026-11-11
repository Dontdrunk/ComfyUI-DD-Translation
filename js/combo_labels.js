import { app } from "../../../scripts/app.js";
import { OPTIONS } from "./options_zh.js";

/**
 * 官方 nodeDefs 翻译只解析 name / tooltip / outputs，
 * 前端（1.58.5 及 main）都没有读取 inputs.<slot>.options 的代码路径，
 * 所以下拉框的“值”只能在这里补一层显示映射：只改 label，不动 value。
 */

const EXT_NAME = "DD-Translation-Native.ComboLabels";

function localeIsZh() {
  try {
    const v = app?.ui?.settings?.getSettingValue?.("Comfy.Locale");
    if (typeof v === "string" && v) return v.toLowerCase().startsWith("zh");
  } catch (e) {
    /* settings 还没就绪 */
  }
  return (document.documentElement.lang || "").toLowerCase().startsWith("zh");
}

function patchWidget(widget, map) {
  if (!widget || typeof widget !== "object" || widget.__ddComboPatch) return false;
  const opts = (widget.options = widget.options || {});
  const prev = opts.getOptionLabel;
  opts.getOptionLabel = function (value) {
    if (value === null || value === undefined || value === "")
      return prev ? prev(value) : "";
    if (localeIsZh() && Object.prototype.hasOwnProperty.call(map, value))
      return map[value];
    return prev ? prev(value) : String(value);
  };
  widget.__ddComboPatch = true;
  return true;
}

function patchNode(node) {
  if (!node || !node.widgets || !Array.isArray(node.widgets)) return;
  const cls = node.comfyClass;
  if (!cls) return;
  const maps = OPTIONS[cls];
  if (!maps) return;
  let changed = false;
  for (const widget of node.widgets) {
    if (!widget || typeof widget.name !== "string") continue;
    const map = maps[widget.name];
    if (!map) continue;
    if (patchWidget(widget, map)) changed = true;
  }
  if (changed) {
    try {
      app.graph?.setDirtyCanvas?.(true, true);
    } catch (e) {
      /* ignore */
    }
  }
}

function patchGraph(root) {
  if (!root) return;
  // 前端 1.58.5 起，LGraph.subgraphs 是 "get subgraphs() { return this.rootGraph._subgraphs }"
  // 也就是子图读到的同样是根图那一份表，而这份表里又包含子图自己。
  // 所以这里必须显式迭代 + 按对象去重：每个图、每份子图表只处理一次，
  // 否则子图会从共享表里再次拿到自己，无限自递归直到栈溢出。
  const seenGraphs = new Set();
  const seenTables = new Set();
  const stack = [root];
  while (stack.length) {
    const graph = stack.pop();
    if (!graph || typeof graph !== "object" || seenGraphs.has(graph)) continue;
    seenGraphs.add(graph);
    for (const node of graph._nodes || []) patchNode(node);
    const subs = graph.subgraphs;
    if (!subs || seenTables.has(subs)) continue;
    seenTables.add(subs);
    const list = subs instanceof Map ? subs.values() : Object.values(subs);
    for (const sub of list) {
      if (sub && typeof sub === "object") stack.push(sub);
    }
  }
}

app.registerExtension({
  name: EXT_NAME,
  async setup() {
    const run = () => {
      try {
        patchGraph(app.graph);
      } catch (e) {
        console.warn("[DD] combo labels:", e);
      }
    };
    run();
    for (const delay of [300, 1000, 3000]) setTimeout(run, delay);
    console.log("[DD] combo label shim ready:", Object.keys(OPTIONS).length, "nodes");
  },
  nodeCreated(node) {
    patchNode(node);
  },
  loadedGraphNode(node) {
    patchNode(node);
  },
  afterConfigureGraph() {
    setTimeout(() => {
      try {
        patchGraph(app.graph);
      } catch (e) {
        console.warn("[DD] combo labels:", e);
      }
    }, 0);
  },
});
