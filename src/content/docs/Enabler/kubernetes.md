---
title: Kubernetes
---

![overview](./kubernetes.drawio.svg)

- Kubernetes (K8s) is a **container orchestration platform** that automates deployment, scaling, distributing loads and management of containerized applications
- When using k8s, do not use Docker Volume, Docker Network or docker-compose.yaml
- Kubernetes add-ons are plug-ins that enhance the cluster's functionality
- Minikube: a tool that lets you run/create a **single-node k8s cluster** locally on your own computer. Basic commands: `minikube start|status|dashboard|stop`
  - In Minikube's single-node setup, that one single machine acts simultaneously as the master node (control plane) and the worker node
  - While it defaults to a single node, you can force Minikube to spin up distinct worker nodes if you want to test how your apps behave across multiple machines
  - `minikube start --nodes 3`: it creates one master/worker node, and two dedicated worker-only nodes on your computer
- kubectl: a command-line tool used to control and communicate with a Kubernetes cluster
- k8s objects:
  1. Cluster: A set of machines (nodes) managed together as a unit. Consists of master (control plane) nodes (plural; others act as backup) and worker nodes
  2. Node: A physical or virtual machine that is part of the cluster. Types: Master Node (control plane) & Worker Node
     - Master Node contains API Server, Scheduler, Controller Manager, and Etcd
     - Worker Node contains kubelet, kube-proxy, container runtime and pods
  3. Pod: A smallest deployable unit which runs on a Node. Contains containerized apps and shared resources for those containers
- API objects/resources:
  1. Service: Its an abstraction which defines a logical set of Pods and a policy by which to access them
  2. ReplicaSet: Its an artifact/object that ensures that the right number of identical Pods are running
  3. Deployment: It instructs Kubernetes how to create and update instances of your application
  4. DaemonSet: Strictly binds one Pod per Node across the cluster. Scales automatically; adding a node spawns a new Pod. Use Case: Infrastructure agents, logging, monitoring
  5. Job: It is designed for short-lived, batch processing tasks
  6. ConfigMap: Its an object that stores configuration settings (or env variables) separately from the application
  7. Secret: Its an object that stores sensitive data like password, token, or API key
  8. Persistent Volume (PV): Its a storage object in the cluster that you can use to store data and it doesn’t get deleted when a Pod is removed or restarted
- 3 commonly used controllers for creating Pods are:
  1. Jobs → For batch tasks that run once and complete (ephemeral)
  2. Deployments → For stateless and persistent applications, such as web services
  3. StatefulSets → For stateful and persistent applications, like databases
- Manifest/Declarative/Spec YAML file: must contain four required root-level fields to describe the desired state of a cluster resource:
  1. apiVersion: API version (v1, apps/v1, etc.)
  2. kind: The type of object you want to spin up (e.g., Pod, Deployment, Service)
  3. metadata: Data that uniquely identifies the object, such as its name, namespace, and labels
  4. spec: The technical specification describing your desired end-state for the object

## Node

- Node is a single machine, either a physical server or a virtual machine, that runs the necessary components to execute and manage containerized applications
- Can have multiple master nodes. But at a given time, only one is active and others as used as backup (if the active master node goes down)
- Relationship: 1 active master node and multiple worker nodes
- Master Node **automatically** handles scheduling the Pods across the Nodes in the cluster
- Master Node modules:
  1. API server: Every request—whether from you (`kubectl`), a configuration file, or another system—comes through here **first**
  2. Scheduler: When you say “I want to deploy my application,” someone needs to decide which worker node it should run on. That’s the Scheduler’s job
  3. Controller Manager: It constantly watches the cluster and fixes problems. If a Pod crashes, it restarts it. If a Deployment says 3 replicas, it scaleup/down to match total pods
  4. Etcd (Linux `/etc` directory): Its a a database that stores all cluster information — configurations, state, secrets, everything
- Worker Node modules:
  1. Kubelet: It’s the bridge between the Control Plane and the actual containers on that node
     - Receives Pod specifications from the API Server
     - Talks to the Container Runtime to start containers
     - Monitors container health and reports back to the Control Plane if something is wrong
     - Restarts containers if they crash
  2. Kube Proxy: It manages network rules for **all pods across all nodes**. It ensures that requests reach the right Pod and distributes load across multiple Pods.
     - kube-proxy reads cluster-wide network information (every pod IP across all nodes) to build its local routing tables
     - Unlike kube-proxy, kubelet only looks inward, managing the lifecycle of containers running locally on its own hardware
     - It is the process responsible for forwarding the request from Kubernetes Services to the right pods
  3. Container Runtime (like Docker): Its the software that actually runs your containers. It pulls images and run them
