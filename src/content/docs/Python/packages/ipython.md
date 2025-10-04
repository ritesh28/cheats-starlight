---
title: IPython
description: Interactive Python - Its an enhanced python interpreter
---

![ipython Image](./ipython.drawio.svg)

## Concepts & Terminology

|                                       |                                                                                                                                                                                                                         |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Anaconda                              | Similar like pip and pipenv. </br> It a package and environment management system. It provides packages and tools for data science via `conda` cli                                                                      |
| Notebook                              | It's a file which contain both computer code (e.g. python) and rich text elements (paragraph, equations, figures, links, etc…).                                                                                         |
| [Jupyter Notebook](#jupyter-notebook) | It is a server-client application that allows editing and running notebook documents via a web browser. </br> Also known as IPython Notebook. </br> File extension: `.ipynb`                                            |
| Kernel                                | A notebook kernel is a “computational engine” that executes the code contained in a Notebook document. </br> The ipython kernel (`pip install ipykernel`) executes python code. Kernels for many other languages exist. |
| [Magic command](#magic-commands)      | Add-on commands on top of python syntax. </br> Solves various common problems in data analysis                                                                                                                          |

## Jupyter Notebook

Use VS Code or `jupyter notebook` to launch jupyter notebook. Select Anaconda python as kernel.

Notebook maintains list of input (code which you enter in the cell) and output (result of execution of the cell) in `In` and `Out` object, respectively.

Table of content (if markdown is present inside the notebook) can be displayed under `outline` tab in `explorer` sidebar.

VsCode supports variable explorer and data viewer.

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
| toggle line number in a cell (in command mode)                                | `l`                                                           |
| toggle line number in entire workbook (in command mode)                       | `shift + l`                                                   |

## Help & Documentation

| Task to perform         | Syntax                                                                                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| accessing documentation | `<object>?`                                                                                                                                           |
| accessing source code   | `<object>??` </br> If the code is implemented in other language than python, then `??` returns same output as `?`                                     |
| autocompletion          | `TAB key` </br> IPython provides `*` character wildcard matching. </br> Ex: to list every object in the namespace that ends with Warning: `*Warning?` |

## Magic Commands

Magic commands come in 2 flavour:

- line magic: Operate on single line of input. Prefixed by single `%`
- cell magic: Operate on multiple lines of input. Prefixed by double `%%`

| Task to perform                                 | Magic command | Example                                                                                                                                |
| ----------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| running external code                           | `%run`        | `%run myscript.py`. This execute `script.py` file. Also, any function defined within it are available for use in your IPython session. |
| timing single-line code execution (line mode)   | `%timeit`     | `%timeit l = [n**2 for n in range(1000)]`                                                                                              |
| timing multiple-line code execution (cell mode) | `%%timeit`    | First line is `%%timeit`. All code in that cell (called body of cell) are timed.                                                       |

| `%timeit`                                                                                                               | `%time`                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| It repeats the tests many times                                                                                         | Runs only one time                                                                                  |
| Useful when you want to eliminate the influence of other tasks on your machine, such as disk flushing and OS scheduling | Useful when running task multiple time results in different result every time like sorting an array |

### Shell commands

Prefix command by `!`

```python title="my-shell.py"
# using shell output in python
contents = !ls # ['my-project.txt]
directory = !pwd # ['/Users/riteshraj/Documents/ritesh-github-portfolio-monorepo']

# using python output in shell
message = 'hello from python'
!echo {message}
```

### Shell-Related magic commands

`!cd..` does nothing because shell commands are executed in a temporary sub-shell. To make it work use `%cd` magic command.

Other shell-like magic commands: `%cat`, `%cp`, `%ls`, `%mkdir`, etc.

These shell-like magic commands can also be used without `%` sign. This behavior can be toggled with the `%automagic` magic function.

## Profiling & Timing code
