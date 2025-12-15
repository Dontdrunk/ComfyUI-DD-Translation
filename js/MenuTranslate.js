import { 
  containsChineseCharacters, 
  nativeTranslatedSettings,
  error,
  isVueNodes2,
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
      '.workflow-list, .workflow, .workflows, .file-list, .file-browser, .p-tree, .p-treenode, .p-inputtext, .litesearchbox, .comfy-search-box, .p-autocomplete-panel, .comfy-menu-search, .search-box'
    );
  }
  translateKjPopDesc(node) {
    try {
      let T = this.T;
      if (!T) return false;
      if (!node || !node.querySelectorAll) return false;
      if (!node?.classList?.contains("kj-documentation-popup")) return false;
      
      const allElements = node.querySelectorAll("*");
      for (const ele of allElements) {
        this.replaceText(ele);
      }
      
      return true;
    } catch (e) {
      error("翻译KJ弹窗出错:", e);
      return false;
    }
  }
  translateAllText(node) {
    try {
      let T = this.T;
      if (!T) return;
      if (!node || !node.querySelectorAll) return;
      
      const allElements = node.querySelectorAll("*");
      for (const ele of allElements) {
        if (ele.textContent && nativeTranslatedSettings.includes(ele.textContent)) {
          continue;
        }
        this.replaceText(ele);
      }
    } catch (e) {
      error("翻译所有文本出错:", e);
    }
  }

  /**
   * 替换文本内容为翻译后的文本
   * @param {Node} target 目标节点
   */
  replaceText(target) {
    try {
      if (!target) return;
      if (!this.T) return;
      if (this.tSkip(target)) return;
      
      // 如果节点的内容是原生已翻译的设置项，跳过翻译
      if (target.textContent && nativeTranslatedSettings.includes(target.textContent)) {
        return;
      }
      
      // 处理子节点
      if (target.childNodes && target.childNodes.length) {
        // 创建一个副本来遍历，避免在遍历过程中修改导致问题
        const childNodes = Array.from(target.childNodes);
        for (const childNode of childNodes) {
          this.replaceText(childNode);
        }
      }
      
      // 处理当前节点
      if (target.nodeType === Node.TEXT_NODE) {
        // 文本节点
        if (target.nodeValue && !containsChineseCharacters(target.nodeValue)) {
          const translated = this.MT(target.nodeValue);
          if (translated) {
            target.nodeValue = translated;
          }
        }
      } else if (target.nodeType === Node.ELEMENT_NODE) {
        // 元素节点
        
        // 处理 title 属性
        if (target.title && !containsChineseCharacters(target.title)) {
          const titleTranslated = this.MT(target.title);
          if (titleTranslated) {
            target.title = titleTranslated;
          }
        }

        // 处理按钮值
        if (target.nodeName === "INPUT" && target.type === "button" && 
            !containsChineseCharacters(target.value)) {
          const valueTranslated = this.MT(target.value);
          if (valueTranslated) {
            target.value = valueTranslated;
          }
        }

        // 处理文本内容
        if (target.innerText && !containsChineseCharacters(target.innerText)) {
          const innerTextTranslated = this.MT(target.innerText);
          if (innerTextTranslated) {
            target.innerText = innerTextTranslated;
          }
        }
        
        // 处理select和option元素
        if (target.nodeName === "SELECT") {
          // 确保翻译下拉框中的选项
          Array.from(target.options).forEach(option => {
            if (option.text && !containsChineseCharacters(option.text)) {
              const optionTextTranslated = this.MT(option.text);
              if (optionTextTranslated) {
                option.text = optionTextTranslated;
              }
            }
          });
        }
      }
    } catch (e) {
      error("替换文本出错:", e);
    }
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
    
    if (isVueNodes2()) {
        applyVueMenuTranslation(T);
        return;
    }
    return;
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
function handleComfyNewUIMenu(mutationsList) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => texe.translateAllText(node));
    } else if (mutation.type === 'attributes' || mutation.type === 'characterData') {
      texe.replaceText(mutation.target);
    }
  }
}

 

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
 
