===========================================================
18. KUBERNETES (K8S)
===========================================================

Definition:

Kubernetes (also called K8s) is a container orchestration
platform.

It is used to manage, deploy, scale and monitor containers
automatically.

Simple meaning:

Docker helps us RUN containers.

Kubernetes helps us MANAGE MANY containers.


-----------------------------------------------------------
Why do we need Kubernetes?
-----------------------------------------------------------

Suppose our application is running in Docker.

We may have:

    Node.js container
    Node.js container
    Node.js container
    Node.js container

Now imagine one container crashes.

Who will restart it?

Who will distribute traffic between containers?

Who will create more containers when traffic increases?

Who will reduce containers when traffic decreases?

Who will deploy a new version without stopping the
application?

Doing all of this manually becomes difficult.

Kubernetes automates these tasks.


-----------------------------------------------------------
Docker vs Kubernetes
-----------------------------------------------------------

Docker:

    Used to create and run containers.

Kubernetes:

    Used to manage containers at a larger scale.


Simple example:

Docker:

    "Run my Node.js application in a container."


Kubernetes:

    "Run 5 containers of my Node.js application.
     If one crashes, replace it.
     If traffic increases, create more.
     Distribute traffic between them."


-----------------------------------------------------------
KUBERNETES CLUSTER
-----------------------------------------------------------

A Kubernetes cluster is a group of machines managed by
Kubernetes.

Example:

                Kubernetes Cluster
                       |
          ---------------------------
          |            |            |
        Node 1       Node 2       Node 3
          |            |            |
         Pods         Pods         Pods


-----------------------------------------------------------
NODE
-----------------------------------------------------------

A Node is a machine/server inside a Kubernetes cluster.

It can be:

    - Physical server
    - Virtual machine
    - Cloud server

Kubernetes uses these nodes to run our application.


-----------------------------------------------------------
POD
-----------------------------------------------------------

A Pod is the smallest deployable unit in Kubernetes.

A Pod usually contains one application container.

Example:

        Pod
         |
         ↓
    Node.js Container


We normally do NOT directly manage containers in Kubernetes.

Instead, Kubernetes manages Pods, and Pods contain
containers.


-----------------------------------------------------------
IMPORTANT RELATIONSHIP
-----------------------------------------------------------

Think about it like this:

Cluster
   ↓
Node
   ↓
Pod
   ↓
Container
   ↓
Application


Example:

Kubernetes Cluster
        |
        ↓
     Node 1
        |
        ↓
      Pod
        |
        ↓
Node.js Container
        |
        ↓
Node.js Application


-----------------------------------------------------------
DEPLOYMENT
-----------------------------------------------------------

A Deployment tells Kubernetes how we want our application
to run.

For example:

    "Run 3 copies of my Node.js application."


Kubernetes will try to maintain:

    Pod 1
    Pod 2
    Pod 3


If Pod 2 crashes:

    Pod 1
    Pod 2  ← crashed
    Pod 3

Kubernetes automatically creates a replacement:

    Pod 1
    Pod 3
    Pod 4  ← new Pod


This is called self-healing.


-----------------------------------------------------------
REPLICAS
-----------------------------------------------------------

A replica means another running copy of the application.

Example:

    replicas: 3

means:

    Run 3 Pods of my application.


Why?

If one Pod crashes, other Pods can continue serving
requests.


-----------------------------------------------------------
SERVICE
-----------------------------------------------------------

A Kubernetes Service provides a stable way to access Pods.

Problem:

Pods can be created and destroyed.

Their IP addresses can change.

So we should not depend directly on Pod IP addresses.

A Service provides a stable network endpoint and can
distribute traffic to the Pods.


Example:

                User
                  |
                  ↓
              Service
             /   |   \
            ↓    ↓    ↓
          Pod 1 Pod 2 Pod 3


The Service distributes requests between the Pods.


-----------------------------------------------------------
INGRESS
-----------------------------------------------------------

Ingress is used to manage external HTTP/HTTPS traffic
into Kubernetes services.

