===========================================================
        DEVOPS / DEPLOYMENT INTERVIEW QUICK NOTES
===========================================================

Topics:

1. Linux VPS
2. Docker
3. Nginx
4. Reverse Proxy
5. PM2
6. GitHub Actions
7. CI/CD
8. Deployment Flow
9. Common Interview Questions
===========================================================



===========================================================
1. LINUX VPS
===========================================================

Definition:

VPS = Virtual Private Server.

It is a virtual server hosted by a cloud provider where
we can deploy and run our application.

Examples:

- AWS EC2
- DigitalOcean
- Azure VM
- Google Cloud VM
- Hetzner


Why use VPS?

Instead of running the application on our local computer,
we deploy it to a remote server which is accessible
through the internet.


Typical Node.js deployment:

Developer
   |
   | Git push
   ↓
GitHub
   |
   ↓
Linux VPS
   |
   ├── Node.js
   ├── Nginx
   ├── PM2
   └── Application


Common Linux commands:

Check current directory:

pwd


List files:

ls


List detailed files:

ls -la


Change directory:

cd folder-name


Go back:

cd ..


Create folder:

mkdir project


Create file:

touch file.js


Remove file:

rm file.js


Remove folder:

rm -rf folder


Check running processes:

ps aux


Check memory:

free -h


Check disk:

df -h


Check current user:

whoami


Install packages:

sudo apt update
sudo apt install nginx


Give permission:

chmod +x file.sh


Change file owner:

chown user:user file


-----------------------------------------------------------
Interview Question:

"What is a VPS?"

Answer:

A VPS is a virtual server provided by a cloud provider.
We can install software like Node.js, Nginx and PM2 on it
and use it to host our application.


-----------------------------------------------------------
Interview Question:

"Why Linux is commonly used for servers?"

Answer:

Linux is lightweight, stable, secure and works very well
for server applications. It also provides powerful
command-line tools for deployment and server management.





===========================================================
2. DOCKER
===========================================================

Definition:

Docker is a platform used to package an application along
with its dependencies into a container.

Simple example:

My application needs:

Node.js
npm packages
environment configuration

Docker allows us to package these things so the application
can run consistently in different environments.


Without Docker:

Developer machine
    ↓
Works

Production server
    ↓
Some dependency/version problem
    ↓
Application fails


With Docker:

Application
+
Node.js
+
Dependencies
+
Configuration
    ↓
Docker Image
    ↓
Docker Container


-----------------------------------------------------------
Important Docker Terms
-----------------------------------------------------------

IMAGE:

An image is a blueprint/template used to create containers.


CONTAINER:

A running instance of a Docker image.


DOCKERFILE:

A file containing instructions to build a Docker image.


Example Dockerfile:

FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]


-----------------------------------------------------------
Basic Docker Commands
-----------------------------------------------------------

Build image:

docker build -t my-app .


Run container:

docker run -p 5000:5000 my-app


List running containers:

docker ps


List all containers:

docker ps -a


Stop container:

docker stop container_id


Remove container:

docker rm container_id


List images:

docker images


Remove image:

docker rmi image_id


-----------------------------------------------------------
Interview Question:

"What problem does Docker solve?"

Answer:

Docker packages the application and its dependencies
together so that the application behaves consistently
across development, testing and production environments.


-----------------------------------------------------------
Interview Question:

"Image vs Container?"

Answer:

An image is a blueprint, while a container is a running
instance created from that image.


Example:

Image = Class

Container = Object





===========================================================
3. NGINX
===========================================================

Definition:

Nginx is a web server and reverse proxy server.

It can receive requests from users and forward those
requests to our backend application.


Example:

User
 |
 | https://example.com
 ↓
Nginx
 |
 | http://localhost:5000
 ↓
Node.js


Why use Nginx?

1. Reverse proxy
2. SSL/HTTPS
3. Load balancing
4. Serve static files
5. Domain routing
6. Security and request handling


-----------------------------------------------------------
Basic Nginx Configuration
-----------------------------------------------------------

Example:

server {

    listen 80;

    server_name example.com;

    location / {

        proxy_pass http://localhost:5000;

        proxy_set_header Host $host;

        proxy_set_header X-Real-IP $remote_addr;

    }
}


