---
title: Docker
---

![overview](./docker.drawio.svg)

- Docker helps you create a **reproducible** environment. you can run your application in **isolation** inside of that environment
- Virtual Machine Vs Docker: REFER INFOGRAPHIC
- To dockerize, we need to:
  1. Define a Dockerfile: Base OS image, libraries to install, env variables , ports that need opening and lastly how to start up our service
  2. Build an image or pull down an existing image from Docker Hub
  3. Create and run a container
- Main Objects:
  1. Image: Read-only templates that contain instructions (code, runtime, environment variables) needed to create a Docker container. You can think of them as the blueprint
  2. Container: The running instance of an Image
  3. Volume: The persistent storage mechanism for Docker data, ensuring data isn't lost when a container is destroyed
  4. Network
  5. Dockerfile

## Image & Container

- Image name format: `[<registry>/][<project>/]<image>[:<tag>|@<digest>]`. e.g. docker.io/my-proj/redis:5@sha256:0ed5d5928
- Each container gets its own CPU, memory and network resources and does not depend on a specific operating system or kernel.

## Volume

- Volumes or data volumes is a way for us to create a place in the host machine where we can write files so they are **persisted**
- Mountpoint: location on the host machine which is **mounted** to a location in the container
- 3 primary types of mounts:
  1. Volumes (Recommended): completely managed by Docker and are isolated from the host machine's core file system. Best For: Database storage
  2. Bind Mounts: map a specific, exact file or directory from your host machine directly into the container. Best For: Local development environments
  3. tmpfs Mounts (Temporary FileSystem): stores data directly in RAM instead of writing it to hard drive. Best For: Temporary data
     - Pros: Speed (since RAM) and security (since data is wiped out once container is stopped)
     - Cons: Cannot be shared between containers
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

## Networking

- **Port forwarding** tells the router/gate keeper: If you receive data on a specific Port (e.g. 8001), send it directly to this specific internal IP address (e.g. 192.168.1.15)
- `docker run -p 8001:3306`: Traffic coming on 8001 (host port) is forwarded to 3306 (container port)
- NOTE: `docker run --link ...` is deprecated
- Place containers on the same user-defined network for them to link/communicate with each other. A container can exist in multiple networks if needed
- When two containers are on the same network, they communicate directly using their **internal container ports**, completely bypassing the host machine's port mapping
- Ways:
  1. Use docker compose: It automatically creates a default network and adds your containers to it
  2. Manual: First create a custom bridge network. Then start the container on that network
- Built-in network types (called network drivers) that control how containers communicate with each other, with the host machine, and with the outside world:
  1. Bridge Network (Default): A private, isolated virtual network created on your host machine. Containers attached to the same bridge network can talk to each other
  2. Host: removes isolation between container and host machine. The container shares host’s networking namespace directly, meaning it does not get its own IP address
  3. MACvlan: assigns a unique, physical MAC address to a container, making it appear as a standalone physical device directly connected to your actual router
  4. None: completely disables all networking capabilities for the container. Has no access to external networks, the internet, or other containers

## Dockerfile

- Dockerfile is a Description file. We specify everything we need in terms of OS, environment variables and how to get our application in there.
- It acts as a manifest but also as a build instruction file, how to get our app up and running.
- Commands:
  - `FROM`: select base/OS image from Docker Hub. Set `latest` as default version.
  - `WORKDIR`: set a working directory. This is a way to set up for what is to happen later, in the next command below.
  - `COPY`: (preferred over `ADD`) copy the files from the `pwd` into the directory specified by our WORKDIR command.
  - `ADD`: does everything `COPY` does, plus two specific superpowers: Automatic Tar (`.tar`, etc) Extraction and Remote URL Downloading. E.x. `ADD http://web.com /usr/tool/`
  - `ENV`: add an environment variable.
  - `RUN`: runs a command in the terminal.
  - `EXPOSE`: open up a port, it is through this port that we communicate with our container.
  - `ENTRYPOINT`: defines how we start up our application, the commands need to be **specified as an array**.
  - `VOLUME /container/path`: create a new, empty volume and mount it inside your container. Can be **overridden** by `-v` flag when creating container.