- Why kube-proxy on worker node and not on master node:
  - Network traffic interception must happen exactly where the application workloads are running
  - Bottleneck: every network packet traveling b/t apps would have to travel out of its worker node, jump to master node, and then jump back to destination worker node
  - Availability: because kube-proxy lives on the worker nodes, pods can still talk to each other through Services even if the master node completely goes offline

## Pod

- **Smallest deployable unit** in Kubernetes (compared to containers in Docker)
- A Pod is an abstraction that represents a group of one or more containers and some shared resources for those containers. Those resources include:
  - Shared Networking: Every Pod is assigned a unique IP address. All containers within that Pod communicate with each other using `localhost`
  - Shared Storage: Containers within a Pod can share storage volumes, allowing them to have a common filesystem and exchange data seamlessly
- Each Pod in a Kubernetes cluster has a unique IP address, even Pods on the same Node
- Multi-container pod:
  - All containers within a single Pod are guaranteed to be co-located on the same worker node, and they share the same environment
  - init containers: special containers that run sequentially before the main container. Role: prepare environment, set up configurations, or perform database migrations
  - multi-container (sidecar pattern): sidecars provide logging, monitoring, or proxy functionality alongside the main application container
- Pods runs in a private isolated network:
  - visible from other Pods and services
  - By default, it cannot be accessed from outside the network. This can be changed via multiple ways
  - One way to access from outside is to use a proxy - `kubectl proxy` - which will expose `kubectl` as an API
    - The API Server inside of Kubernetes have created an endpoint for each pod by its pod name
    - `curl http://localhost:8001/api/v1/namespaces/default/pods/$POD_NAME`
    - `curl 127.0.0.1:8001` list all valid paths
- 5-phase Pod life cycle:
  1. Pending: It has been accepted by master node but is waiting for resources to become available. K8s decides on which node it should run and pulls the required container images
     - It pulls the images just to be efficient
  2. Running: All containers in the Pod have been started, and the application is executing its workload
  3. Succeeded: When all its containers have completed successfully. This is common for batch jobs or one-time tasks where completion is the goal
  4. Failed: At least one container terminates with an error and won’t be restarted
  5. Unknown: It indicates that the state of the Pod cannot be determined, often due to communication issues with the node
- Communication between Pods:
  - Intra-Pod (Same Pod): Containers within same Pod share a single IP address. They communicate with each other via `localhost` using different port numbers
  - Service-Level Discovery: Pod IPs are temporary. So a Pod talk to the Service, which then load-balances the traffic to the correct Pods
  - External Access: To reach Pods from outside cluster, use Ingress (app layer, more control) or LoadBalancer (network layer) Service, which maps external traffic to internal cluster

```yaml title="Web Server Pod"
apiVersion: v1
kind: Pod
metadata:
  name: web-server-pod
  namespace: production # specifying namespace where we want to create pod
  labels:
    app: frontend
    environment: production
spec:
  containers:
    - name: nginx-container
      image: nginx:1.25
      ports:
        - containerPort: 80 # exposes port 80 inside the container so it can receive network traffic
```

## Namespace & Context

- Namespaces act as virtual clusters, enabling logical isolation and resource management for different teams or projects
- Context is basically cluster
- Install Tools - `kubectx` and `kubens`:
  - `kubectx` is a tool to switch between contexts (clusters)
    - `kubectx`: list down all cluster (active cluster is marked in different color)
    - `kubectx minikube`: Switch to another cluster
  - `kubens` is a tool to switch between Kubernetes namespaces
    - `kubens`: list down all namespace (active namespace is marked in different color)
    - `kubens my-ns`: Switch to another namespace. This means that by default if we do not specify the namespace the components will be created in `my-ns`

## Service

- A Service in Kubernetes is an abstraction which defines a logical set of Pods and a policy by which to access them
- We need service because pod IP address keep changing (every time pod is restarted)

### Service & Label

- The set of Pods targeted by a Service is determined by a `LabelSelector`
- By applying labels, e.x. frontend, db - high-level domain language - to Pods, we are able to refer to Pods by their logical name rather than their specifics, i.e IP number
- Labels are key/value pairs attached to objects at creation time or later on. They can be modified at any time

### Service & Traffic

