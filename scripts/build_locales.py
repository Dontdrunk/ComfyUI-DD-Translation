# -*- coding: utf-8 -*-
r"""把 zh-CN 旧格式翻译转换成 ComfyUI 官方 locales 格式。

用法:
    python scripts/build_locales.py ^
        --old "C:\Users\Dontdrunk\Desktop\ComfyUI-DD-Translation\zh-CN" ^
        --inventory inventory/node_slots_snapshot.json ^
        --extra scripts/manual_zh.json ^
        --out locales/zh

- inventory: ComfyUI 实例导出的真实槽位 + 下拉选项值（没有则退化为旧格式映射）
- extra: 旧仓库里没有的插件（DLSS / S3-IO / Text_Translation）手工翻译
"""
import argparse
import collections
import glob
import json
import os
import re

OPTION_VOCAB = {
    # 插值 / 缩放
    "linear": "线性", "nearest": "最近邻", "nearest-exact": "最近邻(精确)",
    "bilinear": "双线性", "bicubic": "双三次", "area": "区域", "lanczos": "Lanczos",
    "box": "盒式", "stretch": "拉伸", "keep proportion": "保持比例",
    "fill / crop": "填充/裁剪", "pad": "补边", "crop": "裁剪", "resize": "缩放",
    "edge": "边缘", "edge_pixel": "边缘像素", "pad_edge": "补边", "pad_edge_pixel": "边缘补边",
    "total_pixels": "总像素", "match_input": "匹配输入", "match_original": "匹配原始",
    # 缓动 / 转场
    "ease_in": "缓入", "ease_out": "缓出", "ease_in_out": "缓入缓出",
    "bounce": "弹跳", "elastic": "弹性", "glitchy": "故障风",
    "exponential_ease_out": "指数缓出", "linear_blend": "线性混合",
    "filmic_crossfade": "电影交叉淡化", "perceptual_crossfade": "感知交叉淡化",
    "fade": "淡入淡出", "fade_linear": "线性淡化", "fade_smooth": "平滑淡化",
    "horizontal slide": "水平滑动", "vertical slide": "垂直滑动",
    "horizontal door": "水平门", "vertical door": "垂直门",
    # 方向
    "left": "左", "right": "右", "up": "上", "down": "下", "center": "居中",
    "top": "顶部", "bottom": "底部", "all": "全部",
    # 形状
    "circle": "圆形", "square": "正方形", "triangle": "三角形", "convex_polygons": "凸多边形",
    # 运算
    "add": "相加", "subtract": "相减", "multiply": "相乘", "difference": "差值",
    "divide": "相除", "modulo": "取模", "power": "幂",
    "overlay": "叠加", "replace": "替换", "insert": "插入", "combine": "组合",
    "concat": "拼接", "cut": "剪切", "list": "列表", "batch": "批次",
    "==": "==", "!=": "!=", "<": "<", ">": ">", "<=": "<=", ">=": ">=",
    # 通用
    "default": "默认", "none": "无", "None": "无", "auto": "自动", "Auto": "自动",
    "Default": "默认", "disabled": "禁用", "enabled": "启用", "always": "总是", "never": "从不",
    "true": "是", "false": "否",
    "cpu": "CPU", "gpu": "GPU", "CPU": "CPU", "GPU": "GPU",
    "main_device": "主设备", "target": "目标", "source": "来源",
    "state": "状态", "tensor": "张量", "pandas series": "Pandas 序列",
    "when empty": "为空时", "new_images": "新图像", "default_to_black": "默认黑色",
    "pillarbox_blur": "竖幅模糊", "nvidia_rtx_vsr": "NVIDIA RTX VSR",
    # 颜色 / 画面
    "red": "红", "green": "绿", "blue": "蓝", "white": "白", "gray": "灰",
    "alpha": "透明通道", "color": "颜色", "grid": "网格", "single": "单张",
    "multi_panel": "多面板", "collage": "拼贴", "low quality": "低质量",
    "logc3": "LogC3", "srgb": "sRGB",
    # ControlNet 提示
    "canny": "Canny 边缘", "tile": "分块", "depth": "深度", "blur": "模糊", "pose": "姿态",
    # 精度
    "fp16": "FP16", "bf16": "BF16", "fp32": "FP32", "float32": "FP32",
    "float16": "FP16", "bfloat16": "BF16", "fp8_e4m3fn": "FP8 e4m3fn",
    "fp8_e4m3fn_fast": "FP8 e4m3fn(快速)", "fp8_e5m2": "FP8 e5m2",
    # 注意力 / 推理
    "sdpa": "SDPA", "sageattn": "SageAttention", "xformers": "xFormers",
    "flashattn": "FlashAttention", "flux2": "Flux2",
    "inductor": "Inductor", "cudagraphs": "CUDA 图表",
    "max-autotune": "最大自动调优",
    "max-autotune-no-cudagraphs": "最大自动调优(无 CUDA 图表)",
    "reduce-overhead": "降低开销", "alloc": "预分配",
    # VAE
    "taesd": "TAESD", "taesdxl": "TAESDXL", "taef1": "TAEF1",
    "pixel_space": "像素空间", "offload_device": "卸载设备",
    # 检测框
    "xywh": "XYWH", "xyxy": "XYXY", "BCHW": "BCHW", "BCTHW": "BCTHW", "BTCHW": "BTCHW",
    "JPEG": "JPEG", "PNG": "PNG",
    # 色彩迁移
    "hm": "直方图匹配", "mkl": "MKL", "mvgd": "MVGD", "reinhard": "Reinhard",
    "hm-mvgd-hm": "直方图/MVGD/直方图", "hm-mkl-hm": "直方图/MKL/直方图",
    "reinhard_lab_gpu": "Reinhard Lab (GPU)",
    # 调度 / 队列 / 窗口
    "on_empty_queue": "队列空闲时", "on_change": "变更时", "python": "Python",
    "start": "开始", "stop": "结束", "standard": "标准", "full": "完整",
    "adaptive_ratio": "自适应比例", "adaptive_quantile": "自适应分位",
    "adaptive_energy": "自适应能量", "adaptive_fro": "自适应 Frobenius",
    "svd_linalg": "SVD 线性代数", "svd_lowrank": "SVD 低秩",
    "sv_ratio": "奇异值比例", "sv_cumulative": "奇异值累积",
    "sv_fro": "奇异值 Frobenius", "sv_knee": "奇异值拐点",
    "max_count": "最大数量", "trim_start": "裁剪开头", "trim_end": "裁剪结尾", "keep_end": "保留结尾",
    "pixel": "像素", "latent": "Latent",
    "standard_static": "标准静态", "standard_static_balanced": "标准静态(均衡)",
    "standard_uniform": "标准均匀", "looped_uniform": "循环均匀",
    "batched": "分批", "batched_shifted": "分批(偏移)", "pyramid": "金字塔",
    "relative": "相对", "flat": "平坦", "overlap-linear": "重叠-线性",
    "hann": "汉宁窗", "gaussian": "高斯",
    "object_patch_first": "对象补丁优先", "weight_patch_first": "权重补丁优先",
    "1.3B": "1.3B", "14B": "14B", "i2v_480": "图生视频 480p", "i2v_720": "图生视频 720p",
    # 音频 / 曲线
    "amplitude": "振幅", "path": "路径", "time": "时间", "controlpoints": "控制点",
    "speed": "速度", "cardinal": "基数样条", "monotone": "单调", "basis": "B 样条",
    "step-before": "阶梯(前)", "step-after": "阶梯(后)",
    "polar": "极坐标", "polar-reverse": "极坐标(反向)", "bezier": "贝塞尔",
    "string": "字符串",
    # 文件格式
    "mp4": "MP4", "mkv": "MKV", "webm": "WebM", "mov": "MOV",
    "h264": "H.264", "av1": "AV1", "prores": "ProRes",
    "image/gif": "GIF", "image/webp": "WebP", "video/16bit-png": "PNG (16bit)",
    "video/8bit-png": "PNG (8bit)", "video/av1-webm": "AV1 WebM",
    "video/ffmpeg-gif": "GIF (ffmpeg)", "video/ffv1-mkv": "FFV1 MKV",
    "video/h264-mp4": "H.264 MP4", "video/h265-mp4": "H.265 MP4",
    "video/nvenc_av1-mp4": "AV1 MP4 (NVENC)", "video/nvenc_h264-mp4": "H.264 MP4 (NVENC)",
    "video/nvenc_hevc-mp4": "H.265 MP4 (NVENC)", "video/ProRes": "ProRes",
    "video/webm": "WebM",
    "AnimateDiff": "AnimateDiff", "Mochi": "Mochi", "LTXV": "LTXV",
    "Hunyuan": "Hunyuan", "Cosmos": "Cosmos", "Wan": "Wan", "H3": "H3",
}

