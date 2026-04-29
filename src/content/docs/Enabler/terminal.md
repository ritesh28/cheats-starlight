---
title: Terminal (cmd)
flag: todo
---

## Helpers

| usage                                  | command                                                                                            |
| -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Show help manual                       | `man <command>`                                                                                    |
| clear                                  | `clear`                                                                                            |
| interrupt current                      | `ctrl+c`                                                                                           |
| exit session                           | `ctrl+d`                                                                                           |
| reverse-search through command history | `ctrl+r` </br> Go to next search by again pressing `ctrl+r`. Press `return` to end search          |
| direct output to file                  | `<command> > <file>`: override file, if present </br> `<command> >> <file>`: append output to file |
| direct output to other command         | `<command1> \| <command2>`                                                                         |
| Combining Command (&&)                 | `<cmd1> && <cmd2>`: Execute `cmd2` only when `cmd1` is successful                                  |
| Combining Command (\|\|)               | `<cmd1> \|\| <cmd2>`: Execute `cmd2` only when `cmd1` is fails                                     |

## Directories

| usage                     | command                                                                |
| ------------------------- | ---------------------------------------------------------------------- |
| present working directory | `pwd`                                                                  |
| list                      | `ls <directory>`; `-a`: print hidden files as well; `-l`: long listing |
| change                    | `cd <directory>`                                                       |
| create/make               | `mkdir <directory>`                                                    |
| remove                    | `rm -r <directory>`; `-r`: recursive                                   |
| copy                      | `cp -r <source-directory> <target-directory>`; `-r`: recursive         |
| open in Finder            | `open <directory>`                                                     |

## Files

| usage                       | command                        |
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

- 3 user types: owner, group & others
- Each user has 3 role types: read(r)/4, write(w)/2 and execute(x)/1
- Add up the desired access rights to get a final number for a user type
- Ex. `drwxr-xr--`: `d` is directory (if first letter is `-`, then its a file); owner has all rights; users in that group can read & execute files; others can only read files
- Ex. `755` means `rwx` for owner, `rx` for both group and anyone

| usage                                            | command                                                     |
| ------------------------------------------------ | ----------------------------------------------------------- |
| change permission of file                        | `chmod 755 <file>`                                          |
| change permission of directory (and its content) | `chmod -R 755 <directory>` </br> `-R`: recursive            |
| change ownership of file                         | `chown <userId>:<groupId> <file>`                           |
| change ownership of directory (and its content)  | `chown -R <user>:<group> <directory>` </br> `-R`: recursive |

## Search

| usage                                         | command                                                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| find all files named 'file' inside 'dir' #1   | `ls \| grep -i <file-substring>`; flag `-i`: case-insensitivity; does not search child directory             |
| find all files named 'file' inside 'dir' #2   | `find <dir> -name "<file-with-wildcards>"`; searches child directories as well; `-iname`: case-insensitivity |
| find all occurrences of 'text' inside 'file'  | `grep "<text>" <file>`; `-i`: case-insensitivity                                                             |
| find all files containing 'text' inside 'dir' | `grep -rl "<text>" <directory>`; `-r`: recursive                                                             |

## Network

| usage                              | command         |
| ---------------------------------- | --------------- |
| download a file via http(s) or ftp | `curl -O <url>` |

## Processes

| usage                                     | command                                                                                                               |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| display live info about running processes | `top`                                                                                                                 |
| list process running on a particular port | `lsof -i:8080`; `lsof`: LiSt Open File (regular file or process); flag `t`: returns pid; `kill -9 $(lsof -t -i:8080)` |
| kill/quit process                         | `kill -[signal-code] <pid>`, By default `-15` is used for signal code                                                 |

### Kill signal code

| Signal Code | Signal Name    | Description                                                                             |
| ----------- | -------------- | --------------------------------------------------------------------------------------- |
| `-2`        | SIGINT         | Interrupt from keyboard                                                                 |
| `-3`        | SIGQUIT        | Quit from keyboard                                                                      |
| `-4`        | SIGILL         | Illegal Instruction                                                                     |
| `-6`        | SIGABRT        | Abort Signal                                                                            |
| `-9`        | SIGKILL        | Terminate immediately (Hard Kill); This signal code can't be caught, blocked or ignored |
| `-15`       | TERM (Default) | Terminate gracefully (Soft Kill); Sometime sending `-15` isn't enough to kill a process |
