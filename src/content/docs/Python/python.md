---
title: Python
---

## Threading & MultiProcess

- When a standard Python program runs, multiple incoming requests or tasks are handled at the thread level or task/coroutine level by default, unless you explicitly write your code to use separate processes
- How Python Handles Multiple RequestsDefault (Single-Process / Multi-Thread or Async):
  - By default, running a Python script creates a single process with a single main execution path. To handle multiple requests at the same time (like network or API calls), Python uses concurrency tools like the threading or asyncio libraries inside that one process.
  - The Role of the GIL: Standard Python (CPython) has a Global Interpreter Lock (GIL). The GIL ensures that only one thread executes Python bytecode at any given moment.
  - I/O-Bound Requests: Even with the GIL, threads work well for handling multiple network requests. When one thread makes a request and waits for a response (an I/O-bound task), it releases the GIL so another thread can run or wait for its own response

Thread Level vs. Process Level:

| Feature  | Thread Level (threading / asyncio)                          | Process Level (multiprocessing)                                             |
| -------- | ----------------------------------------------------------- | --------------------------------------------------------------------------- |
| Memory   | Shares the same memory space.                               | Each process has its own memory space and Python interpreter.               |
| Overhead | Low memory and creation overhead.                           | High memory and creation overhead.                                          |
| Best For | Waiting on web requests, files, or databases (I/O-bound).   | Heavy math or data crunching (CPU-bound).                                   |
| The GIL  | Restricted by the GIL (one active Python thread at a time). | Bypasses the GIL because each process runs its own independent interpreter. |

Web Servers (A Practical Example):

- If you run a Python web application using a production server like Uvicorn, it actually uses both:
  - Process Level: The server spawns multiple worker processes to utilize different CPU cores on your machine.
  - Thread/Async Level: Each individual process uses threads or an async event loop (asyncio) to juggle hundreds of incoming web requests simultaneously