Example:

User
  |
  ↓
example.com
  |
  ↓
Ingress
  |
  ↓
Service
  |
  ↓
Pods
  |
  ↓
Node.js


Ingress can be used for:

    - Domain routing
    - HTTP/HTTPS traffic
    - Routing different URLs to different services


Example:

    api.example.com
          ↓
       API Service

    admin.example.com
          ↓
       Admin Service


-----------------------------------------------------------
CONFIGMAP
-----------------------------------------------------------

ConfigMap is used to store non-sensitive configuration
values.

Example:

    PORT=5000
    NODE_ENV=production


Instead of hardcoding these values inside the application,
Kubernetes can provide them through a ConfigMap.


-----------------------------------------------------------
SECRET
-----------------------------------------------------------

Secret is used to store sensitive configuration values.

Examples:

    Database password
    API keys
    Tokens
    Credentials


Example:

    DB_PASSWORD=secret


Important:

ConfigMap → Normal configuration

Secret → Sensitive configuration


-----------------------------------------------------------
NAMESPACE
-----------------------------------------------------------

A Namespace is used to logically separate resources inside
a Kubernetes cluster.

For example:

    development
    staging
    production


We can have:

    development namespace
        ↓
        API Pods

    production namespace
        ↓
        API Pods


This helps organize large Kubernetes environments.


-----------------------------------------------------------
KUBERNETES YAML
-----------------------------------------------------------

Kubernetes resources are commonly defined using YAML files.

Example:

deployment.yaml

The YAML tells Kubernetes what we want.

For example:

    Application name
    Number of replicas
    Container image
    Container port


Simple example:

apiVersion: apps/v1
kind: Deployment

metadata:
  name: my-api

spec:
  replicas: 3

  selector:
    matchLabels:
      app: my-api

  template:
    metadata:
      labels:
        app: my-api

    spec:
      containers:
        - name: my-api
          image: my-api:1.0
          ports:
            - containerPort: 5000


Don't worry about memorizing this YAML initially.

The important idea is:

YAML
 ↓
Describes desired application state
 ↓
Kubernetes reads it
 ↓
Kubernetes creates/manages the required resources


-----------------------------------------------------------
BASIC KUBERNETES COMMANDS
-----------------------------------------------------------

Check cluster information:

kubectl cluster-info


Check Nodes:

kubectl get nodes


Check Pods:

kubectl get pods


Check Deployments:

kubectl get deployments


Check Services:

kubectl get services


Create/apply a YAML configuration:

kubectl apply -f deployment.yaml


Delete resources:

kubectl delete -f deployment.yaml


See detailed information about a Pod:

kubectl describe pod pod-name


See Pod logs:

kubectl logs pod-name


-----------------------------------------------------------
WHAT IS kubectl?
-----------------------------------------------------------

kubectl is the command-line tool used to communicate with
a Kubernetes cluster.

Simple meaning:

kubectl = Command-line tool for Kubernetes


Example:

kubectl get pods

means:

"Show me the Pods running in my Kubernetes cluster."


-----------------------------------------------------------
KUBERNETES SELF-HEALING
-----------------------------------------------------------

One of the important features of Kubernetes is self-healing.

Suppose we want:

    replicas: 3


Kubernetes keeps checking the desired state.

Desired:

    3 Pods


Current:

    2 Pods


Kubernetes notices the difference and creates another Pod.


So:

Desired State:
    3 Pods

Current State:
    2 Pods

Kubernetes:
    Creates 1 more Pod


This is one of the main benefits of Kubernetes.


-----------------------------------------------------------
KUBERNETES SCALING
-----------------------------------------------------------

Suppose our application currently has:

    3 Pods


Traffic increases.

We can increase the number of replicas:

    3 → 5


Now Kubernetes runs:

    Pod 1
    Pod 2
    Pod 3
    Pod 4
    Pod 5


This is called scaling.


We can also reduce them:

    5 → 3


This helps use resources efficiently.


-----------------------------------------------------------
ROLLING UPDATE
-----------------------------------------------------------

