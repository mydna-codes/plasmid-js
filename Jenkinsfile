pipeline {

    agent any

    environment {
        registry = "https://docker.mjamsek.com"
        registryCredential = "nexus-username"
        dockerImageTag = "docker.mjamsek.com/api-gateway"
        dockerClientImageTag = "docker.mjamsek.com/api-gateway-admin-ui"
        dockerImage = ""
        dockerClientImage = ""
        version = ""
        commitAuthor = ""

        // Global variables
        KUBERNETES_CREDENTIALS = "k8s-kubeconfig"
        DOCKER_CREDENTIALS     = "mydnacodes-docker-user"
        // Local variables
        DOCKER_IMAGE_TAG       = "mydnacodes/plasmid-js"
        PROJECT_VERSION        = "1.0.0-SNAPSHOT"
        PROJECT_ARTIFACT_ID    = "plasmid-js"
        COMMIT_AUTHOR          = ""
        COMMIT_MESSAGE         = ""
    }

    tools {
        nodejs "node-15.5"
    }

    stages {
        stage("Set environment variables") {
            steps {
                script {
                    COMMIT_MESSAGE       = sh script: "git show -s --pretty='%s'", returnStdout: true
                    COMMIT_AUTHOR        = sh script: "git show -s --pretty='%cn <%ce>'", returnStdout: true
                    COMMIT_AUTHOR        = COMMIT_AUTHOR.trim()
                }
            }
        }
        stage("Packaging client application") {
            steps {
                dir("web") {
                    withNPM(npmrcConfig: 'npm-public-file') {
                        sh "npm install"
                    }
                }
            }
        }
        stage("Build docker image") {
            steps {
                script {
                    dockerImage = docker.build DOCKER_IMAGE_TAG
                }
            }
        }
        stage("Publish docker image") {
            steps {
                script {
                    docker.withRegistry("", DOCKER_CREDENTIALS) {
                        dockerImage.push("$PROJECT_VERSION")
                        dockerImage.push("latest")
                    }
                }
            }
        }
        stage("Clean docker images") {
            steps {
                sh "docker rmi $DOCKER_IMAGE_TAG:$PROJECT_VERSION"
                sh "docker rmi $DOCKER_IMAGE_TAG:latest"
            }
        }
    }
    post {
        success {
            slackSend (color: '#57BA57',
                       message: """[<${env.BUILD_URL}|Build ${env.BUILD_NUMBER}>] *SUCCESSFUL*\n
                                  |Version: `${PROJECT_ARTIFACT_ID}:${PROJECT_VERSION}`\n
                                  |Branch:  *${GIT_BRANCH}*
                                  |Author:  ${COMMIT_AUTHOR}
                                  |Message: ${COMMIT_MESSAGE}""".stripMargin()
            )
        }
        failure {
            slackSend (color: '#BD0808',
                       message: """[<${env.BUILD_URL}|Build ${env.BUILD_NUMBER}>] *FAILED*\n
                                  |Version: `${PROJECT_ARTIFACT_ID}:${PROJECT_VERSION}`\n
                                  |Branch:  *${GIT_BRANCH}*
                                  |Author:  ${COMMIT_AUTHOR}
                                  |Message: ${COMMIT_MESSAGE}""".stripMargin()
            )
        }
    }
}