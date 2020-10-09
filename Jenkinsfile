pipeline {
    agent any

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

        stage('Build Docker') {
            steps {
                echo 'TODO'
            }
        }

        stage('Deploy') {
            steps {
                echo 'TODO'
            }
        }

        stage('Cleanup') {
            steps {
                echo 'Cleanup'
                sh 'npm prune'
                sh 'rm node_modules -rf'
            }
        }
    }
}
