pipeline {

    agent any

    environment {
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
                nodejs('node-15.5') {
                    sh 'npm install'
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
        stage("Prepare deployments") {
            steps {
                script {
                    def deploymentConfig = readYaml file: ".ci/deployment-config.yaml"
                    def environment      = ""

                    if (env.GIT_BRANCH.equals("prod") || env.GIT_BRANCH.equals("origin/prod")) {
                        environment = deploymentConfig.environments.prod
                    } else {
                        environment = deploymentConfig.environments.dev
                    }

                    sh """ \
                    sed -i \
                        -e 's+{{IMAGE_NAME}}+$DOCKER_IMAGE_TAG:$PROJECT_VERSION+g' \
                        -e 's+{{NAMESPACE}}+$environment.namespace+g' \
                        -e 's+{{ENV_SUFFIX}}+$environment.suffix+g' \
                        .kube/plasmid-js-deployment.yaml
                    """
                }
            }
        }
        stage("Deploy application") {
            steps {
                script {
                    def deploymentConfig = readYaml file: ".ci/deployment-config.yaml"
                    def namespace        = ""

                    if (env.GIT_BRANCH.equals("prod") || env.GIT_BRANCH.equals("origin/prod")) {
                        namespace = deploymentConfig.environments.prod.namespace
                    } else {
                        namespace = deploymentConfig.environments.dev.namespace
                    }

                    try {
                        withKubeConfig([credentialsId: KUBERNETES_CREDENTIALS]) {
                            sh "kubectl scale --replicas=0 deployment plasmid-js-app -n $namespace"
                            sh "kubectl scale --replicas=1 deployment plasmid-js-app -n $namespace"
                        }
                    } catch (Exception e) {
                        echo "Deployment has not been scaled."
                        echo e.getMessage()
                    }
                }
                withKubeConfig([credentialsId: KUBERNETES_CREDENTIALS]) {
                    sh "kubectl apply -f .kube/plasmid-js-deployment.yaml"
                }
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