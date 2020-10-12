pipeline {
    agent any

    tools {
        nodejs 'node'
    }

    environment {
        NODE_ENV = 'test'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                print "Environment will be : ${env.NODE_ENV}"

                sh 'node -v'
                sh 'npm prune'
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('Cleanup') {
            steps {
                sh 'npm prune'
                sh 'rm node_modules -rf'
            }
        }
    }
}
