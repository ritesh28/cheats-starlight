---
title: Kubernetes
---

- Kubernetes (K8s) is an **open-source container orchestration platform** that automates deployment, scaling, and management of containerized applications
- Like Docker manages a single host, Kubernetes manages multiple Docker hosts/nodes in a cluster
- Kubernetes vs Docker:
  - **Docker**: Container runtime on a single machine (handles containers in isolation)
  - **Kubernetes**: Orchestrates and manages multiple containers across multiple machines (handles cluster-level concerns)
- To use Kubernetes, we need to:
  1. Containerize the application (using Docker)
  2. Define Kubernetes manifests (YAML files describing deployments, services, etc.)
  3. Deploy to a Kubernetes cluster (local or cloud)

## Architecture Overview

- **Master/Control Plane**: Manages the cluster state and makes decisions
  - **API Server**: Entry point for all cluster operations
  - **etcd**: Key-value store that stores cluster state
  - **Scheduler**: Assigns pods to nodes based on resource requirements
  - **Controller Manager**: Runs controller processes (manages desired state)
- **Worker Nodes**: Run containerized applications
  - **Kubelet**: Agent on each node that ensures containers run in pods
  - **Container Runtime**: (Docker, containerd, etc.) runs the containers
  - **kube-proxy**: Manages network routing for services

## Core Concepts

### Cluster
- A set of machines (nodes) managed together as a unit
- Consists of control plane nodes and worker nodes
- Single entry point for all operations via the Kubernetes API

### Node
- A physical or virtual machine that is part of the cluster
- Each node runs the Kubelet agent and container runtime
- Nodes have CPU and memory resources that can be allocated to pods

### Pod
- **Smallest deployable unit** in Kubernetes (compared to containers in Docker)
- Usually contains a single container, but can contain multiple tightly-coupled containers
- All containers in a pod share:
  - Network namespace (same IP address, port space)
  - Storage (volumes)
  - Specifications on how to run the containers
- Pods are ephemeral - they are created and destroyed dynamically

### Label
- Key-value pairs attached to Kubernetes objects
- Used for organizing and selecting subsets of objects
- Example: `app: nginx`, `version: v1`, `environment: production`

### Selector
- Query mechanism to identify a set of objects by their labels
- Example: `app=nginx` selects all objects with label `app: nginx`

## Kubernetes Objects

### Pod
- The basic unit that houses one or more containers
- Containers in a pod can share storage and network resources
- Rarely created directly; usually created by higher-level constructs (Deployments, Jobs)

```yaml title="Pod example"
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
```

### Deployment
- Manages replicated pods (multiple identical pod replicas)
- Provides declarative updates to pods
- Automatically replaces failed pods
- Enables rolling updates and rollbacks
- Most common way to run applications in Kubernetes

```yaml title="Deployment example"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3  # Number of pod replicas
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

### Service
- Exposes a set of pods as a network service
- Provides a stable DNS name and load balancing across pod replicas
- Acts like Docker's network bridges but at cluster level
- Types:
  1. **ClusterIP** (default): Exposes service only within the cluster
  2. **NodePort**: Exposes service on a specific port on each node (accessible from outside)
  3. **LoadBalancer**: Exposes service using cloud provider's load balancer (external IP)
  4. **ExternalName**: Maps service to an external DNS name

```yaml title="Service example"
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx  # Selects pods with this label
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 80        # External port
    targetPort: 80  # Pod's container port
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
  password: cGFzc3dvcmQxMjM=  # base64 encoded
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

### Namespace
- Virtual cluster partitioning within a single Kubernetes cluster
- Allows multiple teams/projects to share the same cluster with isolation
- Resources are namespaced (except cluster-level resources like PV, nodes)
- Default namespace is `default`

### StatefulSet
- Manages stateful applications (databases, caches)
- Provides:
  - Stable network identity (persistent DNS names)
  - Ordered, graceful pod termination and launch
  - Persistent storage per pod
- Example: Running a MySQL database cluster

### DaemonSet
- Ensures a pod runs on **every node** in the cluster (or subset of nodes)
- Used for node-level services (monitoring, logging, network plugins)
- Example: Running Prometheus node exporter on all nodes

