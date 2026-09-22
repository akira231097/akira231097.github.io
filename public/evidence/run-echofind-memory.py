"""Run unchanged EchoFind memory scripts without importing service clients.

The original engine/__init__.py eagerly imports the entire online RAG agent.
This substitutes only the package namespace, so memory.py and schemas.py are
still loaded verbatim from the checkout and all behavior remains original.
"""
import os
import pathlib
import runpy
import sys
import types

repo = pathlib.Path.cwd()
os.chdir(repo)
sys.path.insert(0, str(repo))
package = types.ModuleType("engine")
package.__path__ = [str(repo / "engine")]
sys.modules["engine"] = package
runpy.run_path(str(repo / sys.argv[1]), run_name="__main__")
