---
title: Multithreading
---

**Process**: Instance of a program. Multiple processes → Multiprocessing

**Thread**

- Unit of execution within a process. multiple threads → Multithreading
- When a Python program starts, it has a thread called the **main thread**. Here, the CPU does nothing (is idle) when the program is sleeping or waiting for I/O task result. Sometimes, you want to offload the I/O-bound tasks to a new thread to execute them concurrently

**Single-core & Multi-core processor**: Single-core processors can run only one process at a time, relying on a scheduler to rapidly switch between processes to simulate multitasking. In contrast, multi-core processors can run multiple processes truly in parallel. Multiprocessing leverages these multiple cores to execute several processes simultaneously

**CPU-bound & I/O-bound tasks**

- CPU-bound task: matrix multiplication, image rendering, video compression
- I/O-bound task: network requests, database connections, and file reading/writing
- **Multithreading is suitable for I/O-bound tasks, and multiprocessing is suitable for CPU-bound tasks**

## Differences between Processes and Threads

| Criteria                         | Process                                | Thread                                            |
| -------------------------------- | -------------------------------------- | ------------------------------------------------- |
| Memory Sharing                   | Memory is not shared between processes | Memory is shared between threads within a process |
| Memory footprint                 | Large                                  | Small                                             |
| CPU-bound & I/O-bound processing | Optimized for CPU-bound tasks          | Optimized for I/O bound tasks                     |
| Starting time                    | Slower than a thread                   | Faster than a process                             |

## Threading

:::tip[When to use?]
Usage: Use threading when doing multiple parallel I/O operations.
:::

```py title="usage-steps.py"
from threading import Thread
new_thread = Thread(target=fn, args=args_tuple) # create instance of thread
new_thread.start() # start the child thread
new_thread.join() # wait for the child thread to complete in the main thread
# When thread.join() is not called, main thread might terminate before the created threads complete their execution.
# This can lead to issues like incomplete task, resource leak, unexpected behavior
```

```py title="thread-example.py"
from time import sleep, perf_counter
from threading import Thread

def task():
    print('Starting a task...')
    print('going in sleep mode...')
    sleep(1)
    print('done')

start_time = perf_counter()

# create two new threads
t1 = Thread(target=task)
t2 = Thread(target=task)

# start the threads
t1.start()
t2.start()

# wait for the threads to complete
t1.join()
# NOTE: if you call the join() method before t2.start(), the program will wait for the first thread to complete before starting the next one.
t2.join()

end_time = perf_counter()

print(f'It took {end_time- start_time: 0.2f} second(s) to complete.')

# O/P =>
# Starting a task...
# going in sleep mode...
# Starting a task...
# going in sleep mode...
# done
# done
# It took  1.00 second(s) to complete.

# Explanation =>
# When the program executes, it’ll have three threads: the main thread and two other child threads.
# First child starts executing. When it hit `sleep()` statement, it halts and let the second child start executing
# Note: the program doesn’t END the execution of the threads in the order i.e. second thread can end before first thread
```

## Extend Python Thread Class

:::tip[When to use?]
Extend the class when you want to add or customize the behavior of a thread
:::

```py title="usage-steps.py"
from threading import Thread
class customThread(Thread):
    def __init__(self, [,args]):
        # override to add custom arguments
        # if returning, store that value in the instance of the class
    def run(self, [,args]):
        # override to customize the behavior of the new thread class when a new thread is started
```

```py title="http-request-thread-example.py"
from threading import Thread
import urllib.request

class HttpRequestThread(Thread):
    def __init__(self, url: str) -> None:
        super().__init__()
        self.url = url
        self.http_status_code = None # return value
        self.reason = None # return value

    def run(self) -> None:
        try:
            response = urllib.request.urlopen(self.url)
            self.http_status_code = response.code
        except urllib.error.HTTPError as e:
            self.http_status_code = e.code
        except urllib.error.URLError as e:
            self.reason = e.reason

def main() -> None:
    urls = ['https://httpstat.us/200', 'https://httpstat.us/400']
    threads = [HttpRequestThread(url) for url in urls] # create new threads
    [t.start() for t in threads] # start the threads
    [t.join() for t in threads] # wait for the threads to complete
    [print(f'{t.url}: {t.http_status_code}') for t in threads] # display the URLs with HTTP status codes

if __name__ == '__main__':
    main()
```

## Daemon threads

:::tip[When to use?]
Sometimes, you may want to execute a task in the background such as logging or monitoring services (non-critical task). To do that you use a special kind of thread called a daemon thread.

| Criteria | Regular thread                                                                   | Daemon thread                                        |
| -------- | -------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Stop     | Continue to run until their task is completed, even if the main program finishes | Automatically terminated when the main program exits |

:::

Syntax:

- `t = Thread(target=f, daemon=True)` - set the daemon to True in the Thread constructor; or
- `t = Thread(target=f) /n t.daemon = True` - set the daemon property to True after creating the Thread‘s instance

## ThreadPoolExecutor

:::tip[Why to use?]

Manually managing threads is not efficient because creating and destroying many threads frequently are very expensive in terms of computational costs. Instead of doing so, you may want to **reuse** the threads if you expect to run many ad-hoc tasks in the program. A thread pool allows you to achieve this.

Each thread in the pool is called a **worker thread**. The ecosystem has a:

- task queue (a task which need to be executed comes here first);
- thread pool (has a fixed size of worker threads); and
- completed task list.
  :::

`from concurrent.futures import ThreadPoolExecutor` → `ThreadPoolExecutor` class extends the `Executor` class and returns a `Future` object

`Executor` class has three methods to control the thread pool:

- `submit(func)` – dispatch a function to be executed and return a Future object. executes asynchronously.
- `map(func, [var1, var2])` – execute a function asynchronously for each element in an iterable.
- `shutdown()` – shut down the executor. Once completing working with the executor, you must explicitly call the shutdown() method to release the resource held by the executor. To avoid calling the shutdown() method explicitly, you can use the context manager.

`Future` object represents the eventual result of an asynchronous operation. It has two useful methods:

- `result()` – return the result of an asynchronous operation.
- `exception()` – return the exception of an asynchronous operation in case an exception occurs.

```py title="pool-executor-submit-example.py"
from time import sleep, perf_counter
from concurrent.futures import ThreadPoolExecutor

def task(id):
    print(f'Starting the task {id}...')
    sleep(1)
    return f'Done with task {id}'

start = perf_counter()

with ThreadPoolExecutor() as executor:
    f1 = executor.submit(task, 1) # submit() method returns a Future object
    f2 = executor.submit(task, 2)

    print(f1.result()) # To get the result from the Future object, we called its result()
    print(f2.result())

finish = perf_counter()

print(f"It took {finish-start} second(s) to finish.")

# O/P =>
# Starting the task 1...
# Starting the task 2...
# Done with task 1
# Done with task 2
# It took 1.0177214 second(s) to finish.
```

```py title="pool-executor-map-example.py"
with ThreadPoolExecutor() as executor:
    results = executor.map(task, [1,2])
    for result in results:
        print(result)
```
