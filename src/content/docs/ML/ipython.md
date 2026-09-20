---
title: IPython
---

- IPython (Interactive Python): cmd shell for interactive computing in Python. Type `ipython` in terminal
- Anaconda: Similar to `pip` and `pipenv` i.e. package and environment management. It provides packages for data science via 'conda' cli
- Notebook: Its a file that contains both computer code (e.x. python) and rich text elements (markdown)
  - Jupyter/IPython notebook: Its a server-client application running notebook documents on browser or VsCode. File extension: '.ipynb'
  - Notebook kernel: Server for .ipynb notebook (`pip install ipykernel`). Kernels for other languages exists
- Magic commands: Add-on commands on top of python syntax. Come in 2 flavors:
  - Line magic: prefix by single '%'
  - Cell magic (multi-line): prefix by double '%%'
- Shell commands: Prefix with '!'. E.x. `!pwd`
  - Shell-like magic command: E.x. '%cat', '%cp', '%ls', '%mkdir', etc.
  - NOTE: '!cd..' does nothing because shell commands are executed in a temporary sub-shell. To make it work use '%cd' magic command
- `pip install jupyterlab`: JupyterLab is a interface like IDE, providing a workspace to write, view, and organize notebooks, files, and terminals
- `pip install ipykernel`: ipykernel is the engine that runs Python code within JupyterLab interface

## Jupiter in VS Code - No pyproject.toml or uv.lock

- Run below commands in terminal to set up the environment:
  - `uv venv --seed`
  - `source .venv/bin/activate`
  - `which python`
  - `uv pip install ipykernel`
- open notebook and set the .venv/bin/python as the kernel
- use `uv pip install <package_name>` directly in the notebook to install any additional packages in the virtual environment
- (optional) once done - delete the .venv folder to clean up the environment

## Shortcuts

Notebook maintains list of input (code which you enter in the cell) and output (result of execution of the cell) in `In` and `Out` object, respectively.

| Task to perform                                                               | Shortcut                                                      |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Command mode (cell is selected but not in focus)                              | `esc`                                                         |
| Edit mode (cell is selected and focused; ready to be modified)                | `enter`                                                       |
| Move through cells                                                            | `arrow`                                                       |
| Move a cell (in command mode)                                                 | `alt + arrow`                                                 |
| Run selected cell                                                             | `ctrl + enter`                                                |
| Run selected cell & move to next cell (if not present, a new cell is created) | `shift + enter`                                               |
| Run multiple cells                                                            | click `run all` or `run above cells` or ` run cell and below` |
| Add a cell above (in command mode)                                            | `a`                                                           |
| Add a cell below (in command mode)                                            | `b`                                                           |
| Delete a cell (in command mode)                                               | `dd`                                                          |
| switch cell to markdown (in command mode)                                     | `m`                                                           |
| switch cell to code (in command mode)                                         | `y`                                                           |

## Help & Documentation

| Task to perform         | Syntax                                                                                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| accessing documentation | `<object>?`                                                                                                                                           |
| accessing source code   | `<object>??` </br> If the code is implemented in other language than python, then `??` returns same output as `?`                                     |
| autocompletion          | `TAB key` </br> IPython provides `*` character wildcard matching. </br> Ex: to list every object in the namespace that ends with Warning: `*Warning?` |

## Magic Commands

| Task to perform       | Magic command | Example                                                                                                              |
| --------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------- |
| running external code | `%run`        | `%run myscript.py`: execute the file. Also, any defined function & variable are available in current IPython session |
| timing (line mode)    | `%timeit`     | `%timeit l = [n**2 for n in range(1000)]`                                                                            |
| timing (cell mode)    | `%%timeit`    | First line is `%%timeit`. All code in that cell (called body of cell) are timed                                      |

- `%timeit`
  - It repeats the tests many times
  - Useful when you want to eliminate the influence of other tasks on your machine, such as disk flushing and OS scheduling
- `%time`
  - Runs only one time
  - Useful when running task multiple time results in different result every time like sorting an array
