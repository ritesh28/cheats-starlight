---
title: Thread Synchronization Techniques
---

A race condition occurs when two or more threads try to access a shared variable simultaneously, leading to unpredictable outcomes.

| Term                                               | What it is                                                                                               | How it work                                                                                                                                                     |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thread Lock (also called mutex (MUTual EXclusion)) | Provides exclusive access to a shared resource in a multithreaded application                            | Has two states: locked and unlocked. Other threads that attempt to acquire the same lock while it is locked will be blocked and wait until the lock is released |
| Thread Event                                       | It serves as a communication tool between threads                                                        | It manages an internal flag that can be set to True or False, allowing one thread to signal an event and other threads to wait for it                           |
| Semaphore                                          | A lock with a counter that limits the number of threads that can access a shared resource simultaneously | A thread decrement counter when accessing the shared resources. If counter is 0, then the thread waits                                                          |

## Threading Lock

```py title="usage-steps.py"
from threading import Lock
lock = Lock() # By default, the lock is unlocked until a thread acquires it.
lock.acquire() # thread acquires a lock. Other threads have to wait now
lock.release() # thread release the lock. Next thread can now acquire the lock

# context manager - 'with' statement - no need to explicitly acquire & release lock
with lock:
    # Lock was acquired within the with block
    # Perform operations on the shared resource
# the lock is released outside the with block
```

```py title="counter-thread-lock-example.py"
from threading import Thread, Lock
from time import sleep

class Counter:
    def __init__(self):
        self.value = 0
        self.lock = Lock() # lock member of Counter class

    def increase(self, by):
        with self.lock:
            current_value = self.value
            current_value += by

            sleep(0.1)

            self.value = current_value
            print(f'counter={self.value}')

def main():
    counter = Counter()
    # create threads
    t1 = Thread(target=counter.increase, args=(10, ))
    t2 = Thread(target=counter.increase, args=(20, ))
    # start the threads
    t1.start()
    t2.start()
    # wait for the threads to complete
    t1.join()
    t2.join()
    print(f'The final counter is {counter.value}')

if __name__ == '__main__':
    main()

# O/P =>
# counter=10
# counter=30
# The final counter is 30
```

## Threading Event

```py title="usage-steps.py"
from threading import Event
event = Event() # by default, the event is not set (cleared)
event.set() # set an event. Once an event is set, all the threads that wait on the event will be notified automatically
if event.is_set(): # check if event is set
   # ...
event.clear() # unset an event
event.wait() # threads can wait for the event to be set. wait() will block the current thread until another thread call the set(). If an event is already set, the wait() function returns immediately.
event.wait(timeout=5) # wait for 5 seconds. Specify how long the thread is going to wait
```

```py title="thread-event-example.py"
from threading import Thread, Event
from time import sleep

def task(event: Event, id: int) -> None:
    print(f'Thread {id} started. Waiting for the signal....')
    event.wait() # both t1 and t2 threads will wait for the event to be set before continuing
    print(f'Received signal. The thread {id} was completed.')

def main() -> None:
    event = Event()

    t1 = Thread(target=task, args=(event,1))
    t2 = Thread(target=task, args=(event,2))

    t1.start()
    t2.start()

    print('Blocking the main thread for 3 seconds...')
    sleep(3)
    event.set() # Both t1 and t2 threads will be notified and continue executing until the end



if __name__ == '__main__':
    main()

# O/P =>
# Thread 1 started. Waiting for the signal....
# Thread 2 started. Waiting for the signal....
# Blocking the main thread for 3 seconds...
# Received signal. The thread 1 was completed.
# Received signal. The thread 2 was completed.
```

```py title="threat-event-stop-child-example.py"
from threading import Thread, Event
from time import sleep

def task(event: Event) -> None:
    # periodically check if the internal flag of the Event object is set in the child thread by calling the is_set().
    # If is_set() is true, stop the child thread
    for i in range(6):
        print(f'Running #{i+1}')
        sleep(1)
        if event.is_set():
            print('The thread was stopped prematurely.')
            break
    else:
        print('The thread was stopped maturely.')

def main() -> None:
    event = Event()
    thread = Thread(target=task, args=(event,))
    thread.start() # start the thread
    sleep(3) # suspend the thread for 3 seconds
    event.set() # set the event and stop the child thread

if __name__ == '__main__':
    main()

# O/P =>
# Running #1
# Running #2
# Running #3
# The thread was stopped prematurely.
```

```py title="threat-event-stop-child-class-example.py"
from threading import Thread, Event
from time import sleep

class Worker(Thread):
    def __init__(self, event, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.event = event # set 'event' as member

    def run(self) -> None:
        for i in range(6):
            print(f'Running #{i+1}')
            sleep(1)
            if self.event.is_set():
                print('The thread was stopped prematurely.')
                break
        else:
            print('The thread was stopped maturely.')

def main() -> None:
    event = Event()
    thread = Worker(event) # create a new Worker thread
    thread.start()
    sleep(3) # suspend  the thread after 3 seconds
    event.set() # stop the child thread

if __name__ == '__main__':
    main()
```

## Semaphore

```py title="usage-steps.py" wrap
import threading
semaphore = threading.Semaphore(3) # create a Semaphore object and specify the number of threads that can acquire it at the same time
semaphore.acquire() # acquire a semaphore from a thread
# If the semaphore count is zero, the thread will wait until another thread releases the semaphore. Once having the semaphore, you can execute a critical section of code.
semaphore.release() # release a semaphore after running the critical section of code

# Using 'with' statement
with semaphore:
    # Code within this block has acquired the semaphore
    # The with statement acquire and release the semaphore automatically, making your code less error-prone
    # Perform operations on the shared resource
# The semaphore is released outside the with block
```

```py title="semaphore-example.py"
import threading
import urllib.request

MAX_CONCURRENT_DOWNLOADS = 3
semaphore = threading.Semaphore(MAX_CONCURRENT_DOWNLOADS)

def download(url):
    with semaphore:
        print(f"Downloading {url}...")
        response = urllib.request.urlopen(url)
        print(f"Finished downloading {url}")
        return response.read()

def main():
    # URLs to download
    urls = ['https://www.ietf.org/rfc/rfc791.txt', 'https://www.ietf.org/rfc/rfc792.txt']

    threads = [threading.Thread(target=download, args=(url,)) for url in urls] # Create threads for each download
    [ thread.start() for thread in threads]
    [thread.join() for thread in threads] # Wait for all threads to complete

if __name__ == '__main__':
    main()

# O/P =>
# Downloading https://www.ietf.org/rfc/rfc791.txt...
# Downloading https://www.ietf.org/rfc/rfc792.txt...
# Finished downloading https://www.ietf.org/rfc/rfc792.txt
# Finished downloading https://www.ietf.org/rfc/rfc791.txt
```