DLSS_VOCAB = {
    "1× (DLAA / native)": "1× (DLAA/原生)", "1.5× (Quality)": "1.5× (质量)",
    "1.724× (Balanced)": "1.724× (均衡)", "2× (Performance)": "2× (性能)",
    "3× (Ultra Performance)": "3× (极致性能)",
    "Preset #1": "预设 #1", "Preset #2": "预设 #2", "Preset #3": "预设 #3",
    "Natural": "自然", "Cinematic": "电影",
    "Auto (Default)": "自动 (默认)", "Max": "最高", "Best": "最佳", "Good": "良好",
    "H.264": "H.264", "H.264 (NVIDIA NVENC)": "H.264 (NVIDIA NVENC)",
    "H.265": "H.265", "H.265 (NVIDIA NVENC)": "H.265 (NVIDIA NVENC)",
    "AV1": "AV1", "AV1 (NVIDIA NVENC)": "AV1 (NVIDIA NVENC)",
    "ProRes Proxy": "ProRes 代理", "MP4": "MP4", "MKV": "MKV", "MOV": "MOV",
    "Copy": "复制", "Custom": "自定义", "Native DLSSG": "原生 DLSSG", "Cascade": "级联",
}


OPTION_PLUGINS = {
    "ComfyUI-KJNodes",
    "ComfyUI-VideoHelperSuite",
    "ComfyUI-NVIDIA-DLSS-Frame-Interpolation",
    "ComfyUI-S3-IO",
    "ComfyUI_Text_Translation",
}


