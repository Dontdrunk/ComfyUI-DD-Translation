import { app } from "../../../scripts/app.js";

/**
 * 前端 1.58.5 的 Vue 节点把动态子控件（io.DynamicCombo 里的小参数）的标签
 * 直接取自节点定义 spec.display_name，没有 i18n 入口；nodeDefs 只能翻槽位名。
 * 这里在渲染出的节点 DOM 上做一次限定范围的文字替换：
 * 只处理下面这些节点的、完全等于英文键名的文本节点，不碰其他节点和值。
 */

const NODE_LABELS = {
  RTXVideoSuperResolution: { scale: "缩放倍数", width: "目标宽度", height: "目标高度" },
  RTXVideoFrameGeneration: { multiplier: "帧率倍数", timestep: "时间步位置" },
};

function localeIsZh() {
  try {
    const v = app?.ui?.settings?.getSettingValue?.("Comfy.Locale");
    if (typeof v === "string" && v) return v.toLowerCase().startsWith("zh");
  } catch (e) {
    /* settings 还没就绪 */
  }
  return (document.documentElement.lang || "").toLowerCase().startsWith("zh");
}

function translateNodeElement(form, map) {
  const walker = document.createTreeWalker(form, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue.trim();
    if (!text) continue;
    const zh = map[text];
    if (zh && node.nodeValue !== zh) node.nodeValue = zh;
  }
}

function scan(root) {
  if (!localeIsZh()) return;
  const forms = root.querySelectorAll ? root.querySelectorAll("[data-node-id]") : [];
  for (const form of forms) {
    const id = form.getAttribute("data-node-id");
    if (!id) continue;
    let graphNode;
    try {
      graphNode = app.graph?.getNodeById?.(Number(id) || id);
    } catch (e) {
      graphNode = undefined;
    }
    const map = graphNode && NODE_LABELS[graphNode.comfyClass];
    if (map) translateNodeElement(form, map);
  }
}

let pending = 0;
function schedule() {
  if (pending) return;
  pending = window.setTimeout(() => {
    pending = 0;
    try {
      scan(document);
    } catch (e) {
      /* ignore */
    }
  }, 120);
}

app.registerExtension({
  name: "DD-Translation-Native.DynamicLabels",
  async setup() {
    schedule();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    for (const delay of [500, 1500, 4000]) setTimeout(schedule, delay);
  },
  nodeCreated() {
    schedule();
  },
  loadedGraphNode() {
    schedule();
  },
});
