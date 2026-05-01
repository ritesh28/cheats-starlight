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
- `uv venv` & `source .venv/bin/activate`: Create virtual environment and activate it
  - `uv` automatically detect and use a `.venv` folder located in your current directory or any parent directory
  - If your virtual environment is not named `.venv` or is not in the project root, you may need to activate it or point `uv` to it
- `uv add <package>`: add package and modifies pyproject.toml
- `uv remove <package>`
- `uv sync`: sync the .venv folder with the pyproject.toml (single source of truth)
- `uv lock`

Smart UV:

- To upgrade/downgrade python -> simply update the version in pyproject.toml and .python-version file
- If the package is not already installed, simply add it to the pyproject.toml. When you run a script and that script depends on that missing package, Uv will simply first install the version of that package as mentioned in the pyproject.toml and then run the script
- All script (project or simple file) run in virtual env. No need to explicitly manage virtual env

# uv pip install VS uv add

- They are two separate APIs for managing your Python project and environment
- `uv pip` APIs are meant to resemble the pip CLI:
  - You can think of this as a slightly "lower-level" API: you tell uv pip to install a specific package, or remove a specific package, and so on
  - It came first, and it's partly motivated by a desire to make it easy for folks to adopt uv without changing their existing projects or workflows dramatically
- `uv add`, `uv run`, `uv sync`, and `uv lock` are what we call the "project APIs":
  - These are "higher-level": you define your dependencies in `pyproject.tom`l, and uv ensures that your environment is always in-sync with those dependencies
  - Project APIs are more opinionated (you must use pyproject.toml, since they're designed around "projects"), while the uv pip APIs are more flexible
  - Project APIs are more recent, and they tend to reflect the "uv-native" workflow
