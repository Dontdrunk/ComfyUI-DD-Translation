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

function patchGraph(graph) {
  if (!graph) return;
  for (const node of graph._nodes || []) patchNode(node);
  const subs = graph.subgraphs;
  if (!subs) return;
  const list = subs instanceof Map ? subs.values() : Object.values(subs);
  for (const sub of list) patchGraph(sub);
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
    setTimeout(() => patchGraph(app.graph), 0);
  },
});
