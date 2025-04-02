pipeline {
    tools {
        nodejs "node20" // Ensure this tool is configured correctly in Jenkins
    }

    agent any

    environment {
        SSH_USER = 'jsqa' // Change to your EC2 username
        SSH_HOST = '40.172.43.160'
        SSH_KEY_CREDENTIALS = 'jenkins-ssh' // SSH credentials ID
        DEST_DIR = '/home/jsqa/temp/dist'  // Destination directory on the EC2 server
        //SOURCE_DIR = 'dist'  // Adjust the source directory if needed (assuming npm run build puts files here)
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install' // Install npm dependencies
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build' // Run npm build to generate the production-ready files
            }
        }

        stage('Sync Files to served destination') {
            steps {
                sshagent(['jenkins-ssh']) {
                    // Use SCP to copy the build files to the destination directory on the EC2 instance
                    sh """
                    scp -r -o StrictHostKeyChecking=no dist/* ${SSH_USER}@${SSH_HOST}:${DEST_DIR}/
                    """
                }
            }
        }
    }
}