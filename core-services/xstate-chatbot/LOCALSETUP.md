# XState-Chatbot-React-App

This ```react-app``` is provided only to ease the process of dialog development. It should be used only on a developer's local machine when developing any new chat flow. ```nodejs``` should be run as a backend service and tested once on the local machine using postman before deploying the build to the server.


`
npm install
`

## Modifying the Dialog

The Xstate Machine that contains the dialog is present in ```nodejs/src/machine/```. To modify the dialog, please make changes to that file.

Any external api calls are written as part of files present in ```nodejs/src/machine/service``` which would get called from the state machine.

## Command to setup
This react-app uses files present in the nodejs project. So before running this app, we need to install dependencies in the nodejs project as well.

Run following command in ```nodejs/``` directory as well as ```react-app/``` directory

`
npm install
`

## Command to run the App
To start testing the chatbot in a web browser, run following command in ```react-app/``` directory.

`
npm start
`

Open the website: `http://localhost:3000`

Open the web browser console to see any logs.

## Environment Variables

As the react-app will be running in a web browser and not a server, a few of the functionalities will have to be disabled before we can run the app on the web browser. This can be achieved simply by modifying few environment variables.
 
Please modify the following environment variables in [env-variables.js](../nodejs/src/env-variables.js) file before running the app:
 
1. Disable kafka consumer by marking kafkaConsumerEnabled to be false
2. In case of hostnames of services, the react-app picks it from the proxy configured in [package.json](./package.json). So configure a common hostname there and replace egovServicesHost - 'https://dev.digit.org/' (and any other hostname that is being used to make an api call) in the env-variables.js with just '/'.

