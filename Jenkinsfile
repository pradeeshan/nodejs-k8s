pipeline {
    agent any

    environment {
        IMAGE_NAME = 'nodejs-app'
        IMAGE_TAG = "${BUILD_NUMBER}"          // Use Jenkins build number as image tag
        REGISTRY = 'pradeeshan'
        FULL_IMAGE = "${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
    }

    stages {
        stage('Cleanup Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                git 'https://github.com/pradeeshan/nodejs-k8s.git'
            }
        }

        stage('Build & Push Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        FULL_IMAGE="$DOCKER_USER/$IMAGE_NAME:$IMAGE_TAG"

                        docker build -t $FULL_IMAGE .

                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                        docker push $FULL_IMAGE
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl set image deployment/nodejs-deployment nodejs-container=$FULL_IMAGE
                kubectl rollout status deployment/nodejs-deployment
                '''
            }
        }
    }

    post {
        success {
            withCredentials([string(credentialsId: 'discord-webhook', variable: 'DISCORD_WEBHOOK')]) {
                sh '''
                curl -H "Content-Type: application/json" \
                     -X POST \
                     -d '{"content": "Jenkins Build #$BUILD_NUMBER succeeded for Node.js app."}' \
                     $DISCORD_WEBHOOK
                '''
            }
        }

        failure {
            withCredentials([string(credentialsId: 'discord-webhook', variable: 'DISCORD_WEBHOOK')]) {
                sh '''
                curl -H "Content-Type: application/json" \
                     -X POST \
                     -d '{"content": "Jenkins Build #$BUILD_NUMBER FAILED for Node.js app."}' \
                     $DISCORD_WEBHOOK
                '''
            }
        }

        always {
            cleanWs()
        }
    }
}
