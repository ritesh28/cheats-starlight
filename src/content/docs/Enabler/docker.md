---
title: Docker
---

- Docker helps you create a **reproducible** environment. you can run your application in **isolation** inside of that environment.
- Virtual MAchine Vs Docker

## Image & Container

- Each container gets its own CPU, memory and network resources and does not depend on a specific operating system or kernel.

## Volume

- Volumes or data volumes is a way for us to create a place in the host machine where we can write files so they are **persisted**
- 2 main ways to create volume:
  - before you create a container
  - lazily, e.g while creating the container
- Mountpoint: location on the host machine which is mapped to a location on the container

## Dockerfile

- Dockerfile is a Description file. We specify everything we need in terms of OS, environment variables and how to get our application in there.
- It acts as a manifest but also as a build instruction file, how to get our app up and running.
- Commands:
  - `FROM`: select base/OS image from Docker Hub. Set `latest` as default version.
  - `WORKDIR`: set a working directory. This is a way to set up for what is to happen later, in the next command below
  - `COPY`: copy the files from the `pwd` into the directory specified by our WORKDIR command.
  - `ENV`: add an environment variable.
  - `RUN`: runs a command in the terminal.
  - `EXPOSE`: open up a port, it is through this port that we communicate with our container.
  - `ENTRYPOINT`: defines how we start up our application, the commands need to be specified as an array.

```yaml title='Dockerfile
FROM node:latest
WORKDIR /app
COPY . .
ENV PORT=3000
RUN npm install
EXPOSE $PORT # any variables we use needs to be prefixed with a $ character
ENTRYPOINT ["node", "app.js"]
```

# CLI

| Object    | Command                                               | Purpose                                                                                             |
| --------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Image     | `docker image ls` or `docker images`                  | get all images                                                                                      |
| Image     | `docker build -t chrisnoring/node:latest .`           | create image. '.' specifies location of Dockerfile. `-t`: tag (image's name)                        |
| Container | `docker container ls`                                 | get all (running+inactive) containers                                                               |
| Container | `docker ps`                                           | get all running containers                                                                          |
| Container | `docker run -d -p 8000:3000 --name my-server <image>` | run container. `-p`: port external:internal. `-d`: detach mode. `--name`: (2 dash) container's name |
| Container | `docker exec -it <id-or-name> bash`                   | execute command (`bash`) inside container. `-it`: interactive mode                                  |
| Container | `docker stop <id-or-name>` (Preferred over `kill`)    | gracefully stop container. Docker sends SIGTERM signal followed by SIGKILL after a grace period     |
| Container | `docker kill <id-or-name>`                            | forcefully stop container. Docker sends SIGKILL right away                                          |
| Container | `docker start <id-or-name>`                           | start an inactive container                                                                         |
| Container | `docker rm <id-or-name>`                              | remove inactive container                                                                           |
| Volume    | `docker volume ls`                                    | get all volumes                                                                                     |
| Volume    | `docker volume create <name>`                         | create volume                                                                                       |
| Volume    | `docker volume prune`                                 | remove all volumes that are not currently in use                                                    |
| Volume    | `docker volume rm <name>`                             | remove a single volume                                                                              |
| Misc      | `docker inspect <object>`                             | get detail about the object                                                                         |