Meaning:

User requests:

https://example.com


Nginx receives request.

Then forwards it to:

http://localhost:5000


Node.js handles the request.


-----------------------------------------------------------
Common Nginx Commands
-----------------------------------------------------------

Check configuration:

sudo nginx -t


Restart:

sudo systemctl restart nginx


Start:

sudo systemctl start nginx


Stop:

sudo systemctl stop nginx


Check status:

sudo systemctl status nginx


-----------------------------------------------------------
Interview Question:

"What is Nginx?"

Answer:

Nginx is a web server and reverse proxy. In a Node.js
deployment, it can receive requests from the client and
forward them to the Node.js application.


-----------------------------------------------------------
Interview Question:

"Why do we use Nginx with Node.js?"

Answer:

Nginx can act as a reverse proxy, handle HTTPS and static
files, and forward requests to the Node.js application.
It also helps with load balancing and production traffic.





===========================================================
4. REVERSE PROXY
===========================================================

Definition:

A reverse proxy is a server that receives client requests
and forwards them to backend servers.

Example:

Client
   |
   ↓
Nginx
   |
   ↓
Node.js


The client doesn't directly access:

localhost:5000


Instead:

example.com
    ↓
Nginx
    ↓
localhost:5000


-----------------------------------------------------------
Forward Proxy vs Reverse Proxy
-----------------------------------------------------------

Forward Proxy:

Client
   ↓
Proxy
   ↓
Internet


Used mainly on behalf of the CLIENT.


Reverse Proxy:

Client
   ↓
Reverse Proxy
   ↓
Backend Server


Used mainly on behalf of the SERVER.


-----------------------------------------------------------
Interview Answer:

"A reverse proxy sits between the client and backend
servers. It receives the request and forwards it to the
appropriate backend service."





===========================================================
5. PM2
===========================================================

Definition:

PM2 is a process manager for Node.js applications.

It helps keep our Node.js application running in
production.


Without PM2:

Node.js
   ↓
Application crashes
   ↓
Application stops


With PM2:

Node.js
   ↓
Application crashes
   ↓
PM2 detects it
   ↓
PM2 restarts application


-----------------------------------------------------------
Install PM2
-----------------------------------------------------------

npm install -g pm2


Start application:

pm2 start server.js


Give application a name:

pm2 start server.js --name my-api


See applications:

pm2 list


See logs:

pm2 logs


Restart:

pm2 restart my-api


Stop:

pm2 stop my-api


Delete:

pm2 delete my-api


Save process list:

pm2 save


Enable startup:

pm2 startup


-----------------------------------------------------------
PM2 Cluster Mode
-----------------------------------------------------------

Suppose server has multiple CPU cores.

Instead of:

Node
 |
 └── One process


We can run:

Node
 ├── Process 1
 ├── Process 2
 ├── Process 3
 └── Process 4


Example:

pm2 start server.js -i max


This starts multiple instances based on available
CPU cores.


-----------------------------------------------------------
Interview Question:

"Why do we use PM2?"

Answer:

PM2 is a Node.js process manager. It keeps the application
running, automatically restarts it if it crashes, manages
logs and can run multiple Node.js instances in cluster mode.





===========================================================
6. GITHUB ACTIONS
===========================================================

Definition:

GitHub Actions is a CI/CD automation platform provided
by GitHub.

We can automatically run tasks when something happens
in our GitHub repository.


For example:

Developer pushes code
        ↓
GitHub
        ↓
GitHub Actions
        ↓
Install dependencies
        ↓
Run tests
        ↓
Build application
        ↓
Deploy


-----------------------------------------------------------
GitHub Actions File
-----------------------------------------------------------

Workflow files are usually inside:

.github/workflows/


Example:

.github/workflows/deploy.yml


Basic example:

name: Deploy Application

on:

  push:
    branches:
      - main


jobs:

  deploy:

    runs-on: ubuntu-latest

    steps:

      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test


-----------------------------------------------------------
Important Terms
-----------------------------------------------------------

WORKFLOW:

Complete automation process.


JOB:

A group of steps that run together.


STEP:

Individual command/action inside a job.