```yaml title='Dockerfile example'
FROM node:latest
WORKDIR /app
COPY . .
ENV PORT=3000
RUN npm install
EXPOSE $PORT # any variables we use needs to be prefixed with a $ character
ENTRYPOINT ["node", "app.js"]
```

## CLI

| Object    | Command                                                  | Purpose                                                                                             |
| --------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Image     | `docker image ls` or `docker images`                     | get all images                                                                                      |
| Image     | `docker build -t chrisnoring/node:latest .`              | create image. '.' specifies location of Dockerfile. `-t`: tag (image's name)                        |
| Container | `docker container ls [-a]` or `docker ps [-a]`           | get all running containers                                                                          |
| Container | `docker run -d -p 8000:3000 --name my-server <image>`    | run container. `-p`: port external:internal. `-d`: detach mode. `--name`: (2 dash) container's name |
| Container | `docker exec -it <id-or-name> bash`                      | execute command (`bash`) inside container. `-it`: interactive mode                                  |
| Container | `docker stop <id-or-name>` (Preferred over `kill`)       | gracefully stop container. Docker sends SIGTERM signal followed by SIGKILL after a grace period     |
| Container | `docker kill <id-or-name>`                               | forcefully stop container. Docker sends SIGKILL right away                                          |
| Container | `docker start <id-or-name>`                              | start an inactive container                                                                         |
| Container | `docker rm <id-or-name>`                                 | remove inactive container                                                                           |
| Volume    | `docker volume ls`                                       | get all volumes                                                                                     |
| Volume    | `docker volume create <name>`                            | create volume                                                                                       |
| Volume    | `docker volume prune`                                    | remove all volumes that are not currently in use                                                    |
| Volume    | `docker volume rm <name>`                                | remove a single volume                                                                              |
| C+Volume  | `docker run -d -v my-volume:/logs <image>`               | (Named Volume) run container. `-v`: volume volume-name:container-directory                          |
| C+Volume  | `docker run -d -v $(pwd)/logs:/logs <image>`             | (Bind Mount) run container. `-v`: volume host-directory:container-directory                         |
| Network   | `docker network create --driver bridge isolated_network` | create a network. `--driver` specifies type                                                         |
| Network   | `docker network connect isolated_network container1`     | attach container 1 to the network                                                                   |
| C+Network | `docker run --network isolated_network`                  | run container on `isolated_network`                                                                 |
| Misc      | `docker inspect <object>`                                | get detail about the object                                                                         |
| Compose   | `docker-compose build`                                   | does `docker build -t [folder-name]/[service-name]`                                                 |
| Compose   | `docker-compose up -d`                                   | does both `docker build` and `docker run`. `-d`: detach mode                                        |
| Compose   | `docker-compose down`                                    | does both `docker stop [id]` and `docker rm [id]`                                                   |
| Compose   | `docker-compose stop [id]` 'id' is optional              | does just `docker stop [id]`. If no 'id', then it stops all services                                |
| Compose   | `docker-compose ps -a`                                   | list of containers that are part of this Docker Compose session                                     |

## Docker Compose

- NOTE: here we use the term 'service' for a container
- Use when you have to manage multiple containers/services
- Currently, Docker supports three different major versions. 3 is the latest major version
- Configure following topics inside of a `docker-compose.yaml`:
  - Build: specify the building context and the name of the Dockerfile, should it not be called the standard name
  - Image: instead of building images from scratch, define ready-made images that we want to pull down from Docker Hub and use in our solution
  - Environment
  - Networks:
    - create networks and for each service specify which network it should belong to
    - by default, docker-compose creates a default network and connects your services to it
  - Ports: define the port forwarding
  - Volumes
- `docker-compose build` & `docker-compose up`:
  - `docker-compose up` works fine for a first-time build + run, where no images exist previously
  - If you are doing a change to a service, however, that needs to be rebuilt, i.e. run `docker-compose build` first and then you need to run `docker-compose up`
- `depends_on` directive within a service:
  - We are able to specify that one container should wait for another container to startup/shutdown first. E.x: first db, then backend server
  - Compose always starts and stops containers in dependency order, where dependencies are determined by `depends_on`, `volumes_from`
  - Short Syntax (Start Order Only):
    - `[service-name]>depends_on>[list-of-service-name]`
    - Default Trap: This only waits for the container to start, not for the application inside it to actually be ready to receive traffic or SQL queries
  - Long Syntax (Advanced Readiness Conditions):
    - It fixes 'default trap'. This lets you tie the startup to a health check
    - Available conditions include:
      1. service_started: The default behavior; waits for the container to be running
      2. service_healthy: Waits until the dependent service's healthcheck succeeds
      3. service_completed_successfully: Waits until a container completes its task and exits with code 0 (ideal for one-off tasks like database migrations)
- `restart` directive within a service: Docker Compose offers four distinct restart policies:
  1. `no`: (default) Never restarts the container automatically
  2. `on-failure`: Restarts only if the container exits with a non-zero error code
  3. `always`: Always restarts the container. On host reboot, it starts even if it was stopped before the shutdown
  4. `unless-stopped`: (Preferred over `always`) Always restarts the container unless you explicitly stopped it before the daemon restarted or host rebooted
- `restart: always` vs. `restart: unless-stopped`: Imagine at 1:00 AM you execute `docker compose stop` for maintenance and at 2:00 AM, the physical server reboots:
  - `always`: When server boots back up at 2:05 AM, Docker sees `always` and forces the container to start up, completely ignoring the fact that you turned it off an hour ago
  - `unless-stopped`: Docker remembers that you explicitly ran `docker compose stop` before the reboot. It says, "The user stopped this on purpose, so I will leave it turned off."

```yaml title='docker-compose.yaml'
# File Structure:
# docker-compose.yaml  ##--> Created at the root of our project
# /product-service
#   app.js
#   package.json
#   Dockerfile
# /inventory-service
#   app.js
#   package.json
#   Dockerfile

version: "3"
services: ##--> containers/services object
  product-service: ##--> name of the service
    build: ##--> instructing how to build image. If we have a ready-made image already we don't need to specify this one
      context: ./product-service ##--> where to find Dockerfile
    ports: ##--> list of port forwarding
      - "8000:3000"
    environment: ## --> list of env variables
      - test=testvalue
    volumes: ##--> list of volumes
      - my-volume:/var/lib/data
      - type: bind ##--> Second item. Alternative short-hand syntax: './product-service:/app'
        source: ./product-service
        target: /app
    depends_on: product-db ##--> (short syntax) instruct the Docker to wait for 'product-db' to start up first
  inventory-service:
    build:
      context: ./inventory-service
    ports:
      - "8001:3000"
    depends_on:
      db:
        condition: service_healthy ##--> (long syntax) Waits until db passes its health check
  product-db:
    image: mysql ##--> use this (instead of 'build') when the image is already built
    restart: always ##--> automatically restart a container whenever it stops or crashes
    environment:
      - MYSQL_ROOT_PASSWORD=complexpassword
    ports:
      - 8002:3306
    networks: ##--> list of networks 'product-db' is part of. Overriding the default
      - products
    healthcheck: ##--> used by 'depends_on > condition'
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 10s
      retries: 5
      start_period: 30s
      timeout: 10s
volumes:
  my-volume: ##--> creating 'my-volume' volume
networks:
  products:

# 'product-service' corresponds to:
# docker build -t [project-directory-name]/product-service .
# docker run -p 8000:3000 --name [project-directory-name]/product-service
```
