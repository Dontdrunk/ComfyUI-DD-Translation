import os
import json
import platform
import sys
import shutil
import atexit
import server
import folder_paths
from aiohttp import web
from pathlib import Path

VERSION = "1.9.13"
ADDON_NAME = "ComfyUI-DD-Translation"
COMFY_PATH = Path(folder_paths.__file__).parent
CUR_PATH = Path(__file__).parent

# 读取配置文件
def load_config():
    config_path = CUR_PATH.joinpath("config.json")
    if config_path.exists():
        try:
            config_data = try_get_json(config_path)
            return config_data.get("translation_enabled", True)
        except Exception:
            return True
    return True

# 全局配置变量
TRANSLATION_ENABLED = load_config()


def try_get_json(path: Path):
    for coding in ["utf-8", "gbk"]:
        try:
            return json.loads(path.read_text(encoding=coding))
        except Exception:
            continue
    return {}


def get_translation_by_type(locale, translation_type, fallback_file=None):
    """
    通用的翻译获取函数，减少代码重复
    
    Args:
        locale: 语言代码
        translation_type: 翻译类型 ('Nodes', 'Categories', 'Menus')
        fallback_file: 可选的回退文件名
    """
    translations = {}
    
    # 从目录中读取所有JSON文件
    type_path = CUR_PATH.joinpath(locale, translation_type)
    if type_path.exists():
        for json_file in type_path.glob("*.json"):
            translations.update(try_get_json(json_file))
    
    # 处理回退文件
    if fallback_file:
        fallback_path = CUR_PATH.joinpath(locale, fallback_file)
        if not fallback_path.exists():
            fallback_path = CUR_PATH.joinpath("en_US", fallback_file)
        if fallback_path.exists():
            translations.update(try_get_json(fallback_path))
    
    return translations


def get_nodes_translation(locale):
    """获取节点翻译"""
    return get_translation_by_type(locale, "Nodes")


def get_category_translation(locale):
    """获取分类翻译"""
    return get_translation_by_type(locale, "Categories", "NodeCategory.json")


def get_menu_translation(locale):
    """获取菜单翻译"""
    return get_translation_by_type(locale, "Menus", "Menu.json")


def compile_translation(locale):
    nodes_translation = get_nodes_translation(locale)
    node_category_translation = get_category_translation(locale)
    menu_translation = get_menu_translation(locale)

    return json.dumps({
        "Nodes": nodes_translation,
        "NodeCategory": node_category_translation,
        "Menu": menu_translation
    }, ensure_ascii=False)


def compress_json(data, method="gzip"):
    if method == "gzip":
        import gzip
        return gzip.compress(data.encode("utf-8"))
    return data


@server.PromptServer.instance.routes.post("/agl/get_translation")
async def get_translation(request: web.Request):
    post = await request.post()
    locale = post.get("locale", "en_US")
    accept_encoding = request.headers.get("Accept-Encoding", "")
    json_data = "{}"
    headers = {}

    # 实时检查配置文件中的翻译开关
    current_enabled = load_config()
    if not current_enabled:
        return web.Response(status=200, body=json_data, headers=headers)

    try:
        json_data = compile_translation(locale)
        if "gzip" in accept_encoding:
            json_data = compress_json(json_data, method="gzip")
            headers["Content-Encoding"] = "gzip"
    except Exception:
        pass

    return web.Response(status=200, body=json_data, headers=headers)


@server.PromptServer.instance.routes.get("/agl/get_config")
async def get_config(request: web.Request):
    # 实时读取配置文件
    current_enabled = load_config()
    config_data = {"translation_enabled": current_enabled}
    return web.Response(status=200, body=json.dumps(config_data), headers={"Content-Type": "application/json"})


@server.PromptServer.instance.routes.post("/agl/set_config")
async def set_config(request: web.Request):
    try:
        post = await request.post()
        enabled = post.get("translation_enabled", "true").lower() == "true"

        # 更新配置文件
        config_path = CUR_PATH.joinpath("config.json")
        config_data = {"translation_enabled": enabled}

        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(config_data, f, indent=2, ensure_ascii=False)

        # 更新全局变量
        global TRANSLATION_ENABLED
        TRANSLATION_ENABLED = enabled

        return web.Response(status=200, body=json.dumps({"success": True, "translation_enabled": enabled}),
                          headers={"Content-Type": "application/json"})
    except Exception as e:
        return web.Response(status=500, body=json.dumps({"success": False, "error": str(e)}),
                          headers={"Content-Type": "application/json"})


def rmtree(path: Path):
    if not path.exists():
        return
    if Path(path.resolve()).as_posix() != path.as_posix():
        path.unlink()
        return
    if path.is_file():
        path.unlink()
    elif path.is_dir():
        if path.name == ".git":
            if platform.system() == "darwin":
                from subprocess import call
                call(['rm', '-rf', path.as_posix()])
            elif platform.system() == "Windows":
                os.system(f'rd/s/q "{path.as_posix()}"')
            return
        for child in path.iterdir():
            rmtree(child)
        try:
            path.rmdir()
        except BaseException:
            pass


def register():
    import nodes
    aigodlike_ext_path = COMFY_PATH.joinpath("web", "extensions", ADDON_NAME)
    if hasattr(nodes, "EXTENSION_WEB_DIRS"):
        rmtree(aigodlike_ext_path)
        return
    
    try:
        if os.name == "nt":
            try:
                import _winapi
                _winapi.CreateJunction(CUR_PATH.as_posix(), aigodlike_ext_path.as_posix())
            except WindowsError:
                shutil.copytree(CUR_PATH.as_posix(), aigodlike_ext_path.as_posix(), ignore=shutil.ignore_patterns(".git"))
        else:
            shutil.copytree(CUR_PATH.as_posix(), aigodlike_ext_path.as_posix(), ignore=shutil.ignore_patterns(".git"))
    except Exception:
        pass


def unregister():
    aigodlike_ext_path = COMFY_PATH.joinpath("web", "extensions", ADDON_NAME)
    try:
        rmtree(aigodlike_ext_path)
    except BaseException:
        pass


register()
atexit.register(unregister)

NODE_CLASS_MAPPINGS = {}
WEB_DIRECTORY = "./js"
__all__ = ["NODE_CLASS_MAPPINGS", "WEB_DIRECTORY"]
__version__ = VERSION
