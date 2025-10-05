---
title: Terminal (cmd)
flag: todo
---

## Helpers

|                                        |                                                                                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Show help manual                       | `man <command>`                                                                                                                      |
| clear command                          | `clear`                                                                                                                              |
| interrupt current command              | `ctrl+c`                                                                                                                             |
| exit session                           | `ctrl+d`                                                                                                                             |
| reverse-search through command history | `ctrl+r` </br> Go to next search by again pressing `ctrl+r`. Press `return` to end search                                            |
| direct command output to file          | `<command> > <file>`: override file, if present </br> `<command> >> <file>`: append output to file                                   |
| direct command output to other command | `<command1> \| <command2>`                                                                                                           |
| Combining Command                      | `<cmd1> && <cmd2>`: Execute `cmd2` only when `cmd1` is successful </br> `<cmd1> && <cmd2>`: Execute `cmd2` only when `cmd1` is fails |

## Directories

|                           |                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------- |
| present working directory | `pwd`                                                                            |
| list                      | `ls <directory>` </br> `-a`: print hidden files as well </br> `-l`: long listing |
| change                    | `cd <directory>`                                                                 |
| create/make               | `mkdir <directory>`                                                              |
| remove                    | `rm -r <directory>` </br> `-r`: recursive                                        |
| copy                      | `cp -r <source-directory> <target-directory>` </br> `-r`: recursive              |
| open in Finder            | `open <directory>`                                                               |

## Files

|                             |                                |
| --------------------------- | ------------------------------ |
| read                        | `cat <file>`                   |
| read line by line           | `less <file>`                  |
| read first 10 lines         | `head <file>`                  |
| remove                      | `rm <file>`                    |
| rename                      | `mv <old-file> <new-file>`     |
| move                        | `mv <file> <target directory>` |
| copy                        | `cp <file> <target directory>` |
| create                      | `touch <file>`                 |
| open in default application | `open <file>`                  |

## Permissions

Has 3 user types, namely owner, group and others. </br> Each user has 3 role types, namely read(r)/4, write(w)/2 and execute(x)/1. </br> Add up the desired access rights to get a final number for a user type. </br> Ex. `drwxr-xr--`: `d` is directory (the first letter can be `-` which represent a file), owner has all rights, users in that group can read & execute files, others can only read files. </br> Ex. `755` means `rwx` for owner, `rx` for both group and anyone

|                                                  |                                                             |
| ------------------------------------------------ | ----------------------------------------------------------- |
| change permission of file                        | `chmod 755 <file>`                                          |
| change permission of directory (and its content) | `chmod -R 755 <directory>` </br> `-R`: recursive            |
| change ownership of file                         | `chown <userId>:<groupId> <file>`                           |
| change ownership of directory (and its content)  | `chown -R <user>:<group> <directory>` </br> `-R`: recursive |

## Search

|                                                     |                                                                                                                                                                                                                                                 |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| find all files named <file> inside <dir>            | `ls \| grep -i <file-substring>`, flag `-i`: case-insensitivity, does not search child directory; or </br> `find <dir> -name "<file-with-wildcards>"`, searches child directories as well, use `iname` instead of `name` for case-insensitivity |
| find all occurrences of <text> inside <file>        | `grep "<text>" <file>` </br> `-i`: case-insensitivity                                                                                                                                                                                           |
| find all files containing <text> inside <directory> | `grep -rl "<text>" <directory>` </br> `-r`: recursive                                                                                                                                                                                           |

## Network

|                                    |                 |
| ---------------------------------- | --------------- |
| download a file via http(s) or ftp | `curl -O <url>` |

## Processes

|                                           |                                                                                                                            |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| display live info about running processes | `top`                                                                                                                      |
| list process running on a particular port | `lsof -i:8080`, `lsof`: list open file (regular file or process) </br> `kill -9 $(lsof -t -i:8080)`, flag `t`: returns pid |
| kill/quit process                         | `kill -[signal-code] <pid>`, By default `-15` is used for signal code                                                      |

### Kill signal code

| Signal Code | Signal Name | Description                                                                                                                                  |
| ----------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `-2`        | SIGINT      | Interrupt from keyboard                                                                                                                      |
| `-3`        | SIGQUIT     | Quit from keyboard                                                                                                                           |
| `-4`        | SIGILL      | Illegal Instruction                                                                                                                          |
| `-6`        | SIGABRT     | Abort Signal                                                                                                                                 |
| `-9`        | SIGKILL     | Terminate immediately (Hard Kill) </br> This signal code can't be caught, blocked or ignored                                                 |
| `-15`       | TERM        | Terminate gracefully (Soft Kill). </br> Default, if signal code is not specified </br> Sometime sending `-15` isn't enough to kill a process |