Suppose production is running:

    my-api:v1


We create a new version:

    my-api:v2


Kubernetes can gradually replace the old Pods with new Pods.

Example:

    v1
    v1
    v1

        ↓

    v2
    v1
    v1

        ↓

    v2
    v2
    v1

        ↓

    v2
    v2
    v2


This is called a rolling update.

It helps deploy new versions without taking the entire
application offline.


-----------------------------------------------------------
LOAD BALANCING
-----------------------------------------------------------

Suppose we have:

    Pod 1
    Pod 2
    Pod 3


Users send requests.

Kubernetes Service can distribute traffic:

User 1 → Pod 1
User 2 → Pod 2
User 3 → Pod 3
User 4 → Pod 1


This prevents all traffic from going to a single Pod.


-----------------------------------------------------------
KUBERNETES + DOCKER
-----------------------------------------------------------

A common flow is:

Developer
    ↓
Dockerfile
    ↓
Docker Image
    ↓
Container Registry
    ↓
Kubernetes
    ↓
Pods
    ↓
Node.js Application


Example:

1. Developer creates Node.js application.

2. Dockerfile is created.

3. Docker builds the application image.

4. Image is pushed to a container registry.

5. Kubernetes pulls the image.

6. Kubernetes creates Pods.

7. Pods run the Node.js application.


-----------------------------------------------------------
KUBERNETES + NGINX
-----------------------------------------------------------

Nginx and Kubernetes can be used together.

A simplified architecture can look like:

Internet
   |
   ↓
Nginx / Ingress
   |
   ↓
Kubernetes Service
   |
   ↓
-------------------------
|          |            |
Pod 1     Pod 2        Pod 3
|          |            |
Node.js   Node.js      Node.js
-------------------------
          |
          ↓
       Database


The exact architecture can vary depending on the
infrastructure.


-----------------------------------------------------------
KUBERNETES + CI/CD
-----------------------------------------------------------

Kubernetes can also be part of a CI/CD pipeline.

Example:

Developer
    ↓
Git Push
    ↓
GitHub
    ↓
GitHub Actions
    ↓
Run Tests
    ↓
Build Docker Image
    ↓
Push Image to Container Registry
    ↓
Deploy to Kubernetes
    ↓
Kubernetes updates Pods
    ↓
Production


-----------------------------------------------------------
DOCKER + PM2 + KUBERNETES
-----------------------------------------------------------

These tools solve different problems.

Docker:

    Creates and runs containers.


PM2:

    Manages Node.js processes.


Kubernetes:

    Manages containerized applications across a cluster.


In a simple VPS deployment:

    Nginx
      ↓
    PM2
      ↓
    Node.js


In a containerized Kubernetes deployment:

    Ingress
      ↓
    Service
      ↓
    Kubernetes Pods
      ↓
    Containers
      ↓
    Node.js


When Kubernetes manages the containers, we generally don't
need PM2 just to restart individual Node.js processes because
Kubernetes handles container/Pod lifecycle management.


-----------------------------------------------------------
IMPORTANT KUBERNETES TERMS TO REMEMBER
-----------------------------------------------------------

Cluster
→ Group of machines managed by Kubernetes.


Node
→ Machine/server inside the cluster.


Pod
→ Smallest deployable unit, usually containing a container.


Deployment
→ Defines and manages the desired number/version of Pods.


Replica
→ Another copy of an application Pod.


Service
→ Stable network endpoint that exposes Pods and distributes
  traffic.


Ingress
→ Manages external HTTP/HTTPS routing into the cluster.


ConfigMap
→ Stores non-sensitive configuration.


Secret
→ Stores sensitive configuration.


Namespace
→ Logical separation of resources.


kubectl
→ Command-line tool used to interact with Kubernetes.


-----------------------------------------------------------
COMMON INTERVIEW QUESTIONS
-----------------------------------------------------------

Q1. What is Kubernetes?

Answer:

Kubernetes is a container orchestration platform used to
deploy, manage, scale and maintain containerized
applications.


