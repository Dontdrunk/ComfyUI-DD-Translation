/**
 * ComfyUI-DD-Translation 工具模块
 */

/**
 * 错误日志函数
 * @param  {...any} args 错误信息参数
 */
export function error(...args) {
    console.error("[DD-Translation]", ...args);
}

/**
 * 检查文本是否包含中文字符
 * @param {string} text 要检查的文本
 * @returns {boolean} 是否包含中文字符
 */
export function containsChineseCharacters(text) {
    if (!text) return false;
    const chineseRegex = /[\u4e00-\u9fff\uf900-\ufaff\u3000-\u303f]/;
    return chineseRegex.test(text);
}

/**
 * 检查文本是否看起来已经被翻译过
 * @param {string} originalName 原始英文名称
 * @param {string} currentLabel 当前显示标签
 * @returns {boolean} 是否已被翻译
 */
export function isAlreadyTranslated(originalName, currentLabel) {
    if (!originalName || !currentLabel) return false;
    
    if (currentLabel !== originalName && containsChineseCharacters(currentLabel)) {
        return true;
    }
    
    if (currentLabel !== originalName && 
        currentLabel !== originalName.toLowerCase() &&
        currentLabel !== originalName.toUpperCase()) {
        return true;
    }
    
    return false;
}

/**
 * 检查对象是否有原生翻译
 * @param {Object} obj 要检查的对象
 * @param {string} property 要检查的属性名
 * @param {string} [originalValue] 原始值（用于更精确的检查）
 * @returns {boolean} 是否有原生翻译
 */
export function hasNativeTranslation(obj, property, originalValue = null) {
    if (!obj || !obj[property]) return false;
    
    // 如果包含中文字符，认为是原生翻译
    if (containsChineseCharacters(obj[property])) {
        return true;
    }
    
    // 如果提供了原始值，检查是否已经被修改
    if (originalValue && obj[property] !== originalValue) {
        return true;
    }
    
    return false;
}

/**
 * 不需要翻译的设置项列表
 */
export const nativeTranslatedSettings = [
    "Comfy", "画面", "外观", "3D", "遮罩编辑器",
];

// 存储当前翻译状态
let currentTranslationEnabled = true;
let currentNeedUIComponent = true;
let currentUIPosition = null;

/**
 * 从配置文件获取翻译状态
 */
async function loadConfig() {
    try {
        const response = await fetch("./agl/get_config");
        if (response.ok) {
            const config = await response.json();
            currentTranslationEnabled = config.translation_enabled ?? true;
            currentNeedUIComponent = config.need_ui_component ?? true;
            currentUIPosition = config.ui_position ?? null;
            return config;
        }
    } catch (e) {
        error("获取配置失败:", e);
    }
    return { translation_enabled: true, need_ui_component: true, ui_position: null };
}

/**
 * 保存翻译状态到配置文件
 */
async function saveConfig(configPatch) {
    try {
        const formData = new FormData();
        if (configPatch && typeof configPatch === "object") {
            for (const key of Object.keys(configPatch)) {
                const value = configPatch[key];
                if (value === undefined || value === null) continue;
                formData.append(key, String(value));
            }
        }

        const response = await fetch("./agl/set_config", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                if (typeof result.translation_enabled === "boolean") {
                    currentTranslationEnabled = result.translation_enabled;
                }
                if (typeof result.need_ui_component === "boolean") {
                    currentNeedUIComponent = result.need_ui_component;
                }
                if (result.ui_position !== undefined) {
                    currentUIPosition = result.ui_position;
                }
                return true;
            }
        }
    } catch (e) {
        error("保存配置失败:", e);
    }
    return false;
}

/**
 * 检查翻译是否启用
 */
export function isTranslationEnabled() {
    return currentTranslationEnabled;
}

export function isNeedUIComponentEnabled() {
    return currentNeedUIComponent;
}

export function getUIPosition() {
    return currentUIPosition;
}

export async function setUIPosition(pos) {
    // pos string format "top,left" or similar
    currentUIPosition = pos;
    // Debounce save or save immediately? Save immediately for now as drag ends once.
    await saveConfig({ ui_position: pos });
}

/**
 * 初始化配置
 */
export async function initConfig() {
    await loadConfig();
}

export async function setTranslationEnabled(enabled) {
    const success = await saveConfig({ translation_enabled: enabled });
    if (success) {
        setTimeout(() => location.reload(), 100);
    } else {
        error("设置翻译状态失败");
    }
}

/**
 * 切换翻译状态
 */
export async function toggleTranslation() {
    const newEnabled = !currentTranslationEnabled;
    await setTranslationEnabled(newEnabled);
}

export async function setNeedUIComponentEnabled(enabled) {
    const success = await saveConfig({ need_ui_component: enabled });
    if (success) {
        setTimeout(() => location.reload(), 100);
    } else {
        error("切换前端UI组件失败");
    }
}

/**
 * Check if running in ComfyUI Nodes 2.0 (Vue) mode
 * @returns {boolean}
 */
export function isVueNodes2() {
    return typeof window.comfyAPI !== 'undefined';
}
export function applySuffixHeuristic(key) {
    if (!key || typeof key !== 'string') return null;
    const idx = key.lastIndexOf('_');
    if (idx <= 0) return null;
    const base = key.slice(0, idx);
    const suffix = key.slice(idx + 1);
    if (suffix === 'embeds') return `${base}嵌入`;
    if (suffix === 'args') return `${base}参数`;
    return null;
}

export function shouldSkipNode(node, extraClassList = [], extraClosestSelectors = '') {
    try {
        if (!node) return true;
        if (extraClassList.some(cls => node.classList?.contains(cls))) return true;
        const container = node.closest?.(extraClosestSelectors || '.workflow-list, .workflow, .workflows, .file-list, .file-browser, .p-tree, .p-treenode, .p-inputtext, .lite-search, .lite-searchbox, .litegraph-searchbox');
        if (container) return true;
        if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA' || node.isContentEditable) return true;
        return false;
    } catch {
        return false;
    }
}

/**
 * 创建观察者（可配置）
 * @param {HTMLElement} observeTarget
 * @param {Function} fn
 * @param {boolean} subtree
 * @param {Object} options
 * @returns {MutationObserver|null}
 */
export function observeFactory(observeTarget, fn, subtree = false, options = {}) {
    if (!observeTarget) return null;
    try {
        const observer = new MutationObserver(function (mutationsList, observer) {
            fn(mutationsList, observer);
        });
        const defaultOpts = { childList: true, attributes: true, subtree, characterData: false };
        const observeOptions = Object.assign(defaultOpts, options || {});
        observer.observe(observeTarget, observeOptions);
        return observer;
    } catch (e) {
        error("创建观察者出错:", e);
        return null;
    }
}