### Job
- Creates one or more pods to run a task to completion
- Pod runs until successful completion (exit code 0)
- Used for batch processing, one-off tasks

### CronJob
- Runs jobs on a schedule (like cron jobs in Linux)
- Example: Running database backups every night

## Networking

- Each pod gets its own IP address (unlike Docker where containers share host networking)
- Pods on the same node can communicate via IP without port mapping
- **Service**: Provides stable DNS name and load balancing across pods
- **Ingress**: Routes external traffic to services based on hostname/path rules
- Network policies control traffic flow between pods

```yaml title="Ingress example"
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  rules:
  - host: app.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nginx-service
            port:
              number: 80
```

## Storage

- **Storage Classes**: Define types of storage (SSD, HDD, network storage)
- **PersistentVolume (PV)**: Cluster-level storage resource
- **PersistentVolumeClaim (PVC)**: Pod's request for storage
- **AccessModes**:
  - `ReadWriteOnce (RWO)`: Volume can be mounted by a single node in read-write mode
  - `ReadOnlyMany (ROX)`: Volume can be mounted by multiple nodes in read-only mode
  - `ReadWriteMany (RWX)`: Volume can be mounted by multiple nodes in read-write mode
  - `ReadWriteOncePod`: Volume can be mounted by a single pod

## CLI Commands

| Object              | Command                                          | Purpose                                                                    |
| ------------------- | ------------------------------------------------ | -------------------------------------------------------------------------- |
| Cluster             | `kubectl cluster-info`                           | Get information about cluster                                              |
| Cluster             | `kubectl get nodes`                              | List all nodes in cluster                                                  |
| Node                | `kubectl describe node <node-name>`              | Get detailed info about a specific node                                    |
| Namespace           | `kubectl get namespaces` or `kubectl get ns`     | List all namespaces                                                        |
| Namespace           | `kubectl create namespace <name>`                | Create a new namespace                                                     |
| Namespace           | `kubectl -n <namespace> get pods`                | Get resources in specific namespace (use `-n` flag)                        |
| Pod                 | `kubectl get pods` or `kubectl get po`           | List all pods in current namespace                                         |
| Pod                 | `kubectl get pods -A`                            | List all pods in all namespaces                                            |
| Pod                 | `kubectl describe pod <name>`                    | Get detailed info about a pod                                              |
| Pod                 | `kubectl logs <pod-name>`                        | Get logs from a pod                                                        |
| Pod                 | `kubectl logs <pod-name> -f`                     | Stream pod logs in real-time                                               |
| Pod                 | `kubectl exec -it <pod-name> bash`               | Execute command inside pod (interactive shell)                             |
| Pod                 | `kubectl port-forward <pod-name> 8000:3000`      | Forward local port to pod's port                                           |
| Pod                 | `kubectl delete pod <name>`                      | Delete a pod                                                               |
| Deployment          | `kubectl get deployments` or `kubectl get deploy` | List all deployments                                                       |
| Deployment          | `kubectl describe deployment <name>`             | Get detailed info about a deployment                                       |
| Deployment          | `kubectl apply -f deployment.yaml`               | Create/Update deployment from YAML file                                    |
| Deployment          | `kubectl set image deployment/<name> <container-name>=<new-image>` | Update deployment image (rolling update) |
| Deployment          | `kubectl rollout status deployment/<name>`       | Check rollout status                                                       |
| Deployment          | `kubectl rollout history deployment/<name>`      | View rollout history                                                       |
| Deployment          | `kubectl rollout undo deployment/<name>`         | Rollback to previous deployment version                                    |
| Deployment          | `kubectl scale deployment/<name> --replicas=5`   | Scale deployment to N replicas                                             |
| Deployment          | `kubectl delete deployment <name>`               | Delete a deployment (also deletes its pods)                                |
| Service             | `kubectl get services` or `kubectl get svc`      | List all services                                                          |
| Service             | `kubectl describe service <name>`                | Get detailed info about a service                                          |
| Service             | `kubectl port-forward svc/<service-name> 8000:80` | Forward local port to service's port                                       |
| ConfigMap           | `kubectl get configmaps` or `kubectl get cm`     | List all ConfigMaps                                                        |
| ConfigMap           | `kubectl create configmap <name> --from-literal=KEY=VALUE` | Create ConfigMap from literal values                             |
| ConfigMap           | `kubectl create configmap <name> --from-file=<file-path>` | Create ConfigMap from file                                    |
| Secret              | `kubectl get secrets`                            | List all Secrets                                                           |
| Secret              | `kubectl create secret generic <name> --from-literal=PASSWORD=pwd` | Create Secret                                  |
| Secret              | `kubectl create secret docker-registry <name> --docker-server=docker.io --docker-username=user --docker-password=pwd` | Create Docker registry secret |
| PVC                 | `kubectl get persistentvolumeclaims` or `kubectl get pvc` | List all PVCs                                                              |
| PVC                 | `kubectl describe pvc <name>`                    | Get detailed info about a PVC                                              |
| Storage             | `kubectl get persistentvolumes` or `kubectl get pv` | List all PVs                                                               |
| PV                  | `kubectl describe pv <name>`                     | Get detailed info about a PV                                               |
| StatefulSet         | `kubectl get statefulsets` or `kubectl get sts`  | List all StatefulSets                                                      |
| DaemonSet           | `kubectl get daemonsets` or `kubectl get ds`     | List all DaemonSets                                                        |
| Job                 | `kubectl get jobs`                               | List all Jobs                                                              |
| Job                 | `kubectl describe job <name>`                    | Get detailed info about a job                                              |
| CronJob             | `kubectl get cronjobs` or `kubectl get cj`       | List all CronJobs                                                          |
| Event               | `kubectl get events`                             | List recent cluster events                                                 |
| All Resources       | `kubectl get all`                                | Get all resources in current namespace                                     |
| Resource            | `kubectl apply -f <file.yaml>`                   | Create/Update resource from YAML file (declarative)                        |
| Resource            | `kubectl create -f <file.yaml>`                  | Create resource from YAML file (imperative)                                |
| Resource            | `kubectl delete -f <file.yaml>`                  | Delete resources from YAML file                                            |
| Resource            | `kubectl delete <resource-type> <name>`          | Delete a specific resource                                                 |
| Resource            | `kubectl label <resource-type> <name> key=value` | Add/Update label on resource                                               |
| Resource            | `kubectl annotate <resource-type> <name> key=value` | Add/Update annotation on resource                                          |
| Resource            | `kubectl edit <resource-type> <name>`            | Edit resource interactively                                                |
| Context             | `kubectl config get-contexts`                    | List available contexts (cluster configurations)                           |
| Context             | `kubectl config use-context <context-name>`      | Switch to a different context/cluster                                      |
| Context             | `kubectl config current-context`                 | Show current context                                                       |
| Info                | `kubectl version`                                | Get client and server version                                              |

