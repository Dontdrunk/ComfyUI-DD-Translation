import { app } from "../../../scripts/app.js";
import { applyMenuTranslation } from "./MenuTranslate.js";
import {
  containsChineseCharacters,
  nativeTranslatedSettings,
  isTranslationEnabled,
  toggleTranslation,
  initConfig,
  error,
  isVueNodes2,
  applySuffixHeuristic
} from "./utils.js";

export class TUtils {
  static T = {
    Menu: {},
    Nodes: {},
    NodeCategory: {},
  };
  static async syncTranslation(OnFinished = () => {}) {
    try {
      if (!isTranslationEnabled()) {
        // 如果翻译被禁用，清空翻译数据并直接返回
        TUtils.T = {
          Menu: {},
          Nodes: {},
          NodeCategory: {},
        };
        OnFinished();
        return;
      }
      
      try {
        const response = await fetch("./agl/get_translation", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `locale=zh-CN`
        });
        
        if (!response.ok) {
          throw new Error(`请求翻译数据失败: ${response.status} ${response.statusText}`);
        }
        
        const resp = await response.json();
        for (var key in TUtils.T) {
          if (key in resp) TUtils.T[key] = resp[key];
          else TUtils.T[key] = {};
        }
        
        const isComfyUIChineseNative = document.documentElement.lang === 'zh-CN';
        
        if (isComfyUIChineseNative) {
          const originalMenu = TUtils.T.Menu || {};
          TUtils.T.Menu = {};
          for (const key in originalMenu) {
            if (!nativeTranslatedSettings.includes(key) && 
                !nativeTranslatedSettings.includes(originalMenu[key]) &&
                !containsChineseCharacters(key)) {
              TUtils.T.Menu[key] = originalMenu[key];
            }
          }
        } else {
          // 将NodeCategory合并到Menu中 
          TUtils.T.Menu = Object.assign(TUtils.T.Menu || {}, TUtils.T.NodeCategory || {});
        }
        
        // 提取 Node 中 key 到 Menu
        for (let key in TUtils.T.Nodes) {
          let node = TUtils.T.Nodes[key];
          if(node && node["title"]) {
            TUtils.T.Menu = TUtils.T.Menu || {};
            TUtils.T.Menu[key] = node["title"] || key;
          }
        }
        
      } catch (e) {
        error("获取翻译数据失败:", e);
      }
      
      OnFinished();
    } catch (err) {
      error("同步翻译过程出错:", err);
      OnFinished();
    }
  }
  static applyVueNodeDisplayNameTranslation(nodeDef) {
    try {
      const nodesT = TUtils.T.Nodes;
      const class_type = nodeDef.name;
      if (nodesT.hasOwnProperty(class_type)) {
        if (nodesT[class_type]["title"]) {
          nodeDef.display_name = nodesT[class_type]["title"];
        }
      }
    } catch (e) {
      error(`为Vue节点 ${nodeDef?.name} 应用显示名称翻译失败:`, e);
    }
  }

  static applyVueNodeTranslation(nodeDef) {
    try {
      const catsT = TUtils.T.NodeCategory;
      if (!nodeDef.category) return;
      const catArr = nodeDef.category.split("/");
      nodeDef.category = catArr.map((cat) => catsT?.[cat] || cat).join("/");
    } catch (e) {
      error(`为Vue节点 ${nodeDef?.name} 应用翻译失败:`, e);
    }
  }

  /**
   * Inject translations into Vue Node Definition (Inputs/Outputs/Widgets)
   * @param {Object} nodeDef
   */
  static applyVueNodeDefTranslation(nodeDef) {
    try {
        const class_type = nodeDef.name;
        const nodesT = TUtils.T.Nodes;
        if (!nodesT || !nodesT.hasOwnProperty(class_type)) return;
        const t = nodesT[class_type];

        // 1. Translate Inputs (Required & Optional)
        // input: { required: { key: [type, opts] }, optional: { ... } }
        const translateInputs = (inputObj) => {
            if (!inputObj) return;
            for (const key in inputObj) {
                // Try 'inputs' dictionary first, then 'widgets' (as widgets are defined in inputs)
                let translation = null;
                if (t["inputs"] && key in t["inputs"]) {
                    translation = t["inputs"][key];
                } else if (t["widgets"] && key in t["widgets"]) {
                    translation = t["widgets"][key];
                } else if (t["inputs"] && t["inputs"]["*"]) {
                    translation = t["inputs"]["*"];
                } else {
                    const h = applySuffixHeuristic(key);
                    if (h) translation = h;
                }

                if (translation) {
                    const val = inputObj[key];
                    // val is [TYPE, OPTIONS]
                    if (Array.isArray(val) && val.length > 1 && typeof val[1] === 'object') {
                        // Inject label into options
                        if (!val[1].label || !containsChineseCharacters(val[1].label)) {
                            val[1].label = translation;
                        }
                    }
                }
            }
        };

        if (nodeDef.input) {
            translateInputs(nodeDef.input.required);
            translateInputs(nodeDef.input.optional);
        }

        // 2. Translate Output Names
        // output_name: ["Output1", "Output2"]
         if (t["outputs"] && nodeDef.output_name && Array.isArray(nodeDef.output_name)) {
             for (let i = 0; i < nodeDef.output_name.length; i++) {
                 const originalName = nodeDef.output_name[i];
                 if (originalName in t["outputs"]) {
                      const translation = t["outputs"][originalName];
                      if (translation && !containsChineseCharacters(originalName)) {
                          nodeDef.output_name[i] = translation;
                      }
                 } else if (t["outputs"]["*"]) {
                      const translation = t["outputs"]["*"];
                      if (translation) {
                          nodeDef.output_name[i] = translation;
                      }
                 } else if (t["outputs"]["samples"] && /_samples$/.test(originalName)) {
                      const translation = t["outputs"]["samples"];
                      if (translation) {
                          nodeDef.output_name[i] = translation;
                      }
                 }
             }
         }

    } catch (e) {
        error(`Vue节点定义翻译注入失败 (${nodeDef?.name}):`, e);
    }
  }
  static applyMenuTranslation(app) {
    try {
      if (!isTranslationEnabled()) return;
      
      applyMenuTranslation(TUtils.T);
    } catch (e) {
      error("应用菜单翻译失败:", e);
    }
  }
  static applyVueI18nNodeDefs() {
    try {
      if (!isTranslationEnabled()) return;
      if (!isVueNodes2()) return;
      const api = window.comfyAPI?.i18n;
      if (!api || typeof api.addTranslations !== 'function') return;
      const payloadNodeDefs = { nodeDefs: {} };
      const payloadFlat = {};
      const nodesT = TUtils.T.Nodes || {};
      for (const class_type in nodesT) {
        const t = nodesT[class_type];
        const entry = {};
        if (t?.title) entry.display_name = t.title;
        const inputs = {};
        if (t?.inputs) {
          for (const key in t.inputs) {
            const name = t.inputs[key];
            if (name) inputs[key] = { name };
          }
        }
        if (t?.widgets) {
          for (const key in t.widgets) {
            const name = t.widgets[key];
            if (name && !inputs[key]) inputs[key] = { name };
          }
        }
        // Heuristic for common suffixes when missing explicit translation
        Object.keys(inputs).forEach(k=>{});
        if (t?.inputs) {
          for (const key in t.inputs) {}
        }
        // Provide heuristics for keys not in inputs/widgets
        const provideHeuristic = (key) => {
          if (inputs[key]) return;
          const idx = key.lastIndexOf('_');
          if (idx > 0) {
            const base = key.slice(0, idx);
            const suffix = key.slice(idx + 1);
            if (suffix === 'embeds') inputs[key] = { name: `${base}嵌入` };
            else if (suffix === 'args') inputs[key] = { name: `${base}参数` };
          }
        };

        // Attempt heuristics from known node keys
        if (entry.inputs) {
          Object.keys(entry.inputs).forEach(()=>{});
        }

        const outputs = {};
        if (t?.outputs) {
          for (const key in t.outputs) {
            const name = t.outputs[key];
            if (name) outputs[key] = name;
          }
          if (t.outputs["samples"] && !outputs["denoised_samples"]) {
            outputs["denoised_samples"] = t.outputs["samples"];
          }
        }
        if (Object.keys(inputs).length) entry.inputs = inputs;
        if (Object.keys(outputs).length) entry.outputs = outputs;
        if (Object.keys(entry).length) {
          payloadNodeDefs.nodeDefs[class_type] = entry;
          payloadFlat[class_type] = entry;
        }
      }
      // Try multiple language codes and shapes to maximize compatibility
      api.addTranslations('zh-CN', payloadNodeDefs);
      api.addTranslations('zh', payloadNodeDefs);
      api.addTranslations('zh-cn', payloadNodeDefs);
      api.addTranslations('zh-CN', payloadFlat);
      api.addTranslations('zh', payloadFlat);
      api.addTranslations('zh-cn', payloadFlat);
    } catch (e) {
      error("注入Vue节点定义翻译失败:", e);
    }
  }
}