- Services allow your applications to receive traffic from inside (default) and outside the cluster
- Services have an integrated load-balancer that will distribute network traffic to all Pods of an exposed Deployment
- Services will monitor continuously the running Pods using **endpoints**, to ensure the traffic is sent only to available Pods
- Services can be exposed in different ways by specifying a `type` in `ServiceSpec` (service specification):
  1. `ClusterIP` (Default / Internal Only): This type gives your Service a **permanent IP** address that is only valid inside the cluster
     - Base use case: Databases, cache layers, or backend microservices that should never be exposed to the public internet
  2. `NodePort` (External Gateway): This type opens a specific, identical **port** on every single server node in your cluster
     - Kubernetes forward any traffic hitting `<Any-Node-IP>:<NodePort>` straight to your underlying Pods
     - Superset of ClusterIP: Kubernetes automatically creates a ClusterIP behind the scenes
     - Best use case: Good for testing, development, or environments where you do not have a cloud provider to automatically give you a load balancer
  3. `LoadBalancer` (The Cloud Standard): This type connects your Kubernetes cluster directly to your cloud provider's infrastructure (like AWS, Google Cloud, or Azure)
     - Kubernetes tells your cloud provider to spin up a physical, external load balancer appliance. The cloud provider assigns a **public IP address** to it
     - Anyone on the internet can hit this public IP, and the cloud infrastructure will route the traffic to those NodePorts
     - Superset of NodePort: Kubernetes automatically creates a NodePort and a ClusterIP behind the scenes
  4. `ExternalName` (Internal Alias/Shortcut): Its different from the other 3. It does not route traffic to Pods, and it does not use a proxy (`kube-proxy`)
     - It acts as a simple DNS shortcut (a CNAME record). It maps an internal Kubernetes DNS name to an external domain name
     - Example:
       - If your app inside Kubernetes needs to talk to an external database hosted at `://amazon.com`, you can create an ExternalName service called `my-database`
       - When your code looks up `my-database`, Kubernetes instantly tells it to go to `://amazon.com` instead
     - Best use case: linking your internal containers to external, third-party APIs and legacy databases
- Create Service: `kubectl expose deployment/kubernetes-first-app --type="NodePort" --port 8080`:
  - Here we are just targeting one of the deployment `kubernetes-first-app` and referring to it with `<type>/<name>`
  - Expose it as service of type NodePort and finally, we choose to expose it at port 8080
  - On running `kubectl get services/kubernetes-first-app`, I got port as `8080:31468/TCP`: (opposite to Docker port mapping)
    - 31468: NodePort (External Entry Point). To access from outside, use `curl http://<YOUR-NODE-IP>:31468`
    - 8080: Cluster Port (Internal Entry Point). To access from within th cluster, use `curl <SERVICE-CLUSTER-IP>:8080`

## Label & Selector

- Labels are key/value pairs. They are the primary way to organize your resources
- Selectors are how you find and filter those objects based on the labels
- Types of selectors:
  1. Equality-Based: Exact match. Operators: `=, ==, and !=`. No difference between '=' & '=='.
     - `kubectl get pods -l 'tier=backend,environment=production'`: Find the Pod that is both backend and production
  2. Set-Based: More flexible. Operators: `in, notin, and exists`
     - `kubectl get pods -l 'environment in (development,staging)'`: Find all Pods in either the development or staging environment
     - `kubectl get pods -l 'app'`: Find all Pods that have an app label, regardless of its value (the `exists` operator)

## ReplicaSet

- Its an artifact/object that can drive the cluster back to **desired state** via the creation of new Pods to keep your application running
- Desired State: You need to specify how many containers you want of each kind, at all times - like 4 database containers or 3 services
- ReplicaSet name format: `[DEPLOYMENT-NAME]-[RANDOM-STRING]`
- Use Deployment. Avoid ReplicaSet:
  - Deployment is a higher-level abstraction that manages application rollouts and rollbacks
  - Whereas a ReplicaSet is a lower-level mechanism strictly responsible for ensuring a specified number of identical pod replicas are running at any given time
  - Deployment does not manage Pods directly. Instead, it manages ReplicaSets, and ReplicaSets manage Pods

## Deployment

- A Deployment is a Kubernetes object used to manage a set of Pods running your containerized applications
- It provides declarative updates, meaning you tell Kubernetes what you want, and it figures out how to get there
- Behind-the-Scenes Workflow for `kubectl create deployment`:
  1. Scheduling: The Kubernetes Scheduler searches for a suitable node. Since Minikube only has one node, it chooses that one
  2. Deployment Tracking: The Deployment controller notes that your application must always have 1 instance running
  3. Execution: The kubelet on that chosen node downloads your container image and spins up the container using container runtime
  4. Rescheduling Protection: Because it is managed by a Deployment, if that node crashes or fails, k8s instantly recreate that instance on a new node the moment one becomes available