RUNNER:

Machine/environment where the GitHub Actions job runs.


ACTION:

Reusable component provided by GitHub or the community.


-----------------------------------------------------------
Interview Question:

"What is GitHub Actions?"

Answer:

GitHub Actions is a CI/CD automation tool integrated
with GitHub. We can use it to automatically test, build
and deploy applications when code is pushed or a pull
request is created.





===========================================================
7. CI/CD
===========================================================

CI = Continuous Integration

CD = Continuous Delivery / Continuous Deployment


-----------------------------------------------------------
CONTINUOUS INTEGRATION
-----------------------------------------------------------

Developers frequently push code to Git.

Every push can automatically:

- Install dependencies
- Run linting
- Run tests
- Build application


Example:

Developer
   ↓
Git Push
   ↓
CI
   ↓
npm install
   ↓
npm test
   ↓
Build


Purpose:

Find problems early.


-----------------------------------------------------------
CONTINUOUS DELIVERY
-----------------------------------------------------------

Code is automatically built and prepared for deployment,
but production deployment may require manual approval.


Flow:

Git Push
   ↓
Test
   ↓
Build
   ↓
Ready for deployment
   ↓
Manual approval
   ↓
Production


-----------------------------------------------------------
CONTINUOUS DEPLOYMENT
-----------------------------------------------------------

Code that passes the pipeline is automatically deployed
to production.


Flow:

Git Push
   ↓
Test
   ↓
Build
   ↓
Deploy
   ↓
Production


-----------------------------------------------------------
Interview Question:

"Difference between CI and CD?"

Answer:

CI focuses on automatically integrating and testing code.

CD focuses on automatically delivering or deploying the
validated code to the required environment.





===========================================================
8. COMPLETE NODE.JS DEPLOYMENT FLOW
===========================================================

This is VERY IMPORTANT for interviews.


Developer
    |
    | git push
    ↓
GitHub
    |
    ↓
GitHub Actions
    |
    ├── Install dependencies
    ├── Run tests
    ├── Build
    └── Deploy
            |
            ↓
       Linux VPS
            |
            ├── Nginx
            |
            ├── PM2
            |
            └── Node.js
                    |
                    ↓
                Database


When user opens:

https://example.com


Request flow:

User
 ↓
Nginx
 ↓
Node.js / Express
 ↓
Controller
 ↓
Service
 ↓
Database
 ↓
Response
 ↓
Nginx
 ↓
User


===========================================================
9. DOCKER + NGINX + PM2
===========================================================

There are different ways to deploy.


OPTION 1:

VPS
 |
 ├── Nginx
 |
 ├── PM2
 |     |
 |     └── Node.js
 |
 └── Database


Here PM2 manages Node.js directly.


OPTION 2:

VPS
 |
 ├── Nginx
 |
 └── Docker
       |
       └── Node.js Container


Here Docker manages the application container.

In many modern deployments, Docker is used instead of
PM2 for process/container management.

You don't necessarily need BOTH PM2 and Docker.


===========================================================
10. ENVIRONMENT VARIABLES
===========================================================

Never hardcode sensitive values.

Bad:

const password = "mypassword";


Good:

const password = process.env.DB_PASSWORD;


Example .env:

PORT=5000

DB_HOST=localhost

DB_USER=root

DB_PASSWORD=secret

RAZORPAY_KEY_ID=xxxxx

RAZORPAY_KEY_SECRET=xxxxx


In production, environment variables can be configured
on the server or through CI/CD secrets.


IMPORTANT:

Never commit .env to GitHub.


Add:

.env

to:

.gitignore


===========================================================
11. PORT
===========================================================

A port identifies where an application is listening
for network connections.


Example:

Node.js:

app.listen(5000);


Application runs on:

localhost:5000


Nginx may listen on:

80  → HTTP
443 → HTTPS


Example:

Internet
   |
   ↓
Port 443
   |
   ↓
Nginx
   |
   ↓
Port 5000
   |
   ↓
Node.js


===========================================================
12. HTTP vs HTTPS
===========================================================

HTTP:

Data is transferred without TLS encryption.


HTTPS:

HTTP + TLS encryption.


