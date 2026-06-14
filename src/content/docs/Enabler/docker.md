---
title: Docker
---

- Docker helps you create a **reproducible** environment. you can run your application in **isolation** inside of that environment.
- Virtual Machine Vs Docker
- Main Objects:
  1. Image: Read-only templates that contain instructions (code, runtime, environment variables) needed to create a Docker container. You can think of them as the blueprint
  2. Container: The running instance of an Image
  3. Volume: The persistent storage mechanism for Docker data, ensuring data isn't lost when a container is destroyed
  4. Network
  5. Dockerfile

## Image & Container

- Each container gets its own CPU, memory and network resources and does not depend on a specific operating system or kernel.

## Volume

- Volumes or data volumes is a way for us to create a place in the host machine where we can write files so they are **persisted**
- Mountpoint: location on the host machine which is **mounted** to a location in the container
- Docker mount is same as any OS mounting:
  - When you **bind-mount** a filesystem onto another directory, as in `mount -o bind /source /destination` or `docker run -v /host/path:/container/path ...`:
    - You will only see files in the destination mount that exist in the source filesystem
    - You will not see the files contained in any child mounts unless you were to explicitly bind mount those directories as well `mount -o bind /source/sub /destination/sub`
    - Anything in `/destination` folder is bypassed/hid. All you see in the container is what is on the host `/source` folder
  - Named Volume (`-v my_volume:/container/path`):
    - This volume reside in Docker Demon (host) Linux Virtual Machine
    - Has a built-in safety mechanic called **copy-on-first-use**
    - First-Time Mount (Volume is Empty): Docker will pre-populate the volume by copying all the pre-existing files and folders out of container's `/container/path` directory
    - Subsequent Mount (Volume has Data): Once data exists inside `my_volume`, the copying mechanic permanently shuts off - i.e. anything in `/container/path` will be bypassed
- Use Read-Only Flag: If container only needs to read a config file from the host, append `:ro` to your mount (e.g., `-v ./config:/app/config:ro`)
- NOTE: If the directory path contain spaces, then wrap it in quotes. Example - `"$(PWD)":/app`

## Dockerfile

- Dockerfile is a Description file. We specify everything we need in terms of OS, environment variables and how to get our application in there.
- It acts as a manifest but also as a build instruction file, how to get our app up and running.
- Commands:
  - `FROM`: select base/OS image from Docker Hub. Set `latest` as default version.
  - `WORKDIR`: set a working directory. This is a way to set up for what is to happen later, in the next command below.
  - `COPY`: copy the files from the `pwd` into the directory specified by our WORKDIR command.
  - `ENV`: add an environment variable.
  - `RUN`: runs a command in the terminal.
  - `EXPOSE`: open up a port, it is through this port that we communicate with our container.
  - `ENTRYPOINT`: defines how we start up our application, the commands need to be **specified as an array**.
  - `VOLUME /container/path`: create a new, empty volume and mount it inside your container. Can be **overridden** by `-v` flag when creating container.

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
| Container | `docker container ls [-a]` or `docker ps [-a]`        | get all running containers                                                                          |
| Container | `docker run -d -p 8000:3000 --name my-server <image>` | run container. `-p`: port external:internal. `-d`: detach mode. `--name`: (2 dash) container's name |
| Container | `docker run -d -v my-volume:/logs <image>`            | (Named Volume) run container. `-v`: volume volume-name:container-directory                          |
| Container | `docker run -d -v $(pwd)/logs:/logs <image>`          | (Bind Mount) run container. `-v`: volume host-directory:container-directory                         |
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