Q2. Why do we use Kubernetes?

Answer:

We use Kubernetes to manage containers automatically,
including scaling, load balancing, self-healing and
deployments.


Q3. What is a Pod?

Answer:

A Pod is the smallest deployable unit in Kubernetes and
usually contains one application container.


Q4. What is a Node?

Answer:

A Node is a machine inside a Kubernetes cluster where
applications and Pods run.


Q5. What is a Cluster?

Answer:

A Kubernetes cluster is a group of Nodes managed by
Kubernetes.


Q6. What is a Deployment?

Answer:

A Deployment manages the desired number and version of
application Pods.


Q7. What is a Kubernetes Service?

Answer:

A Service provides a stable way to access Pods and can
distribute traffic between them.


Q8. What is Ingress?

Answer:

Ingress manages external HTTP/HTTPS traffic and routes
requests to Kubernetes Services.


Q9. What is kubectl?

Answer:

kubectl is the command-line tool used to communicate with
and manage a Kubernetes cluster.


Q10. What happens if a Pod crashes?

Answer:

Kubernetes detects that the desired number of Pods is not
running and creates a replacement Pod.


Q11. Docker vs Kubernetes?

Answer:

Docker is used to create and run containers, while
Kubernetes is used to manage containerized applications
at scale.


Q12. Do we need PM2 with Kubernetes?

Answer:

Usually not for basic process management. Kubernetes
manages the lifecycle of containers and Pods, so PM2 is
often unnecessary in a Kubernetes deployment.


-----------------------------------------------------------
SIMPLE REAL-WORLD EXAMPLE
-----------------------------------------------------------

Suppose we have a Node.js API.

Without Kubernetes:

    VPS
     |
     ↓
    Node.js
     |
     ↓
   Database


With Docker:

    VPS
     |
     ↓
   Docker
     |
     ↓
 Node.js Container
     |
     ↓
  Database


With Kubernetes:

             Kubernetes Cluster
                    |
          ---------------------
          |         |         |
        Node 1    Node 2    Node 3
          |         |         |
        Pod 1     Pod 2     Pod 3
          |         |         |
       Node.js   Node.js   Node.js
          \         |         /
           \        |        /
              Service
                 |
                 ↓
              Ingress
                 |
                 ↓
               Users


Kubernetes automatically helps keep the required Pods
running and distributes traffic between them.


===========================================================
ONE-MINUTE KUBERNETES INTERVIEW ANSWER
===========================================================

"Kubernetes is a container orchestration platform used to
manage containerized applications.

For example, if I have a Node.js application running in
Docker, Kubernetes can manage multiple instances of that
application.

A Kubernetes cluster contains Nodes, and Nodes run Pods.
Pods usually contain our application containers.

We can use Deployments to define how many replicas of our
application should run. Services provide stable networking
and distribute traffic between Pods. Ingress can handle
external HTTP or HTTPS traffic.

Kubernetes also provides features like self-healing,
scaling and rolling deployments.

A typical flow can be:

Docker Image
     ↓
Kubernetes
     ↓
Deployment
     ↓
Pods
     ↓
Service
     ↓
Ingress
     ↓
Users"


===========================================================
FINAL EASY FLOW TO REMEMBER
===========================================================

Docker
→ Creates the container image


Kubernetes
→ Manages the containers


Cluster
→ Complete Kubernetes environment


Node
→ Machine/server in the cluster


Pod
→ Runs the application container


Deployment
→ Says how many Pods and which version to run


Service
→ Gives Pods a stable way to communicate and receive traffic


Ingress
→ Brings external HTTP/HTTPS traffic into Kubernetes


kubectl
→ Command used to control Kubernetes


Final flow:

Developer
    ↓
Dockerfile
    ↓
Docker Image
    ↓
Container Registry
    ↓
Kubernetes Cluster
    ↓
Node
    ↓
Pod
    ↓
Container
    ↓
Node.js Application
    ↓
Service
    ↓
Ingress
    ↓
User