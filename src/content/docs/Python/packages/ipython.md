---
title: IPython
description: Interactive Python - Its an enhanced python interpreter
---

![ipython Image](/src/content/docs/Python/Packages/ipython.drawio.svg)

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

| Task to perform                                 | Magic command | Example                                                                                                                                |
| ----------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| running external code                           | `%run`        | `%run myscript.py`. This execute `script.py` file. Also, any function defined within it are available for use in your IPython session. |
| timing single-line code execution (line mode)   | `%timeit`     | `%timeit l = [n**2 for n in range(1000)]`                                                                                              |
| timing multiple-line code execution (cell mode) | `%%timeit`    | First line is `%%timeit`. All code in that cell (called body of cell) are timed.                                                       |

| `%timeit`                                                                                                               | `%time`                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| It repeats the tests many times                                                                                         | Runs only one time                                                                                  |
| Useful when you want to eliminate the influence of other tasks on your machine, such as disk flushing and OS scheduling | Useful when running task multiple time results in different result every time like sorting an array |
