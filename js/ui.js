import { getUIPosition, setUIPosition } from "./utils.js";

export function ensureTranslationModeToggleButton(isEnabled, onToggle) {
  const buttonId = "dd-translation-mode-toggle";
  let button = document.getElementById(buttonId);

  // 状态样式配置
  const styles = {
    addon: {
      bg: "#ffffff",
      hover: "#f5f5f5",
      text: "#333",
      border: "1px solid #e5e7eb"
    },
    official: {
      bg: "#ffffff",
      hover: "#f5f5f5",
      text: "#333",
      border: "1px solid #e5e7eb"
    }
  };
  const currentStyle = isEnabled ? styles.addon : styles.official;
  const labelText = isEnabled ? "附加翻译已开启" : "官方翻译已开启";

  // SVG 图标定义
  const svgBlue = `
  <svg t="1769244007902" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6302" width="20" height="20">
    <path d="M315.733333 213.333333a32 32 0 0 1 64 0v9.216H512a32 32 0 0 1 0 64h-51.328c-15.786667 43.946667-40.32 85.034667-67.626667 122.026667l38.528 40.064a32 32 0 0 1-46.08 44.373333l-33.066666-34.346666c-25.685333 29.013333-52.053333 54.997333-75.861334 76.885333a32 32 0 1 1-43.264-47.104 965.632 965.632 0 0 0 76.16-77.909333c-5.333333-6.826667-10.666667-13.952-15.658666-20.906667-10.069333-13.909333-20.394667-29.312-25.6-40.576a32 32 0 0 1 57.984-27.050667c2.389333 5.205333 9.386667 16.213333 19.541333 30.250667 1.450667 2.048 3.072 4.096 4.608 6.144 16.213333-23.168 30.421333-47.274667 41.344-71.850667H213.333333a32 32 0 0 1 0-64h102.4V213.333333z" fill="#1296db" p-id="6303"></path>
    <path d="M906.666667 618.666667c0-70.912-0.042667-121.301333-4.608-159.957334-4.48-37.930667-12.928-60.373333-26.88-77.354666a139.093333 139.093333 0 0 0-19.2-19.2c-22.698667-18.645333-54.528-27.008-118.058667-29.952l-405.76 404.821333c2.901333 64.128 11.264 96.128 29.952 118.912 5.76 7.04 12.245333 13.525333 19.242667 19.285333 16.981333 13.909333 39.424 22.314667 77.354666 26.837334 38.656 4.565333 89.045333 4.608 159.957334 4.608s121.301333-0.042667 159.957333-4.608c37.930667-4.48 60.373333-12.928 77.354667-26.88 6.997333-5.717333 13.482667-12.202667 19.2-19.2 13.952-16.981333 22.357333-39.424 26.88-77.354667 4.565333-38.656 4.608-89.045333 4.608-159.957333z m64 0c0 69.333333 0 124.16-5.12 167.466666-5.162667 43.946667-16.042667 80.213333-40.874667 110.464a202.666667 202.666667 0 0 1-28.074667 28.074667c-30.293333 24.832-66.474667 35.712-110.506666 40.917333-43.264 5.12-98.090667 5.077333-167.424 5.077334s-124.16 0-167.466667-5.12c-43.946667-5.162667-80.213333-16.042667-110.464-40.874667a202.666667 202.666667 0 0 1-28.074667-28.074667c-30.122667-36.693333-40.021333-82.688-43.648-141.653333-58.922667-3.626667-104.917333-13.525333-141.610666-43.605333a202.666667 202.666667 0 0 1-28.074667-28.074667c-24.832-30.293333-35.712-66.474667-40.917333-110.506667-5.12-43.264-5.077333-98.090667-5.077334-167.424s0-124.16 5.12-167.466666c5.162667-43.946667 16.042667-80.213333 40.874667-110.464 8.405333-10.24 17.834667-19.626667 28.074667-28.074667 30.293333-24.832 66.474667-35.712 110.506666-40.917333C281.173333 53.333333 335.957333 53.333333 405.333333 53.333333s124.16 0 167.466667 5.12c43.946667 5.162667 80.213333 16.042667 110.464 40.874667 10.24 8.405333 19.626667 17.834667 28.074667 28.074667 30.08 36.693333 39.936 82.645333 43.605333 141.568 58.965333 3.626667 104.96 13.568 141.653333 43.690666 10.24 8.405333 19.626667 17.834667 28.074667 28.074667 24.832 30.293333 35.712 66.474667 40.917333 110.506667 5.12 43.264 5.077333 98.090667 5.077334 167.424z m-853.333334-213.333334c0 70.912 0.042667 121.301333 4.608 159.957334 4.48 37.930667 12.928 60.373333 26.88 77.354666 5.717333 6.997333 12.202667 13.482667 19.2 19.2 22.784 18.730667 54.826667 27.050667 118.912 29.952l404.906667-403.925333c-2.858667-64.725333-11.178667-96.938667-29.952-119.850667a139.093333 139.093333 0 0 0-19.242667-19.2c-16.981333-13.952-39.424-22.4-77.354666-26.88-38.656-4.565333-89.045333-4.608-159.957334-4.608s-121.301333 0.042667-159.957333 4.608c-37.930667 4.48-60.373333 12.928-77.354667 26.88a139.093333 139.093333 0 0 0-19.2 19.2c-13.952 16.981333-22.4 39.424-26.88 77.354667-4.565333 38.656-4.608 89.045333-4.608 159.957333z" fill="#1296db" p-id="6304"></path>
    <path d="M661.333333 522.666667a32 32 0 0 1 29.525334 19.712l106.666666 256a32 32 0 0 1-59.050666 24.576l-27.349334-65.621334h-99.584l-27.306666 65.621334a32 32 0 0 1-59.093334-24.576l106.666667-256a32 32 0 0 1 29.525333-19.712z m-23.125333 170.666666h46.250667l-23.125334-55.466666-23.125333 55.466666z" fill="#1296db" p-id="6305"></path>
  </svg>
  `;

  const svgGreen = `
  <svg t="1769244007902" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6302" width="20" height="20">
    <path d="M315.733333 213.333333a32 32 0 0 1 64 0v9.216H512a32 32 0 0 1 0 64h-51.328c-15.786667 43.946667-40.32 85.034667-67.626667 122.026667l38.528 40.064a32 32 0 0 1-46.08 44.373333l-33.066666-34.346666c-25.685333 29.013333-52.053333 54.997333-75.861334 76.885333a32 32 0 1 1-43.264-47.104 965.632 965.632 0 0 0 76.16-77.909333c-5.333333-6.826667-10.666667-13.952-15.658666-20.906667-10.069333-13.909333-20.394667-29.312-25.6-40.576a32 32 0 0 1 57.984-27.050667c2.389333 5.205333 9.386667 16.213333 19.541333 30.250667 1.450667 2.048 3.072 4.096 4.608 6.144 16.213333-23.168 30.421333-47.274667 41.344-71.850667H213.333333a32 32 0 0 1 0-64h102.4V213.333333z" fill="#16a34a" p-id="6303"></path>
    <path d="M906.666667 618.666667c0-70.912-0.042667-121.301333-4.608-159.957334-4.48-37.930667-12.928-60.373333-26.88-77.354666a139.093333 139.093333 0 0 0-19.2-19.2c-22.698667-18.645333-54.528-27.008-118.058667-29.952l-405.76 404.821333c2.901333 64.128 11.264 96.128 29.952 118.912 5.76 7.04 12.245333 13.525333 19.242667 19.285333 16.981333 13.909333 39.424 22.314667 77.354666 26.837334 38.656 4.565333 89.045333 4.608 159.957334 4.608s121.301333-0.042667 159.957333-4.608c37.930667-4.48 60.373333-12.928 77.354667-26.88 6.997333-5.717333 13.482667-12.202667 19.2-19.2 13.952-16.981333 22.357333-39.424 26.88-77.354667 4.565333-38.656 4.608-89.045333 4.608-159.957333z m64 0c0 69.333333 0 124.16-5.12 167.466666-5.162667 43.946667-16.042667 80.213333-40.874667 110.464a202.666667 202.666667 0 0 1-28.074667 28.074667c-30.293333 24.832-66.474667 35.712-110.506666 40.917333-43.264 5.12-98.090667 5.077333-167.424 5.077334s-124.16 0-167.466667-5.12c-43.946667-5.162667-80.213333-16.042667-110.464-40.874667a202.666667 202.666667 0 0 1-28.074667-28.074667c-30.122667-36.693333-40.021333-82.688-43.648-141.653333-58.922667-3.626667-104.917333-13.525333-141.610666-43.605333a202.666667 202.666667 0 0 1-28.074667-28.074667c-24.832-30.293333-35.712-66.474667-40.917333-110.506667-5.12-43.264-5.077333-98.090667-5.077334-167.424s0-124.16 5.12-167.466666c5.162667-43.946667 16.042667-80.213333 40.874667-110.464 8.405333-10.24 17.834667-19.626667 28.074667-28.074667 30.293333-24.832 66.474667-35.712 110.506666-40.917333C281.173333 53.333333 335.957333 53.333333 405.333333 53.333333s124.16 0 167.466667 5.12c43.946667 5.162667 80.213333 16.042667 110.464 40.874667 10.24 8.405333 19.626667 17.834667 28.074667 28.074667 30.08 36.693333 39.936 82.645333 43.605333 141.568 58.965333 3.626667 104.96 13.568 141.653333 43.690666 10.24 8.405333 19.626667 17.834667 28.074667 28.074667 24.832 30.293333 35.712 66.474667 40.917333 110.506667 5.12 43.264 5.077333 98.090667 5.077334 167.424z m-853.333334-213.333334c0 70.912 0.042667 121.301333 4.608 159.957334 4.48 37.930667 12.928 60.373333 26.88 77.354666 5.717333 6.997333 12.202667 13.482667 19.2 19.2 22.784 18.730667 54.826667 27.050667 118.912 29.952l404.906667-403.925333c-2.858667-64.725333-11.178667-96.938667-29.952-119.850667a139.093333 139.093333 0 0 0-19.242667-19.2c-16.981333-13.952-39.424-22.4-77.354666-26.88-38.656-4.565333-89.045333-4.608-159.957334-4.608s-121.301333 0.042667-159.957333 4.608c-37.930667 4.48-60.373333 12.928-77.354667 26.88a139.093333 139.093333 0 0 0-19.2 19.2c-13.952 16.981333-22.4 39.424-26.88 77.354667-4.565333 38.656-4.608 89.045333-4.608 159.957333z" fill="#16a34a" p-id="6304"></path>
    <path d="M661.333333 522.666667a32 32 0 0 1 29.525334 19.712l106.666666 256a32 32 0 0 1-59.050666 24.576l-27.349334-65.621334h-99.584l-27.306666 65.621334a32 32 0 0 1-59.093334-24.576l106.666667-256a32 32 0 0 1 29.525333-19.712z m-23.125333 170.666666h46.250667l-23.125334-55.466666-23.125333 55.466666z" fill="#16a34a" p-id="6305"></path>
  </svg>
  `;
  
  const iconSvg = isEnabled ? svgGreen : svgBlue;

  // 如果按钮已存在，更新样式和状态
  if (button) {
    const textSpan = button.querySelector("span");
    if (textSpan) textSpan.textContent = labelText;
    button.style.background = currentStyle.bg;
    button.style.borderColor = currentStyle.border;
    button.dataset.mode = isEnabled ? "addon" : "official";
    
    // 更新图标
    const iconContainer = button.querySelector("div");
    if (iconContainer) {
        iconContainer.innerHTML = iconSvg;
    }
    
    return button;
  }

  // 创建按钮
  button = document.createElement("button");
  button.id = buttonId;
  button.type = "button";
  button.dataset.mode = isEnabled ? "addon" : "official";
  
  button.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; width: 20px; height: 20px;">${iconSvg}</div>
    <span style="margin-left: 8px; white-space: nowrap; overflow: hidden; opacity: 0; max-width: 0; transition: all 0.3s ease;">${labelText}</span>
  `;
    
  // 基础样式
  Object.assign(button.style, {
    position: "fixed",
    zIndex: "100",
    padding: "0", // Reset padding to handle layout manually or via flex
    width: "40px", // Initial circle size
    height: "40px",
    borderRadius: "20px",
    border: currentStyle.border,
    background: currentStyle.bg,
    color: currentStyle.text,
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer", // 默认手型，提示可点击
    backdropFilter: "blur(8px)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: "width 0.3s ease, background 0.2s", // Width transition for expansion
    userSelect: "none",
    fontFamily: "system-ui, -apple-system, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // 改为居中，确保收起时图标居中
    overflow: "hidden",
    paddingLeft: "0", // 移除默认的左内边距
    paddingRight: "0"
  });

  // 封装更新对齐方式的函数
  const updateButtonAlign = (left, top) => {
    const winWidth = window.innerWidth;
    // 只要不是紧贴左边缘（< 100px），就默认为右侧模式（向左展开），以避让右侧可能存在的UI组件
    const isRightSide = left > 100;
    
    if (isRightSide) {
        // 右侧模式：使用 right 定位
        const rightDist = winWidth - left - 40; 
        button.style.left = "auto";
        button.style.right = `${rightDist}px`;
        button.style.top = `${top}px`;
        
        button.style.flexDirection = "row-reverse";
        button.style.justifyContent = "flex-start"; // 展开时改为 flex-start
        button.style.paddingLeft = "0";
        button.style.paddingRight = "8px"; 
        button.dataset.align = "right";
    } else {
        // 左侧模式：使用 left 定位
        button.style.right = "auto";
        button.style.left = `${left}px`;
        button.style.top = `${top}px`;
        
        button.style.flexDirection = "row";
        button.style.justifyContent = "flex-start"; // 展开时改为 flex-start
        button.style.paddingLeft = "8px";
        button.style.paddingRight = "0";
        button.dataset.align = "left";
    }
    
    // 更新内部文字 margin
    const span = button.querySelector("span");
    if (span) {
        if (isRightSide) {
            span.style.marginLeft = "0";
            span.style.marginRight = "8px";
        } else {
            span.style.marginLeft = "8px";
            span.style.marginRight = "0";
        }
    }
  };

  // 读取并应用保存的位置
  const savedPos = getUIPosition();
  let hasSetPos = false;
  if (savedPos) {
    try {
      const { top, left, right, bottom } = JSON.parse(savedPos);
      
      // 尝试恢复并立即应用对齐逻辑
      let initialTop = "50%";
      let initialLeft = "12px";
      
      if (top !== undefined) initialTop = top;
      if (left !== undefined) initialLeft = left;
      
      // 处理 right/bottom 的情况，转换为 top/left 以便统一逻辑（如果需要的话）
      // 简单起见，我们优先信任 left/top，如果只有 right/bottom 则需要计算
      // 但之前的保存逻辑只保存了 left/top
      
      button.style.top = initialTop;
      button.style.left = initialLeft;
      
      // 立即计算对齐
      // 注意：此时 button 可能还未 append 到 body，getComputedStyle 可能拿不到像素值
      // 但 savedPos 里的值通常是 px 结尾的字符串
      const leftVal = parseInt(initialLeft) || 12;
      const topVal = parseInt(initialTop) || (window.innerHeight / 2);
      
      updateButtonAlign(leftVal, topVal);
      
      hasSetPos = true;
    } catch (e) {
      // 解析失败
    }
  }
  
  if (!hasSetPos) {
      // 默认位置
      updateButtonAlign(12, window.innerHeight / 2);
      button.style.transform = "translateY(-50%)"; 
  }

  // 拖拽逻辑
  let isDragging = false;
  let hasMoved = false;
  let startX, startY;
  let initialLeft, initialTop;

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    hasMoved = false;
    startX = e.clientX;
    startY = e.clientY;

    const rect = button.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    // 拖动开始：强制收起、透明度降低、清除 right/bottom 定位
    button.style.right = "auto";
    button.style.bottom = "auto";
    button.style.left = `${initialLeft}px`;
    button.style.top = `${initialTop}px`;
    button.style.transform = "none";
    button.style.cursor = "grabbing";
    
    // 强制保持圆形和收起状态
    button.style.width = "40px";
    button.style.borderRadius = "20px";
    button.style.justifyContent = "center"; // 拖动时强制居中
    button.style.paddingLeft = "0"; // 重置padding，确保图标居中
    button.style.paddingRight = "0";
    button.style.opacity = "0.8"; // 拖动时半透明
    // 禁用过渡，使跟随更跟手
    button.style.transition = "none";

    const span = button.querySelector("span");
    if (span) {
      span.style.opacity = "0";
      span.style.maxWidth = "0";
      span.style.margin = "0"; // 重置文字margin
    }
    
    e.preventDefault();
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      hasMoved = true;
    }

    button.style.left = `${initialLeft + dx}px`;
    button.style.top = `${initialTop + dy}px`;
  };

  const onMouseUp = async (e) => {
    if (!isDragging) return;
    isDragging = false;
    button.style.cursor = "pointer";
    button.style.opacity = "1";
    button.style.transition = "width 0.3s ease, background 0.2s"; // 恢复过渡

    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);

    // 吸附边界检查
    const rect = button.getBoundingClientRect();
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    
    let newLeft = rect.left;
    let newTop = rect.top;

    // 吸附与边界限制 - 移除10px margin，允许完全贴边
    if (newLeft < 0) newLeft = 0;
    if (newLeft + 40 > winWidth) newLeft = winWidth - 40;
    if (newTop < 0) newTop = 0;
    if (newTop + rect.height > winHeight) newTop = winHeight - rect.height;

    // 使用统一的对齐更新逻辑
    updateButtonAlign(newLeft, newTop);
    
    if (hasMoved) {
        // 持久化保存坐标（依然保存 left/top 绝对值以便恢复时简单处理，加载时需复用判断逻辑）
        // 或者保存 align 状态？不，简单起见只存坐标，加载时再次判断即可。
        // 但这里我们保存的是当前的视觉位置
        const posData = JSON.stringify({ top: `${newTop}px`, left: `${newLeft}px` });
        await setUIPosition(posData);
    }
  };

  button.addEventListener("mousedown", onMouseDown);

  // Hover 展开效果
  button.addEventListener("mouseenter", () => {
    // 拖拽中不响应 hover
    if (isDragging) return;
    
    const mode = button.dataset.mode;
    button.style.background = mode === "addon" ? styles.addon.hover : styles.official.hover;
    
    const isRightAlign = button.dataset.align === "right";
    
    // 展开
    button.style.width = "150px"; // Approximate expanded width
    
    // 根据对齐方向设置 padding，确保图标位置不动，文字向另一侧展开
    button.style.justifyContent = "flex-start"; // 展开时改为 flex-start
    if (isRightAlign) {
        button.style.paddingLeft = "14px"; // 增加左侧内边距给文字
        button.style.paddingRight = "8px"; // 保持右侧图标边距
    } else {
        button.style.paddingRight = "14px"; // 增加右侧内边距给文字
        button.style.paddingLeft = "8px"; // 保持左侧图标边距
    }
    
    const span = button.querySelector("span");
    if (span) {
      span.style.opacity = "1";
      span.style.maxWidth = "200px";
    }
  });
  
  button.addEventListener("mouseleave", () => {
    // 拖拽中不响应 hover leave
    if (isDragging) return;

    const mode = button.dataset.mode;
    button.style.background = mode === "addon" ? styles.addon.bg : styles.official.bg;
    
    const isRightAlign = button.dataset.align === "right";

    // 收起
    button.style.width = "40px";
    button.style.justifyContent = "center"; // 收起时恢复居中
    if (isRightAlign) {
        button.style.paddingLeft = "0";
        button.style.paddingRight = "8px";
    } else {
        button.style.paddingRight = "0";
        button.style.paddingLeft = "8px";
    }
    
    const span = button.querySelector("span");
    if (span) {
      span.style.opacity = "0";
      span.style.maxWidth = "0";
    }
  });

  // 点击事件
  button.addEventListener("click", async (e) => {
    if (hasMoved || button.disabled) return;
    
    button.disabled = true;
    button.style.opacity = "0.7";
    
    try {
      await onToggle();
    } finally {
      button.disabled = false;
      button.style.opacity = "1";
    }
  });

  document.body.appendChild(button);
  return button;
}
