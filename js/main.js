import { app } from "../../../scripts/app.js";
import { applyMenuTranslation } from "./MenuTranslate.js";
import {
  containsChineseCharacters,
  isAlreadyTranslated,
  hasNativeTranslation,
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
  static getInputTranslationDict(t, key) {
    if (!t) return null;
    if (t["inputs"] && key in t["inputs"]) return t["inputs"][key];
    if (t["widgets"] && key in t["widgets"]) return t["widgets"][key];
    if (t["inputs"] && t["inputs"]["*"]) return t["inputs"]["*"];
    const h = applySuffixHeuristic(key);
    return h || null;
  }
  static setItemText(item, text) {
    if (!text) return;
    if (TUtils.needsTranslation(item)) {
      if (!item._original_name) item._original_name = item.name;
      if ("label" in item) item.label = text;
      if ("localized_name" in item) item.localized_name = text;
    }
  }
  static applyNodeTypeTranslationEx(nodeName) {
    try {
      let nodesT = this.T.Nodes;
      var nodeType = LiteGraph.registered_node_types[nodeName];
      if (!nodeType) return;
      
      let class_type = nodeType.comfyClass ? nodeType.comfyClass : nodeType.type;
      if (nodesT.hasOwnProperty(class_type)) {
        if (!hasNativeTranslation(nodeType, 'title') && nodesT[class_type]["title"]) {
          nodeType.title = nodesT[class_type]["title"];
        }
      }
    } catch (e) {
      error(`为节点类型 ${nodeName} 应用翻译失败:`, e);
    }
  }  static applyVueNodeDisplayNameTranslation(nodeDef) {
    try {
      const nodesT = TUtils.T.Nodes;
      const class_type = nodeDef.name;
      if (nodesT.hasOwnProperty(class_type)) {
        if (!hasNativeTranslation(nodeDef, 'display_name') && nodesT[class_type]["title"]) {
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
                const translation = TUtils.getInputTranslationDict(t, key);
                if (translation) {
                    const val = inputObj[key];
                    if (Array.isArray(val) && val.length > 1 && typeof val[1] === 'object') {
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
                 let translation = null;
                 if (originalName in t["outputs"]) translation = t["outputs"][originalName];
                 else if (t["outputs"]["*"]) translation = t["outputs"]["*"];
                 else if (t["outputs"]["samples"] && /_samples$/.test(originalName)) translation = t["outputs"]["samples"];
                 if (translation && !containsChineseCharacters(originalName)) {
                     nodeDef.output_name[i] = translation;
                 }
             }
         }

    } catch (e) {
        error(`Vue节点定义翻译注入失败 (${nodeDef?.name}):`, e);
    }
  }

  static applyNodeTypeTranslation(app) {
    try {
      if (!isTranslationEnabled()) return;
      
      for (let nodeName in LiteGraph.registered_node_types) {
        this.applyNodeTypeTranslationEx(nodeName);
      }
    } catch (e) {
      error("应用节点类型翻译失败:", e);
    }
  }  static needsTranslation(item) {
    if (!item || !item.hasOwnProperty("name")) return false;
    
    if (isAlreadyTranslated(item.name, item.label)) {
      return false;
    }
    
    if (containsChineseCharacters(item.name)) {
      return false;
    }
    
    return true;
  }

  static safeApplyTranslation(item, translation) {
    if (this.needsTranslation(item) && translation) {
      // 保存原始名称
      if (!item._original_name) {
        item._original_name = item.name;
      }
      item.label = translation;
    }
  }

  // 新增：还原翻译方法
  static restoreOriginalTranslation(item) {
    if (item._original_name) {
      item.label = item._original_name;
      delete item._original_name;
    } else if (item.label && item.name) {
      // 如果没有保存原始名称，则使用name作为fallback
      item.label = item.name;
    }
  }
  static applyNodeTranslation(node) {
    try {
      // 基本验证
      if (!node) {
        error("applyNodeTranslation: 节点为空");
        return;
      }
      
      if (!node.constructor) {
        error("applyNodeTranslation: 节点构造函数为空");
        return;
      }

      let keys = ["inputs", "outputs", "widgets"];
      let nodesT = this.T.Nodes;
      let class_type = node.constructor.comfyClass ? node.constructor.comfyClass : node.constructor.type;
      
      if (!class_type) {
        error("applyNodeTranslation: 无法获取节点类型");
        return;
      }

      if (!isTranslationEnabled()) {
        // 如果翻译被禁用，还原所有翻译
        for (let key of keys) {
          if (!node.hasOwnProperty(key)) continue;
          if (!node[key] || !Array.isArray(node[key])) continue;
          node[key].forEach((item) => {
            // 只还原那些确实被我们翻译过的项目（有_original_name标记的）
            if (item._original_name) {
              this.restoreOriginalTranslation(item);
            }
          });
        }
        
        // 还原标题 - 只还原那些确实被我们翻译过的标题
        if (node._original_title && !node._dd_custom_title) {
          node.title = node._original_title;
          node.constructor.title = node._original_title;
          delete node._original_title;
        }
        return;      }
      
      if (!nodesT || !nodesT.hasOwnProperty(class_type)) return;
      
      var t = nodesT[class_type];
      if (!t) return;
      
      for (let key of keys) {
        if (!node.hasOwnProperty(key)) continue;
        if (!node[key] || !Array.isArray(node[key])) continue;
        node[key].forEach((item) => {
          if (!item || !item.name) return;
          const hasNative = hasNativeTranslation(item, 'label') && !item._original_name;
          if (hasNative) return;
          if (key === 'inputs' || key === 'widgets') {
            const tr = TUtils.getInputTranslationDict(t, item.name);
            if (tr) TUtils.setItemText(item, tr);
          } else if (key === 'outputs') {
            let tr = null;
            if (t["outputs"] && item.name in t["outputs"]) tr = t["outputs"][item.name];
            else if (t["outputs"] && t["outputs"]["*"]) tr = t["outputs"]["*"];
            else if (t["outputs"] && t["outputs"]["samples"] && /_samples$/.test(item.name)) tr = t["outputs"]["samples"];
            if (tr) TUtils.setItemText(item, tr);
          }
        });
      }
      
      if (t.hasOwnProperty("title")) {
        const isCustomizedTitle = node._dd_custom_title || 
          (node.title && node.title !== (node.constructor.comfyClass || node.constructor.type) && node.title !== t["title"]);
        
        if (!isCustomizedTitle && !hasNativeTranslation(node, 'title')) {
          // 保存原始标题
          if (!node._original_title) {
            node._original_title = node.constructor.comfyClass || node.constructor.type;
          }
          node.title = t["title"];
          node.constructor.title = t["title"];
        }
      }
        // 转换 widget 到 input 时需要刷新socket信息
      let addInput = node.addInput;
      node.addInput = function (name, type, extra_info) {
        var oldInputs = [];
        if (this.inputs && Array.isArray(this.inputs)) {
          this.inputs.forEach((i) => oldInputs.push(i.name));
        }
        var res = addInput.apply(this, arguments);
        if (this.inputs && Array.isArray(this.inputs)) {
          this.inputs.forEach((i) => {
            if (oldInputs.includes(i.name)) return;
            const tr = TUtils.getInputTranslationDict(t, i.widget?.name || i.name);
            if (tr) TUtils.setItemText(i, tr);
          });
        }
        return res;
      };
      let onInputAdded = node.onInputAdded;
      node.onInputAdded = function (slot) {
        let res;
        if (onInputAdded) {
          res = onInputAdded.apply(this, arguments);
        }
        let t = TUtils.T.Nodes[this.comfyClass];
        const tr = TUtils.getInputTranslationDict(t, slot.name);
        if (tr) TUtils.setItemText(slot, tr);
        return res;
      };
    } catch (e) {
      error(`为节点 ${node?.title || '未知'} 应用翻译失败:`, e);
    }
  }
  static applyNodeDescTranslation(nodeType, nodeData, app) {
    try {
      // 如果翻译被禁用，直接返回
      if (!isTranslationEnabled()) {
        return;
      }
      
      let nodesT = this.T.Nodes;
      var t = nodesT[nodeType.comfyClass];
      if (t?.["description"]) {
        nodeData.description = t["description"];
      }

      if (t) {
        var nodeInputT = t["inputs"] || {};
        var nodeWidgetT = t["widgets"] || {};
        for (let itype in nodeData.input) {
          for (let socketname in nodeData.input[itype]) {
            let inp = nodeData.input[itype][socketname];
            if (inp[1] === undefined || !inp[1].tooltip) continue;
            var tooltip = inp[1].tooltip;
            var tooltipT = nodeInputT[tooltip] || nodeWidgetT[tooltip] || tooltip;
            inp[1].tooltip = tooltipT;
          }
        }
        
        var nodeOutputT = t["outputs"] || {};
        for (var i = 0; i < (nodeData.output_tooltips || []).length; i++) {
          var tooltip = nodeData.output_tooltips[i];
          var tooltipT = nodeOutputT[tooltip] || tooltip;
          nodeData.output_tooltips[i] = tooltipT;
        }
      }
    } catch (e) {
      error(`为节点 ${nodeType?.comfyClass || '未知'} 应用描述翻译失败:`, e);
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
  static applyContextMenuTranslation(app) {
    try {
      if (!isTranslationEnabled()) return;
      
      // 右键上下文菜单
      var f = LGraphCanvas.prototype.getCanvasMenuOptions;
      LGraphCanvas.prototype.getCanvasMenuOptions = function () {
        var res = f.apply(this, arguments);
        let menuT = TUtils.T.Menu;
        for (let item of res) {
          if (item == null || !item.hasOwnProperty("content")) continue;
          if (item.content in menuT) {
            item.content = menuT[item.content];
          }
        }
        return res;
      };
      
      const f2 = LiteGraph.ContextMenu;
      LiteGraph.ContextMenu = function (values, options) {
        if (options?.hasOwnProperty("title") && options.title in TUtils.T.Nodes) {
          options.title = TUtils.T.Nodes[options.title]["title"] || options.title;
        }
        
        var t = TUtils.T.Menu;
        var tN = TUtils.T.Nodes;
        var reInput = /Convert (.*) to input/;
        var reWidget = /Convert (.*) to widget/;
        var cvt = t["Convert "] || "Convert ";
        var tinp = t[" to input"] || " to input";
        var twgt = t[" to widget"] || " to widget";
        
        for (let value of values) {
          if (value == null || !value.hasOwnProperty("content")) continue;
          
          if (value.value in tN) {
            value.content = tN[value.value]["title"] || value.content;
            continue;
          }
          
          if (value.content in t) {
            value.content = t[value.content];
            continue;
          }
          
          var extra_info = options.extra || options.parentMenu?.options?.extra;
          
          var matchInput = value.content?.match(reInput);
          if (matchInput) {
            var match = matchInput[1];
            extra_info?.inputs?.find((i) => {
              if (i.name != match) return false;
              match = i.label ? i.label : i.name;
            });
            extra_info?.widgets?.find((i) => {
              if (i.name != match) return false;
              match = i.label ? i.label : i.name;
            });
            value.content = cvt + match + tinp;
            continue;
          }
          
          var matchWidget = value.content?.match(reWidget);
          if (matchWidget) {
            var match = matchWidget[1];
            extra_info?.inputs?.find((i) => {
              if (i.name != match) return false;
              match = i.label ? i.label : i.name;
            });
            extra_info?.widgets?.find((i) => {
              if (i.name != match) return false;
              match = i.label ? i.label : i.name;
            });
            value.content = cvt + match + twgt;
            continue;
          }
        }

        const ctx = f2.call(this, values, options);
        return ctx;
      };
      LiteGraph.ContextMenu.prototype = f2.prototype;
    } catch (e) {
      error("应用上下文菜单翻译失败:", e);
    }
  }
  static addRegisterNodeDefCB(app) {
    try {
      const f = app.registerNodeDef;
      app.registerNodeDef = async function (nodeId, nodeData) {
        var res = f.apply(this, arguments);
        res.then(() => {
          TUtils.applyNodeTypeTranslationEx(nodeId);
        });
        return res;
      };
    } catch (e) {
      error("添加节点定义注册回调失败:", e);
    }
  }
  static addPanelButtons(app) {
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
        if (!isVueNodes2()) {
          TUtils.applyNodeTypeTranslation(app);
          TUtils.applyContextMenuTranslation(app);
          TUtils.addRegisterNodeDefCB(app);
        } else {
          if (!isComfyUIChineseNative) {
            TUtils.applyMenuTranslation(app);
          }
          TUtils.applyVueI18nNodeDefs();
        }
      }
      
    } catch (e) {
      error("扩展设置失败:", e);
    }
  },
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
    try {
      TUtils.applyNodeDescTranslation(nodeType, nodeData, app);
    } catch (e) {
      error(`注册节点定义前处理失败 (${nodeType?.comfyClass || '未知'}):`, e);
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
  },  loadedGraphNode(node, app) {
    try {
      const originalTitle = node.constructor.comfyClass || node.constructor.type;
      const nodeT = TUtils.T.Nodes[originalTitle];
      const translatedTitle = nodeT?.title;
      
      if (node.title && 
          node.title !== originalTitle && 
          node.title !== translatedTitle) {
        node._dd_custom_title = true;
      }
      
      // 无论翻译是否启用都调用，让方法内部判断
      TUtils.applyNodeTranslation(node);
    } catch (e) {
      error(`加载图表节点处理失败 (${node?.title || '未知'}):`, e);
    }
  },
  
  nodeCreated(node, app) {
    try {
      // 无论翻译是否启用都调用，让方法内部判断
      TUtils.applyNodeTranslation(node);
    } catch (e) {
      error(`创建节点处理失败 (${node?.title || '未知'}):`, e);
    }
  },
};

app.registerExtension(ext);
