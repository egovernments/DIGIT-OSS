# XState-Webchat

XState-Webchat is a chatbot developed on the technology [XState](https://xstate.js.org/docs/). XState is a JavaScript implementation of the concept of [State-Charts](https://statecharts.github.io).

Please refer to [LOCALSETUP.md](./LOCALSETUP.md) to guide you through local setup.

Web Chatbot is developed as a backend service that will receive messages [JSON] incoming from the user, and send messages [JSON] to the user using Websocket as communication channel. The Xstate-Webchat is targetted for capturing complaint and feedback from Citizens from web appplication. 
 
In this project, the `nodejs` directory contains the primary project. It contains all the files of the project that will get deployed on the server. `nodejs` should be run as a backend service and tested once on the local machine using postman before deploying the build to the server. `nodejs/src/app.js` is the entry point of the application which starts a websocket server running on port `8080` that accepts incoming message from the client. The user request is then forwarded to the Xstate machine developed 

## Modifying the Chat flow

The workflow for the chatbot uses the concept of finite state machines which is developed using Xstate library Machine. The workflow implementation is present in ```nodejs/src/machine/```. To modify the workflow, please make changes to those file. 

Modifying messages without any change to workflow flow could be handled by just modifying the files in [messages](./nodejs/src/machine/messages) directory.

Any external api calls are written as part of files present in ```nodejs/src/machine/service``` which would get called from the state machine.

## Environment Variables
Environment Variables can configured as present in the [env-variables.js](./nodejs/src/env-variables.js).

Some of the environment variables and their usage is listed below:

1. REPO_PROVIDER: It can be used to configure the datastore for state management between consecutive messages from a user. ```InMemory``` datastore can be used to kick-off chatbot development. ```PostgreSQL``` should be used in production environment.
2. SERVICE_PROVIDER: To ease the development without relying on any backend services, this value could be set to ```Dummy```. In production environment it should NOT be set to Dummy. The services are defined in [service](./nodejs/src/machine/service) directory. Which service gets loaded at runtime is defined in [service-loader.js](./nodejs/src/machine/service/service-loader.js)
3. postgresConfig: Provide the PostgreSQL DB connection details here

## API Spec & steps for testing the application through postman
Webchat application uses TCP protocol based Websockets as communication channel between client and server.A WebSocket is a persistent connection between a client and server. WebSockets provide a bidirectional, full-duplex communications channel that operates over HTTP through a single TCP/IP socket connection. As chabot requires a real-time event driven message exchange between client and server so Websocket is preffered for this use-case over HTTP REST based communication. 

Most of the current API testing tools like Postman, Swagger etc. have very good support for HTTP APIs but they offer limited fatures for Websocket APIs. Postman currently supports Websocket API request for testing and debugging of the appplication but does not allow to create and share Wbsocket API as Postman collection. API request to be used for webchat interaction is present in  `./nodejs/webchatbot-request.json`. Please refer `https://learning.postman.com/docs/sending-requests/supported-api-frameworks/websocket/` for steps to test websocket API through postman.

## Remote Debugging

To support remote debugging, we recommend using [VSCode](https://code.visualstudio.com). The VSCode [launch](./.vscode/launch.json) script file is written which will be used to start the remote debugging session. 

Steps to start a remote debugging session:

1. Port forward to the the remote server (9229:9229)
2. In VSCode Run options, select "Attach to remote" 
3. Start Debugging