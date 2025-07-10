---
title: UV - Package Manager
---

An extremely fast Python package and project manager, written in Rust

- `pip install uv`: install
- `uv python list`: list all available python package
- `uv python install <version>`: install python package
- `uv python uninstall <version>`: uninstall python package
- `uv run [--python <version>] main.py`: run script using mentioned python interpreter. By default, uses the latest python interpreter

Running a simple file

- `uv init --script main.py --python <version>`: Writes metadata to the top of the file which will be used when running the script
- `uv add --script main.py "requests"`: Add requests dependencies to the metadata

Running project

- `uv init`: create .python-version, .git, pyproject.toml file
- `uv add <package>`: add package and modifies pyproject.toml
- `uv remove <package>`
- `uv sync`: sync the .venv folder with the pyproject.toml (single source of truth)
- `uv lock`

Smart UV:

- To upgrade/downgrade python -> simply update the version in pyproject.toml and .python-version file
- If the package is not already installed, simply add it to the pyproject.toml. When you run a script and that script depends on that missing package, Uv will simply first install the version of that package as mentioned in the pyproject.toml and then run the script
- All script (project or simple file) run in virtual env. No need to explicitly manage virtual env