HTTPS protects data while it is transferred between
client and server.


Nginx is commonly configured to handle HTTPS.


===========================================================
13. DOMAIN + DNS
===========================================================

Domain:

example.com


DNS connects the domain to the server IP.


Example:

example.com
     |
     ↓
DNS
     |
     ↓
123.45.67.89
     |
     ↓
VPS


Then Nginx receives the request.


===========================================================
14. BASIC GIT COMMANDS
===========================================================

Check status:

git status


Create branch:

git checkout -b feature/payment


Add files:

git add .


Commit:

git commit -m "Add payment integration"


Push:

git push origin feature/payment


Pull:

git pull origin main


Switch branch:

git checkout main


Merge:

git merge feature/payment


Clone:

git clone <repository-url>


===========================================================
15. COMMON INTERVIEW QUESTIONS
===========================================================


Q1. What is Docker?

Docker is a platform used to package applications and
their dependencies into containers so they can run
consistently across environments.


Q2. What is a Docker image?

An image is a blueprint used to create Docker containers.


Q3. What is a Docker container?

A container is a running instance of a Docker image.


Q4. What is Nginx?

Nginx is a web server and reverse proxy commonly used
to forward client requests to backend applications.


Q5. What is a reverse proxy?

It receives requests from clients and forwards them to
backend servers.


Q6. What is PM2?

PM2 is a Node.js process manager that keeps applications
running and can automatically restart crashed processes.


Q7. What is CI?

Continuous Integration means automatically building and
testing code when developers integrate changes.


Q8. What is CD?

Continuous Delivery/Deployment automates delivering or
deploying validated code to an environment.


Q9. What is GitHub Actions?

It is a GitHub automation platform used to create CI/CD
workflows.


Q10. What happens when you push code to GitHub?

Possible production flow:

git push
   ↓
GitHub
   ↓
GitHub Actions
   ↓
Install
   ↓
Test
   ↓
Build
   ↓
Deploy
   ↓
VPS
   ↓
Restart application
   ↓
Production


Q11. Why don't we expose Node.js port directly?

We can use Nginx as the public-facing server and keep
Node.js behind it. This provides better control over
routing, HTTPS, security and static content.


Q12. Why use PM2?

To keep Node.js applications alive, restart them after
crashes and manage multiple processes.


Q13. Why use Docker?

To make application environments consistent and simplify
deployment.


Q14. Docker vs PM2?

Docker manages containers.

PM2 manages Node.js processes.

They solve different problems, although Docker-based
deployments often don't need PM2.


Q15. What is a VPS?

A virtual server that we can configure and use to host
applications over the internet.


===========================================================
16. ONE-MINUTE INTERVIEW ANSWER
===========================================================

"If I deploy a Node.js application, I can host it on a
Linux VPS. Nginx can work as a reverse proxy and receive
the public HTTP or HTTPS requests and forward them to my
Node.js application.

I can use PM2 to manage the Node.js process, restart it
if it crashes and manage application logs.

For containerized deployments, I can package the Node.js
application and its dependencies using Docker.

For CI/CD, I can use GitHub Actions. Whenever I push code
to the main branch, the workflow can install dependencies,
run tests, build the application and deploy it to the VPS.

So the basic flow is:

GitHub
   ↓
GitHub Actions
   ↓
VPS
   ↓
Nginx
   ↓
Node.js
   ↓
Database"


===========================================================
17. MOST IMPORTANT THINGS TO REMEMBER
===========================================================

Docker
→ Packages application into containers.


Docker Image
→ Blueprint for a container.


Docker Container
→ Running instance of an image.


Nginx
→ Web server + reverse proxy.


Reverse Proxy
→ Receives request and forwards it to backend.


PM2
→ Node.js process manager.


VPS
→ Remote virtual server.


GitHub Actions
→ GitHub automation / CI/CD.


CI
→ Build + Test automatically.


CD
→ Deliver / Deploy automatically.


Final flow:

Developer
   ↓
Git Push
   ↓
GitHub
   ↓
GitHub Actions
   ↓
Test + Build
   ↓
Deploy
   ↓
Linux VPS
   ↓
Nginx
   ↓
Node.js
   ↓
Database