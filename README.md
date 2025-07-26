Project structure : 
Nodejs-app /
- app.jss
-package.json
-Dockerfile
-Jenkinsfile
K8s /
-deployment.yaml
-service.yaml
-ingress.yaml

#Create cluster
kind create cluster --name nodejs-cluster --config kind-config.yaml

#Navigate to project folder
cd nodejs-app

#Build Docker image
docker build -t nodejs-app:latest.

#Tag Docker image
docker tag nodejs-app:latest pradeeshan/nodejs-app:latest

#Push Docker image
docker push pradeeshan/nodejs-app:latest

#Apply Deployment
kubectl apply -f k8s/deployment.yaml

#Apply Service
kubectl apply -f k8s/service.yaml

#Apply ingress
kubectl apply -f k8s/ingress.yaml

#Check pods
kubectl get pods

#Check services
kubectl get svc

#Use NodePort port to access
http://localhost:30080

Access using Nginx Ingress : 
#Install Nginx Ingress Controller 
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/kind/deploy.yaml

#Check pod running status 
kubectl get pods -n ingress-nginx

#To label the node 
kubectl label node nodejs-cluster-control-plane ingress-ready=true

#Apply Ingress
kubectl apply -f ingress.yaml

#Map the hostname( node.local to localhost )
sudo nano /etc/hosts
127.0.0.1  node.local

kubectl port-forward --namespace ingress-nginx service/ingress-nginx-controller 9999:80
http://node.local:9999/


Deploy using Jenkins : 
#Add Jenkins User to Docker Group
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
groups jenkins

#Store Docker Credentials in Jenkins
Go to Jenkins UI ➔ Manage Jenkins ➔ Credentials.
Choose your domain (or global).
Add a new Username with Password credential

#Create Kubeconfig for Jenkins User
sudo mkdir -p /var/lib/jenkins/.kube
sudo cp /home/your-username/.kube/config /var/lib/jenkins/.kube/config
sudo chown -R jenkins:jenkins /var/lib/jenkins/.kube
sudo chmod 600 /var/lib/jenkins/.kube/config


#Set Environment Variable in Jenkins
Go to Manage Jenkins → Configure System.
Under Global Properties, check Environment variables.
Add:
Name: KUBECONFIG
Value: /var/lib/jenkins/.kube/config 

#Add discord webhook to jenkins as secret text 