- `kubectl get deployments` returns following important columns:
  - `READY`: format: `Current-Healthy-Pods / Desired-Total-Pods`
  - `UP-TO-DATE`: tells how many Pods have the **most recent version** of the configuration blueprint/specs
    - Why it matters: When app's code is changed, K8s doesn't kill all old apps at once. It does a "rolling update" — gradually spinning up new pods while terminating old ones
  - `AVAILABLE`: tells how many Pods are fully operational and have been accessible to users for a safe amount of time (configured via a setting `minReadySeconds`)
    - vs `READY`: A Pod might be "Ready" the exact millisecond its container starts up, but it might take a few seconds to load data or initialize
    - "Available" confirms the Pod is stable, has passed its health checks, and is reliably serving users

```yaml title='web app'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app-deployment
  labels:
    app: web-app
spec:
  replicas: 3 # run exactly three identical instances (Pods) of your application at all times
  selector: # define how to select pods. It looks for Pods matching the label app: web-app
    matchLabels:
      app: web-app
  template: # defines the blueprint for the Pods that Kubernetes will create
    metadata:
      labels: # assigns the label app: web-app to the created Pods. This must match the matchLabels defined in the selector above
        app: web-app
    spec:
      containers:
        - name: nginx-container
          image: nginx:1.25.4
          ports:
            - containerPort: 80 # exposes port 80 inside the container so it can receive network traffic
          resources: # controls hardware allocation
            limits: # set the maximum amount of CPU and memory the container is allowed to consume
              memory: "256Mi"
              cpu: "500m"
            requests: # guarantee the minimum CPU and memory the container needs to start
              memory: "128Mi"
              cpu: "250m"
```

### Deployment & Scale

- Scaling is accomplished by changing the number of replicas in a Deployment
- When scaled, kubernetes is ready to **load balance** any incoming requests - given that a **service is already attached** to the said deployment
- Self-healing: Its Kubernetes way of ensuring that the desired state is maintained - `kubectl scale ... --replicas=4`
- Auto-scaling: We don't set the number of replicas but rather rely on K8s to create the number of replicas it thinks it needs by specifying CPU utilization or other metrics
- General Horizontal Scaling Vs Vertical Scaling:
  - Horizontal Scaling (Scaling Out): means adding more machines to your infrastructure to distribute the workload
  - Vertical Scaling (Scaling Up): means adding more power (such as CPU, RAM, or storage) to an existing single machine
- Horizontal auto-scaling (HPA - horizontal pod auto-scaler):
  - It consists of two parts a `resource` and a `controller`
  - `controller` checks utilization, or whatever metric you decided, to ensure that the number of replicas matches your specification
  - The default is checking every 15 seconds but you can change that by setting `--horizontal-pod-autoscaler-sync-period`
  - Equation for deciding number of replicas: `desiredReplicas = ceil[currentReplicas * ( currentMetricValue / desiredMetricValue )]`
  - 2 things we need to specify when we do autoscaling:
    1. min/max: set a minimum and maximum in terms of how many Pods we want
    2. metric: for e.x. set a certain CPU utilization percentage. If CPU value greater than the threshold, k8s scale out. IF CPU value is lower, k8s matches min value
  - `kubectl autoscale deployment/php-apache --cpu=50 --min=1 --max=10`: If CPU load is >= 50% create a new Pod. Maximum 10 Pods. If load is low go back gradually to 1 Pod

### Deployment & Rolling

- Roll back: In kubernetes deployment, you can revert back to the previous version of the application if you find any bugs in the present version
- Steps for rolling back a deployment:
  1. List all the revisions and select the version of deployment to which you want to roll back
  2. Roll back to the previous (or stable) version of the deployment
- Zero-Downtime Rollouts: By default, Kubernetes deployments use the `RollingUpdate` strategy:
  - Gradual replacement: It replaces old pods with new ones step-by-step
  - Continuous availability: Old pods remain online until new pods are ready
  - Smart traffic routing: The Service component only sends user traffic to healthy, running pods