## Manifest Structure

Most Kubernetes manifests follow this structure:

```yaml title="Generic Kubernetes manifest"
apiVersion: v1               # API version (v1, apps/v1, etc.)
kind: Pod                    # Type of resource (Pod, Deployment, Service, etc.)
metadata:
  name: my-pod               # Name of the resource
  namespace: default         # Namespace (optional, defaults to 'default')
  labels:                    # Key-value pairs for organization
    app: myapp
    version: v1
  annotations:               # Additional metadata (not for selection)
    description: "My pod"
spec:                        # Specification/configuration of the resource
  containers:
  - name: app
    image: myapp:latest
    ports:
    - containerPort: 8080
```

## Comparison with Docker Compose

| Aspect              | Docker Compose           | Kubernetes              |
| ------------------- | ------------------------ | ----------------------- |
| Scope               | Single host              | Multiple hosts/cluster  |
| Scale               | Vertical (on one machine) | Horizontal (across machines) |
| Service discovery   | hostname (container name) | DNS (service name)      |
| Load balancing      | Basic port mapping       | Built-in (Service)      |
| Orchestration       | Basic (manual restart)   | Advanced (auto-healing, scaling) |
| Configuration       | docker-compose.yaml      | Multiple YAML manifests |
| Storage             | Volumes                  | PersistentVolumes       |
| Networking          | Single network per compose | Multiple networks, Ingress |
| Use case            | Development, small apps  | Production, enterprise  |

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
