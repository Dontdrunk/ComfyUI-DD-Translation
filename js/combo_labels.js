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

/**
 * 少数节点用 io.DynamicCombo 生成子控件（scale / width / height ...）。
 * 前端是在运行时按 `父槽位.子名` 动态补进来的，input.label 直接用英文原名，
 * 官方 nodeDefs 翻译链路覆盖不到，这里按“节点类名 + 父槽位 + 子名”补中文显示。
 */
const DYNAMIC_LABELS = {
  RTXVideoSuperResolution: {
    resize_type: { scale: "缩放倍数", width: "目标宽度", height: "目标高度" },
  },
  RTXVideoFrameGeneration: {
    generation_type: { multiplier: "帧率倍数", timestep: "时间步位置" },
  },
};

/** V3 节点内部输出槽名同样不在 nodeDefs 翻译范围，按类名补中文显示。 */
const OUTPUT_LABELS = {
  RTXVideoSuperResolution: { upscaled_images: "放大后的图像" },
  RTXTrueHDR: { hdr_images: "HDR 图像" },
  RTXVideoFrameGeneration: { interpolated_images: "插帧后的图像" },
};

function setLabel(target, zh) {
  if (!target) return false;
  if (target.__ddLabelPrev === undefined) target.__ddLabelPrev = target.label;
  if (target.__ddNamePrev === undefined) target.__ddNamePrev = target.display_name;
  const on = localeIsZh();
  target.label = on ? zh : target.__ddLabelPrev;
  if (target.__ddNamePrev !== undefined) {
    target.display_name = on ? zh : target.__ddNamePrev;
  }
  // 前端 1.58.5 的动态子控件标签取自 spec.display_name，必须一起改
  const spec = target.spec;
  if (spec && typeof spec === "object") {
    if (target.__ddSpecPrev === undefined) target.__ddSpecPrev = spec.display_name;
    spec.display_name = on ? zh : target.__ddSpecPrev;
  }
  return true;
}

function patchDynamicInputs(node, spec) {
  let changed = false;
  for (const [parent, children] of Object.entries(spec)) {
    for (const [child, zh] of Object.entries(children)) {
      const full = parent + "." + child;
      for (const slot of node.inputs || []) {
        if (slot && (slot.name === full || slot.name === child)) {
          changed = setLabel(slot, zh) || changed;
        }
      }
      for (const widget of node.widgets || []) {
        if (widget && (widget.name === full || widget.name === child)) {
          changed = setLabel(widget, zh) || changed;
        }
      }
    }
    // 切换动态下拉后会重建子输入，包一层 callback，换档后重新套中文
    const combo = (node.widgets || []).find((w) => w && w.name === parent);
    if (combo && !combo.__ddLabelHook) {
      const prev = combo.callback;
      combo.callback = function (...args) {
        const ret = typeof prev === "function" ? prev.apply(this, args) : undefined;
        setTimeout(() => {
          try {
            patchNode(node);
          } catch (e) {
            /* ignore */
          }
        }, 0);
        return ret;
      };
      combo.__ddLabelHook = true;
    }
  }
  return changed;
}

function patchNode(node) {
  if (!node || !node.widgets || !Array.isArray(node.widgets)) return;
  const cls = node.comfyClass;
  if (!cls) return;
  const maps = OPTIONS[cls];
  const dyn = DYNAMIC_LABELS[cls];
  const outLabels = OUTPUT_LABELS[cls];
  if (!maps && !dyn && !outLabels) return;
  let changed = false;
  if (maps) {
    for (const widget of node.widgets) {
      if (!widget || typeof widget.name !== "string") continue;
      const map = maps[widget.name];
      if (!map) continue;
      if (patchWidget(widget, map)) changed = true;
    }
  }
  if (dyn) changed = patchDynamicInputs(node, dyn) || changed;
  if (outLabels && Array.isArray(node.outputs)) {
    for (const slot of node.outputs) {
      const zh = slot && outLabels[slot.name];
      if (!zh) continue;
      changed = setLabel(slot, zh) || changed;
    }
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