- You can pause (`kubectl rollout pause ...`) the deployments which you are updating currently and later resume (`kubectl rollout resume ...`)
  - Why do this?: This is highly useful if you want to make multiple changes at once without triggering a separate, resource-heavy, time-consuming rollout for every single command
  - When you pause the rollouts you can update the image using `kubectl set image deployment/webapp-deployment webapp=webapp:2.1`
  - To actually replace the current version with the new image, you must explicitly resume the deployment

## Job

- Job, unlike Deployment, is designed for short-lived, batch processing tasks. The primary purpose is to execute a task and exit with code 0
- Job will create a pod, monitor the task, and recreate another one if that pod fails for some reason. Upon completion of the task, it will terminate the pod
- When a job is suspended, all of its active Pods are deleted until the job is restarted
- A CronJob is the same as a regular Job, only it creates jobs on a schedule
- Example:
  - Database Migrations: Upgrading database schemas before launching a new application version
  - Data Seeding: Populating a database or cache with initial dummy data
  - Batch Processing: Running nightly data backups, reports, or file conversions
  - Automated Testing: Running a test suite inside a staging environment

```yaml title='PI Calculator'
apiVersion: batch/v1
kind: Job
metadata:
  name: pi-calculator
spec:
  # Scaling and Control Configurations
  completions: 10 # Kubernetes will not mark this Job as complete until it registers 10 successful Pod runs
  parallelism: 2 # Process exactly 2 pods at the same time
  backoffLimit: 4 # Max retry attempts before failing the entire job
  activeDeadlineSeconds: 60 # Kill the entire job if it takes longer than 1 minute

  template:
    spec:
      containers:
        - name: pi
          image: perl:5.34
          command: ["perl", "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never # Required for Jobs. Alternatives: 'OnFailure'
```

## CLI

- Image Naming Format: `[<registry>/][<project>/]<image>[:<tag>|@<digest>]` e.g. gcr.io/google-samples/kubernetes-bootcamp:v1
- K8s Specific Object Command - 3 different variant of same command:
  - `kubectl <cmd> <object-type>/<object-name> ...`. "/" delimiter
  - `kubectl <cmd> <object-type> <object-name> ...`. space delimiter
  - `kubectl <cmd> <object-type>(s) <object-name> ...`. plural object type
- `kubectl apply -f ...`:
  - **Declarative approach**, meaning it tells Kubernetes to make the cluster's live state match the state defined in the file
  - For `pod.yaml` : if you were to change the file and run kubectl apply again, Kubernetes would intelligently update the existing Pod to match your new desired state
- `kubectl create -f ...`: (AVOID). Imperative approach

| Object     | Command                                                                       | Usage                                                                              |
| ---------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Node       | `kubectl get nodes`                                                           | get all nodes                                                                      |
| Namespace  | `kubectl get namespaces`                                                      | get all namespaces                                                                 |
| Namespace  | `kubectl create namespace my-ns`                                              | create a new Namespace                                                             |
| Pod        | `kubectl get pods [-l <key>=<value>] [--show-labels] [-o wide]`               | get all pods. `-l`:label. `-o`:output                                              |
| Pod        | `kubectl run <pod-name> --image=nginx --port=8080`                            | create Pod "Imperatively". Use yaml (declarative). `--port`: container expose port |
| Pod        | `kubectl logs <pod-name> [-n prod] [-c server] [-f] [--tail=50] [--since=1h]` | get logs. `-n`: namespace. `-c`: container. `-f`: follow/live                      |
| Pod        | `kubectl exec -it [-c server] <pod-name> -- bash` ('--' absent in docker cli) | execute shell command in container                                                 |
| Pod        | `kubectl delete pod/<pod-name>`                                               |                                                                                    |
| Label      | `kubectl label pod <pod-name> app=v1 [--overwrite]`                           | add/apply new label. Use `--overwrite` to update existing label                    |
| Deployment | `kubectl get deployments`                                                     |                                                                                    |
| Deployment | `kubectl create deployment first-app --image=nginx --port=8080`               | create deployment. Use yaml (declarative). `--port`: container expose port         |
| Scale      | `kubectl scale deployment/first-app --replicas=4`                             |                                                                                    |
| Autoscale  | `kubectl autoscale deployment/php-apache --cpu=50 --min=1 --max=10`           |                                                                                    |
| Service    | `kubectl expose deployment/first-app --type="NodePort" --port 8080`           | create service                                                                     |
| Service    | `kubectl get services [-l <key>=<value>]`                                     | get all services. `-l`:label                                                       |
| Service    | `kubectl delete service [-l <key>=<value>]`                                   | delete based on label                                                              |
|            | `kubectl proxy`                                                               |                                                                                    |
|            | `kubectl get hpa`                                                             |                                                                                    |
| Job        | `kubectl get jobs`                                                            |                                                                                    |
| Job        | `kubectl delete job/ping`                                                     |                                                                                    |
| Rollout    | `kubectl rollout history deployment/nginx`                                    | get previous rollout revisions. Pass `--revision=3` to view detailed history       |
| Rollout    | `kubectl rollout undo deployment/nginx --to-revision=1`                       | Roll back to deployment revision 1 (1 means previous version of the deployment)    |
| Rollout    | `kubectl rollout status deployment/nginx`                                     | Show the status of the rollout. By default it will watch until it's done           |
| Manifest   | `kubectl run nginx --image=nginx --dry-run=client -o yaml > pod.yaml`         | generate boilerplate YAML                                                          |
| Manifest   | `kubectl get deployment my-app -o yaml > deployment.yaml`                     | export YAML from a running resource                                                |
| Manifest   | `kubectl apply -f manifest.yaml [--dry-run=server]`                           | apply a manifest file. `--dry-run`: validate syntax                                |
| Misc       | `kubectl describe deployment/first-app`                                       | get detailed information                                                           |
| Misc       | `kubectl .... --help`                                                         | get help                                                                           |