def plugin_of(mod):
    s = (mod or "").replace("\\", "/")
    i = s.find("custom_nodes/")
    if i < 0:
        return ""
    return s[i + len("custom_nodes/"):].split(".")[0].split("/")[0]


SETTING_ID_RE = re.compile(r"id\s*:\s*['\"]([^'\"]+)['\"]")
SETTING_TYPE_RE = re.compile(r"type\s*:")
SETTING_NAME_RE = re.compile(r"name\s*:\s*['\"]([^'\"]+)['\"]")
SETTING_TIP_RE = re.compile(r"tooltip\s*:\s*\n?\s*['\"]([^'\"]{3,400})['\"]")
SETTING_CAT_RE = re.compile(r"category\s*:\s*\[([^\]]{0,300})\]")
SETTING_OPT_RE = re.compile(r"options\s*:\s*\[([^\]]{0,400})\]")


def normalize_key(value):
    return value.replace(".", "_") if isinstance(value, str) else ""


def collect_settings(plugins_dir):
    """从各插件的 web/js 里扒出 settings 定义（id / name / tooltip / category / options）。"""
    found = {}
    if not plugins_dir or not os.path.isdir(plugins_dir):
        return found
    for plugin in sorted(os.listdir(plugins_dir)):
        for sub in ("web", "js"):
            root = os.path.join(plugins_dir, plugin, sub)
            if not os.path.isdir(root):
                continue
            for path in glob.glob(os.path.join(root, "**", "*.js"), recursive=True):
                try:
                    with open(path, encoding="utf-8", errors="ignore") as fh:
                        txt = fh.read()
                except OSError:
                    continue
                for match in SETTING_ID_RE.finditer(txt):
                    sid = match.group(1)
                    if "." not in sid:
                        continue
                    chunk = txt[match.start():match.start() + 1800]
                    if not SETTING_TYPE_RE.search(chunk):
                        continue
                    body = chunk.split("},")[0]
                    nm = SETTING_NAME_RE.search(body)
                    if not nm:
                        continue
                    cat = SETTING_CAT_RE.search(body)
                    cats = re.findall(r"['\"]([^'\"]+)['\"]", cat.group(1)) if cat else []
                    if not cats:
                        continue
                    opt = SETTING_OPT_RE.search(body)
                    opts = re.findall(r"['\"]([^'\"]+)['\"]", opt.group(1)) if opt else []
                    tip = SETTING_TIP_RE.search(body)
                    found.setdefault(sid, {
                        "id": sid,
                        "name": nm.group(1),
                        "tooltip": tip.group(1) if tip else "",
                        "category": cats,
                        "options": opts,
                    })
    return found