const ext = {
  name: "AIGODLIKE.Translation",
    async init(app) {
    try {
      await initConfig();
      await TUtils.syncTranslation();
    } catch (e) {
      error("扩展初始化失败:", e);
    }
  },
    async setup(app) {
    try {      
      const isComfyUIChineseNative = document.documentElement.lang === 'zh-CN';
      
      app.ui.settings.addSetting({
        id: "🌐翻译设置.语言开关.Enable",
        name: "是否开启附加翻译",
        type: "boolean",
        defaultValue: isTranslationEnabled(),
        onChange: async (value) => {
            if (value !== isTranslationEnabled()) {
                await toggleTranslation();
            }
        },
      });

      if (isTranslationEnabled()) {
        TUtils.applyMenuTranslation(app);
        TUtils.applyVueI18nNodeDefs();
      }
    } catch (e) {
      error("扩展设置失败:", e);
    }
  },
    beforeRegisterVueAppNodeDefs(nodeDefs) {
    try {
      // 如果翻译被禁用，直接返回
      if (!isTranslationEnabled()) {
        return;
      }
      
      nodeDefs.forEach(TUtils.applyVueNodeDisplayNameTranslation);
      nodeDefs.forEach(TUtils.applyVueNodeTranslation);
      nodeDefs.forEach(TUtils.applyVueNodeDefTranslation);
    } catch (e) {
      error("注册Vue应用节点定义前处理失败:", e);
    }
  },
};

app.registerExtension(ext);