## TODO

- To wait for a container to finish or become ready before starting another one in Kubernetes, you should use Init Containers ======ELABORATE=========
- StatefulSet k8s object

## Core Concepts

## Kubernetes Objects

### Service

```yaml title="Service example"
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx # Selects pods with this label
  type: LoadBalancer
  ports:
    - protocol: TCP
      port: 80 # External port
      targetPort: 80 # Pod's container port
```

### ConfigMap

- Stores non-sensitive configuration data as key-value pairs
- Decouples configuration from application code
- Can be mounted as files or environment variables

```yaml title="ConfigMap example"
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DATABASE_URL: "postgres://db:5432"
  LOG_LEVEL: "info"
```

### Secret

- Similar to ConfigMap but stores sensitive data
- Data is base64 encoded (not encrypted by default)
- Can be mounted as files or environment variables

```yaml title="Secret example"
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  password: cGFzc3dvcmQxMjM= # base64 encoded
```

### PersistentVolume (PV)

- **Cluster-wide storage resource** (similar to Docker volumes but at cluster level)
- Decoupled from pods - persists data beyond pod lifecycle
- Provisioned by administrators
- Not namespaced - available across the entire cluster

### PersistentVolumeClaim (PVC)

- Request for storage by a pod
- User's request for storage (PV is the actual storage)
- Acts as a claim that binds to an available PV
- Namespaced - within a specific namespace

```yaml title="PVC and Pod example"
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
---
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-pvc
spec:
  containers:
    - name: app
      image: app:latest
      volumeMounts:
        - name: storage
          mountPath: /data
  volumes:
    - name: storage
      persistentVolumeClaim:
        claimName: my-pvc
```

### StatefulSet

- Manages stateful applications (databases, caches)
- Provides:
  - Stable network identity (persistent DNS names)
  - Ordered, graceful pod termination and launch
  - Persistent storage per pod
- Example: Running a MySQL database cluster

## Storage

- **Storage Classes**: Define types of storage (SSD, HDD, network storage)
- **PersistentVolume (PV)**: Cluster-level storage resource
- **PersistentVolumeClaim (PVC)**: Pod's request for storage
- **AccessModes**:
  - `ReadWriteOnce (RWO)`: Volume can be mounted by a single node in read-write mode
  - `ReadOnlyMany (ROX)`: Volume can be mounted by multiple nodes in read-only mode
  - `ReadWriteMany (RWX)`: Volume can be mounted by multiple nodes in read-write mode
  - `ReadWriteOncePod`: Volume can be mounted by a single pod

## Best Practices

1. **Always specify resource requests and limits** on containers
2. **Use labels and selectors** for organizing and querying objects
3. **Use Deployments** instead of bare pods for production workloads
4. **Use Services** to expose applications (not pod IPs directly)
5. **Separate configuration from code** using ConfigMaps and Secrets
6. **Use namespaces** to organize and isolate resources
7. **Set up proper RBAC** (Role-Based Access Control) for security
8. **Use health checks** (livenessProbe, readinessProbe) for reliability
9. **Implement resource quotas** to prevent resource exhaustion
10. **Use version control** for all Kubernetes manifests (GitOps approach)