def clean(value):
    return value.replace("|", "\uff5c") if isinstance(value, str) else value


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--old", default="source/zh-CN", help="旧格式翻译源目录（默认 source/zh-CN）")
    ap.add_argument("--inventory", default="")
    ap.add_argument("--extra", default="")
    ap.add_argument("--out", required=True)
    ap.add_argument("--js-out", default="js/options_zh.js")
    ap.add_argument("--plugins-dir", default="", help="custom_nodes 目录，用来扒插件设置项")
    ap.add_argument("--manual-settings", default="scripts/manual_settings_zh.json")
    ap.add_argument("--pretty", action="store_true")
    args = ap.parse_args()

    old = {}
    files = 0
    for path in glob.glob(os.path.join(args.old, "Nodes", "*.json")):
        files += 1
        for cls, entry in load_json(path).items():
            old.setdefault(cls, {}).update(entry)

    inv = load_json(args.inventory) if args.inventory and os.path.exists(args.inventory) else {}
    extra = load_json(args.extra) if args.extra and os.path.exists(args.extra) else {}

    node_defs = {}
    stats = collections.Counter()
    for cls, entry in old.items():
        info = inv.get(cls)
        e = {}
        for field in ("title", "description"):
            if isinstance(entry.get(field), str) and entry[field]:
                e["display_name" if field == "title" else field] = clean(entry[field])

        src = {}
        for section in ("inputs", "widgets"):
            for key, val in (entry.get(section) or {}).items():
                if isinstance(val, str):
                    src[key] = val

        ins = {}
        if info:
            real = {s["k"] for s in info.get("slots", [])}
            combos = {s["k"]: s["o"] for s in info.get("slots", []) if s.get("o")}
            leftover = {}
            for key, val in src.items():
                if key in real:
                    ins.setdefault(key, {})["name"] = clean(val)
                    stats["slot"] += 1
                else:
                    leftover[key] = val
            for slot, values in combos.items():
                picked = {}
                for value in values:
                    if value in leftover:
                        picked[value] = clean(leftover[value])
                    elif value in DLSS_VOCAB:
                        picked[value] = DLSS_VOCAB[value]
                    elif value in OPTION_VOCAB:
                        picked[value] = OPTION_VOCAB[value]
                if picked:
                    ins.setdefault(slot, {})["options"] = picked
                    stats["option"] += len(picked)
                    stats["combo"] += 1
            for key, val in (entry.get("tooltips") or {}).items():
                if key in ins and isinstance(val, str):
                    ins[key]["tooltip"] = clean(val)
                    stats["tooltip"] += 1
            names = info.get("outputs") or []
            outs = {}
            for name, cn in (entry.get("outputs") or {}).items():
                if isinstance(cn, str) and names.count(name) == 1:
                    outs[str(names.index(name))] = {"name": clean(cn)}
                    stats["output"] += 1
            if outs:
                e["outputs"] = outs
        else:
            for key, val in src.items():
                ins.setdefault(key, {})["name"] = clean(val)
                stats["slot_guessed"] += 1
            for key, val in (entry.get("tooltips") or {}).items():
                if key in ins and isinstance(val, str):
                    ins[key]["tooltip"] = clean(val)
                    stats["tooltip"] += 1
            stats["uninstalled"] += 1

        if ins:
            e["inputs"] = ins
        node_defs[cls] = e

    # 旧仓库没有的插件：手工翻译 + 下拉选项
    for cls, entry in extra.items():
        info = inv.get(cls)
        merged = node_defs.setdefault(cls, {})
        if entry.get("display_name"):
            merged["display_name"] = entry["display_name"]
        if entry.get("description"):
            merged["description"] = entry["description"]
        ins = merged.setdefault("inputs", {})
        for slot, val in (entry.get("inputs") or {}).items():
            ins[slot] = dict(val)
        if info:
            for s in info.get("slots", []):
                if not s.get("o"):
                    continue
                picked = {}
                for value in s["o"]:
                    if value in DLSS_VOCAB:
                        picked[value] = DLSS_VOCAB[value]
                    elif value in OPTION_VOCAB:
                        picked[value] = OPTION_VOCAB[value]
                if picked:
                    ins.setdefault(s["k"], {})["options"] = picked
                    stats["option"] += len(picked)

    # 已安装但旧仓库没有词条的节点：只补下拉选项，不动标题
    for cls, info in inv.items():
        if plugin_of(info.get("module")) not in OPTION_PLUGINS:
            continue
        current = (node_defs.get(cls) or {}).get("inputs") or {}
        pending = {}
        for s in info.get("slots", []):
            if not s.get("o") or (current.get(s["k"]) or {}).get("options"):
                continue
            picked = {}
            for value in s["o"]:
                if value in DLSS_VOCAB:
                    picked[value] = DLSS_VOCAB[value]
                elif value in OPTION_VOCAB:
                    picked[value] = OPTION_VOCAB[value]
            if picked:
                pending[s["k"]] = picked
        if not pending:
            continue
        e = node_defs.setdefault(cls, {})
        ins = e.setdefault("inputs", {})
        for slot, picked in pending.items():
            ins.setdefault(slot, {})["options"] = picked
            stats["option"] += len(picked)
            stats["combo"] += 1

    for cls in list(node_defs):
        e = node_defs[cls]
        if not e.get("inputs") and not e.get("display_name"):
            del node_defs[cls]
        elif e.get("inputs") == {}:
            e.pop("inputs", None)

    cats = {}
    for path in glob.glob(os.path.join(args.old, "Categories", "*.json")):
        for key, val in load_json(path).items():
            if isinstance(val, str) and not key.startswith("__"):
                cats[key] = clean(val)

    # ---- 设置面板（settings.<id>.name / .tooltip / .options.<label>）----
    manual_settings = {}
    if args.manual_settings and os.path.exists(args.manual_settings):
        manual_settings = load_json(args.manual_settings)
    m_names = manual_settings.get("names") or {}
    m_cats = manual_settings.get("categories") or {}
    m_opts = manual_settings.get("options") or {}

    menu = {}
    for path in glob.glob(os.path.join(args.old, "Menus", "*.json")):
        for key, val in load_json(path).items():
            if isinstance(val, str):
                menu.setdefault(key, val)

    setting_defs = collect_settings(args.plugins_dir)
    for extra_def in (manual_settings.get("definitions") or []):
        sid = extra_def.get("id")
        # 手工定义优先：插件 JS 里的 category 常用 this.menuPrefix 拼接，
        # 自动抓取会丢掉 🪛 前缀和动态分段，这里用人工校正后的定义覆盖。
        if sid:
            setting_defs[sid] = {
                "id": sid,
                "name": extra_def.get("name", ""),
                "tooltip": extra_def.get("tooltip", ""),
                "category": extra_def.get("category") or [],
                "options": extra_def.get("options") or [],
            }
    m_tips = manual_settings.get("tooltips") or {}
    settings_out = {}
    settings_cats = {}
    for sid, definition in setting_defs.items():
        entry = {}
        name_zh = m_names.get(sid) or menu.get(definition["name"])
        if name_zh:
            entry["name"] = clean(name_zh)
        tip_zh = m_tips.get(sid)
        if not tip_zh and definition["tooltip"]:
            tip_zh = menu.get(definition["tooltip"])
        if tip_zh:
            entry["tooltip"] = clean(tip_zh)
        picked = {}
        manual_for = m_opts.get(sid) or {}
        for label in definition["options"]:
            zh = manual_for.get(label) or menu.get(label)
            if zh:
                picked[label] = clean(zh)
        for label, zh in manual_for.items():
            if label not in picked and isinstance(zh, str):
                picked[label] = clean(zh)
        if picked:
            entry["options"] = picked
        if entry:
            settings_out[normalize_key(sid)] = entry
        for segment in definition["category"]:
            zh = m_cats.get(segment) or menu.get(segment)
            if zh:
                settings_cats[segment] = clean(zh)

    os.makedirs(args.out, exist_ok=True)
    out_nodes = os.path.join(args.out, "nodeDefs.json")
    out_main = os.path.join(args.out, "main.json")
    kwargs = dict(ensure_ascii=False, indent=2 if args.pretty else None,
                  separators=None if args.pretty else (",", ":"))
    with open(out_nodes, "w", encoding="utf-8") as f:
        json.dump(node_defs, f, **kwargs)
        f.write("\n")
    main_payload = {"nodeCategories": dict(sorted(cats.items()))}
    if settings_cats:
        main_payload["settingsCategories"] = dict(sorted(settings_cats.items()))
    with open(out_main, "w", encoding="utf-8") as f:
        json.dump(main_payload, f, ensure_ascii=False,
                  indent=2 if args.pretty else None,
                  separators=None if args.pretty else (",", ":"))
        f.write("\n")
    if settings_out:
        out_settings = os.path.join(args.out, "settings.json")
        with open(out_settings, "w", encoding="utf-8") as f:
            json.dump(settings_out, f, ensure_ascii=False,
                      indent=2 if args.pretty else None,
                      separators=None if args.pretty else (",", ":"))
            f.write("\n")

    # 供 js/combo_labels.js 用的下拉显示映射（前端不读 nodeDefs.options）
    if args.js_out:
        options_js = {}
        for cls, entry in node_defs.items():
            slots = {slot: spec["options"]
                     for slot, spec in (entry.get("inputs") or {}).items()
                     if isinstance(spec, dict) and spec.get("options")}
            if slots:
                options_js[cls] = slots
        os.makedirs(os.path.dirname(args.js_out) or ".", exist_ok=True)
        with open(args.js_out, "w", encoding="utf-8") as fh:
            fh.write("// 由 scripts/build_locales.py 生成，勿手改\n")
            fh.write("export const OPTIONS = ")
            json.dump(options_js, fh, ensure_ascii=False, separators=(",", ":"))
            fh.write(";\n")
        print("下拉映射 js: %d 个节点 / %.0f KiB" % (
            len(options_js), os.path.getsize(args.js_out) / 1024))

    print("旧文件: %d | 节点类: %d" % (files, len(node_defs)))
    print("已安装对齐: %d | 未安装映射: %d" % (len(node_defs) - stats["uninstalled"], stats["uninstalled"]))
    print("槽位名: %d 对齐 + %d 推测" % (stats["slot"], stats["slot_guessed"]))
    print("下拉选项: %d 槽位 / %d 条" % (stats["combo"], stats["option"]))
    print("输出名: %d | tooltip: %d | 分类: %d" % (stats["output"], stats["tooltip"], len(cats)))
    print("设置面板: %d 个设置项 / %d 条分类" % (len(settings_out), len(settings_cats)))
    print("体积: nodeDefs %.0f KiB, main %.0f KiB" % (
        os.path.getsize(out_nodes) / 1024, os.path.getsize(out_main) / 1024))


if __name__ == "__main__":
    main()
