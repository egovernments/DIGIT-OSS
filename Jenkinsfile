import java.text.SimpleDateFormat
import java.util.TimeZone

node('deploy') {
    stage('Slack Notification - Build Started') {
        def startTime = System.currentTimeMillis()
        def utcFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
        def istFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
        istFormatter.timeZone = TimeZone.getTimeZone("Asia/Kolkata")
    
        def message = "Pipeline execution started.\n"
        message += "Start time (IST): ${istFormatter.format(new Date(startTime))}\n"
        message += "Pipeline: ${env.JOB_NAME}\n"

        slackSend(channel: '#cicd', message: message)
    }
    stage('Cleanup Workspace') {
        deleteDir()
    }
    stage('Git Checkout') {
        checkout([$class: 'GitSCM',
                  branches: [[name: '*/master']],
                  userRemoteConfigs: [[url: 'https://github.com/SudeepAccess/DIGIT-OSS.git']]])
    }
    stage('Copy frontend files') {
        sh 'cp -rf /opt/DIGIT-DEPLOY/deploy/workspace/TCP/frontend/micro-ui/web/ /opt/DIGIT-DEPLOY/DIGIT-OSS_Build'
    }

    stage('Copy node_modules') {
        dir('/opt/DIGIT-DEPLOY/deploy/workspace/TCP/frontend/micro-ui/web/micro-ui-internals/example') {
            sh 'cp -r /opt/DIGIT-DEPLOY/DIGIT-OSS/frontend_bkp/micro-ui/web/micro-ui-internals/example/node_modules .'
        }
    }

    stage('Install dependencies and build frontend') {
        dir('/opt/DIGIT-DEPLOY/DIGIT-OSS_Build/web/micro-ui-internals') {
             sh 'yarn build-s'
        }
    }

    stage('Build Digit UI module') {
        dir('/opt/DIGIT-DEPLOY/DIGIT-OSS_Build/web/micro-ui-internals/example') {
            sh '''
                yarn add @egovernments/digit-ui-module-engagement @egovernments/digit-ui-module-ws @egovernments/digit-ui-module-pt
                CI=false SKIP_PREFLIGHT_CHECK=true yarn build
                cd build
                mkdir -p digit-ui
                cp -R static digit-ui/
            '''
        }
    }

    stage('Copy build files and update main.js') {
        dir('/opt/DIGIT-DEPLOY/DIGIT-OSS/frontend/micro-ui/web/micro-ui-internals/example') {
            sh '''
                cp -R /opt/DIGIT-DEPLOY/DIGIT-OSS_Build/web/micro-ui-internals/example/build .
                cp -f /opt/DIGIT-DEPLOY/DIGIT-OSS/main_dev.js /opt/DIGIT-DEPLOY/DIGIT-OSS/frontend/micro-ui/web/micro-ui-internals/example/main.js
            '''
        }
    }

    stage('Stop and start main.js') {
        dir('/opt/DIGIT-DEPLOY/DIGIT-OSS/frontend/micro-ui/web/micro-ui-internals/example') {
            sh 'pm2 stop main.js || true'
            sh 'pm2 start main.js || true'
        }
    }

    stage('Slack Notification') {
        def startTime = currentBuild.startTimeInMillis
        def endTime = System.currentTimeMillis()
        def duration = endTime - startTime
    
        def timeZoneIST = TimeZone.getTimeZone('Asia/Kolkata')
        def dateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
        dateFormatter.timeZone = timeZoneIST
    
        def message = "Pipeline execution started.\n"
        message += "Start time (IST): ${dateFormatter.format(new Date(startTime))}\n"
        message += "End time (IST): ${dateFormatter.format(new Date(endTime))}\n"
        message += "Duration: ${(duration / 60000)} minutes\n"
        message += "Pipeline: ${env.JOB_NAME}\n"
        message += "Build result: ${buildResult}\n"
    
        slackSend(channel: '#cicd', message: message)
    }
}
