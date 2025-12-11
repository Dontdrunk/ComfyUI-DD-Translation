import { 
  containsChineseCharacters, 
  error,
  shouldSkipNode
} from "./utils.js";

/**
 * 翻译执行器类
 */
class TExe {
  static T = null;

  /**
   * 翻译指定文本
   * @param {string} txt 需要翻译的文本
   * @returns {string|null} 翻译后的文本或null
   */
  MT(txt) {
    // 如果文本已经包含中文字符，跳过翻译
    if (containsChineseCharacters(txt)) {
      return null;
    }
    return this.T?.Menu?.[txt] || this.T?.Menu?.[txt?.trim?.()];
  }

  constructor() {
    // 不需要翻译的CSS类列表
    this.excludeClass = ["lite-search-item-type"];
    // 记录已注册的观察者，便于后续管理
    this.observers = [];
  }

  /**
   * 检查是否需要跳过翻译
   * @param {HTMLElement} node DOM节点
   * @returns {boolean} 是否需要跳过
   */
  tSkip(node) {
    return shouldSkipNode(
      node,
      this.excludeClass,
      '.workflow-list, .workflow, .workflows, .file-list, .file-browser, .p-tree, .p-treenode, .p-inputtext'
    );
  }
  
    cleanupObservers() {
    try {
      this.observers.forEach(observer => {
        if (observer && typeof observer.disconnect === 'function') {
          observer.disconnect();
        }
      });
      this.observers = [];
    } catch (e) {
      error("清理观察者出错:", e);
    }
  }

  /**
   * Safe text replacement for Vue mode (Text nodes and attributes only)
   * @param {Node} target 
   */
  safeReplaceVue(target) {
    try {
      if (!target) return;
      if (!this.T) return;
      if (this.tSkip(target)) return;

      // Text Node
      if (target.nodeType === Node.TEXT_NODE) {
        if (target.nodeValue && !containsChineseCharacters(target.nodeValue)) {
          const translated = this.MT(target.nodeValue);
          if (translated) {
            target.nodeValue = translated;
          }
        }
        return;
      }

      // Element Node
      if (target.nodeType === Node.ELEMENT_NODE) {
        // Skip actual canvas elements
        if (target.tagName === 'CANVAS') return;

        // Attributes
        if (target.title && !containsChineseCharacters(target.title)) {
          const t = this.MT(target.title);
          if (t) target.title = t;
        }
        if (target.placeholder && !containsChineseCharacters(target.placeholder)) {
           const t = this.MT(target.placeholder);
           if (t) target.placeholder = t;
        }
        
        // Button values (if input type=button)
        if (target.tagName === "INPUT" && target.type === "button" && !containsChineseCharacters(target.value)) {
            const t = this.MT(target.value);
            if (t) target.value = t;
        }

        // Recurse
        if (target.childNodes && target.childNodes.length) {
            Array.from(target.childNodes).forEach(child => this.safeReplaceVue(child));
        }
      }
    } catch (e) {
      // error("Safe replace error:", e);
    }
  }
}

// 创建翻译执行器实例
let texe = new TExe();

function applyVueMenuTranslation(T) {
    try {
        // 1. Try comfyAPI i18n
        if (window.comfyAPI && window.comfyAPI.i18n && window.comfyAPI.i18n.addTranslations) {
            window.comfyAPI.i18n.addTranslations('zh-CN', T.Menu);
            return;
        }
        
        // Merge node input/widget terms (only snake_case) into menu dictionary for safe text replacement
        try {
          const extra = {};
          const nodes = T.Nodes || {};
          for (const cls in nodes) {
            const nt = nodes[cls];
            if (nt?.inputs) {
              for (const k in nt.inputs) {
                const v = nt.inputs[k];
                if (typeof v === 'string' && !extra[k] && k.includes('_')) extra[k] = v;
              }
            }
            if (nt?.widgets) {
              for (const k in nt.widgets) {
                const v = nt.widgets[k];
                if (typeof v === 'string' && !extra[k] && k.includes('_')) extra[k] = v;
              }
            }
          }
          texe.T.Menu = Object.assign({}, texe.T.Menu || {}, extra);
        } catch (e) {}
        // 2. Fallback: Targeted MutationObservers (avoid sidebar/workflow list)
        const targets = [
          document.querySelector('.litegraph'),
          document.querySelector('.comfyui-menu'),
          document.querySelector('.comfy-menu'),
          ...Array.from(document.querySelectorAll('.comfyui-popup')),
          ...Array.from(document.querySelectorAll('.comfy-modal')),
          ...Array.from(document.querySelectorAll('.p-dialog'))
        ].filter(Boolean);

        targets.forEach(t => {
          texe.safeReplaceVue(t);
          const obs = observeFactory(t, (mutationsList) => {
            for (let mutation of mutationsList) {
              if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => texe.safeReplaceVue(node));
              } else if (mutation.type === 'characterData') {
                texe.safeReplaceVue(mutation.target);
              } else if (mutation.type === 'attributes') {
                texe.safeReplaceVue(mutation.target);
              }
            }
          }, true);
          if (obs) texe.observers.push(obs);
        });

        
    } catch (e) {
        error("Vue mode translation failed:", e);
    }
}

export function applyMenuTranslation(T) {
  try {
    texe.cleanupObservers();
    texe.T = T;
    applyVueMenuTranslation(T);
  } catch (e) {
    error("应用菜单翻译出错:", e);
  }
}

/**
 * 观察者工厂函数
 * @param {HTMLElement} observeTarget 观察目标
 * @param {Function} fn 回调函数
 * @param {boolean} subtree 是否观察子树
 * @returns {MutationObserver} 观察者实例
 */
export function observeFactory(observeTarget, fn, subtree = false) {
  if (!observeTarget) return null;
  try {
    const observer = new MutationObserver(function (mutationsList, observer) {
      fn(mutationsList, observer);
    });

    observer.observe(observeTarget, {
      childList: true,
      attributes: true,
      subtree: subtree,
    });
    return observer;
  } catch (e) {
    error("创建观察者出错:", e);
    return null;
  }
}

/**
 * 处理模态框节点
 * @param {HTMLElement} node 模态框节点
 */
 

/**
 * 处理ComfyUI新版UI菜单
 * @param {MutationRecord[]} mutationsList 变更记录列表
 */
 

 

/**
 * 处理视图队列和Comfy列表观察者
 * @param {MutationRecord[]} mutationsList 变更记录列表
 */
 

/**
 * 处理设置对话框
 */
 

/**
 * 处理新版设置观察者
 * @param {MutationRecord[]} mutationsList 变更记录列表
 */
 

/**
 * 翻译设置对话框
 * @param {HTMLElement} comfySettingDialog 设置对话框
 */
 

/**
 * 设置搜索框观察者
 */
 
