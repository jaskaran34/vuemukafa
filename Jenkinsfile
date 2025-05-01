pipeline {
    tools {
        nodejs "node20"
    }

    agent any

    environment {
        BASTION_USER = 'ubuntu'
        PRIVATE_USER = 'jsqa'
        DEST_DIR = '/home/jsqa/temp'
        PRIVATE_IP = '10.0.2.38'
        BASTION_IP = '51.112.38.2' // Replace with real bastion public IP
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build:uat'
            }
        }

        stage('Deploy to Private EC2') {
            steps {
                sshagent(['jenkins-ssh']) {
                    sh '''
                    scp -o UserKnownHostsFile=/dev/null \
                        -o StrictHostKeyChecking=no \
                        -o ProxyCommand="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -W %h:%p ${BASTION_USER}@${BASTION_IP}" \
                        -r dist/* ${PRIVATE_USER}@${PRIVATE_IP}:${DEST_DIR}/
                    '''
                }
            }
        }
    }
}