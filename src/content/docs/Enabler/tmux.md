---
title: Terminal Multiplexer (tmux)
---

- It is a command-line tool that lets you manage multiple terminal sessions from a single window
- Green background footer indicates that tmux is running
- Prefix key (`Ctrl+b`): a 'trigger' shortcut that tells tmux to listen for a command. Think of it like a 'Hey Siri' or 'Alexa' for your terminal
- Persistence (Attach/Detach): You can **detach** from a session and leave programs running in the background
- Layers: tmux organizes your workspace into three distinct layers:
  1. **Sessions**: The highest level; a session can contain multiple windows and persists even when you close the terminal
  2. **Windows**: Similar to tabs in a web browser; each window takes up the whole screen. Each window can contain multiple panes
  3. **Panes**: Individual pseudo-terminals that result from splitting a window

```txt title='layers'
Footer inside session: `[session-name] 0:window-name-1 0:window-name-2*` # `*` -> current window

tmux ls
0: 3 windows (created Wed Apr 29 17:40:36 2026) # session-name: window-count (created-at)
1: 1 windows (created Wed Apr 29 18:01:07 2026)
```

## Session Management

| command                       | usage                                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------------------- |
| `tmux`                        | Start a new unnamed session                                                                       |
| `tmux new -s [name]`          | Start a new session with a specific name                                                          |
| `tmux ls`                     | List all currently running sessions                                                               |
| `tmux a`                      | Reattach to the last active session                                                               |
| `tmux a -t [name]`            | Attach to a specific named session                                                                |
| `tmux kill-session -t [name]` | Permanently close a specific session                                                              |
| `exit` (inside tmux session)  | Kills current pane. If single pane, kills current window. If single window, kills current session |
| `Ctrl+b + ?`                  | View a list of all keybindings (press `q` to exit)                                                |

## Prefix + Session Layer

| `Ctrl+b` + cmd | usage                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------ |
| `d`            | Detach from the current session (it stays running in the background)                             |
| `$`            | Rename the current session                                                                       |
| `s`            | Show a list of sessions to switch between (use arrow keys to move up-down or go to deeper layer) |

## Prefix + Window(Tab) Layer

| `Ctrl+b` + cmd | usage                                                |
| -------------- | ---------------------------------------------------- |
| `c`            | Create a new window                                  |
| `,`            | Rename the current window                            |
| `w`            | List all windows in all sessions for easy navigation |
| `n/p`          | Move to the next or previous window                  |
| `0-9`          | Jump directly to a window by its number              |
| `&`            | Close (kill) the current window                      |

## Prefix + Pane Layer

| `Ctrl+b` + cmd | usage                                                    |
| -------------- | -------------------------------------------------------- |
| `%`            | Split the screen vertically (left and right)             |
| `"`            | Split the screen horizontally (top and bottom)           |
| `Arrow Keys`   | Move focus between panes in that direction               |
| `z`            | Zoom (maximize) the current pane; press again to restore |
| `x`            | Close the current pane                                   |
| `Space`        | Cycle through preset pane layouts                        |
