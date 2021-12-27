// Node.js WebSocket server script
const express = require('express'),
    sessionManager = require('./session/session-manager'),
    webchatMessageProcessor = require('./channel/webchat-message-processor');
    
const http = require('http');
const WebSocketServer = require('websocket').server;
const server = http.createServer();
server.listen(8080);
const wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function (request) {
    const connection = request.accept(null, request.origin);
    
    connection.on('message', function (message) {
        console.log('Received Message:', message.utf8Data);
        let userMessage=JSON.parse(message.utf8Data);
        let reformattedMessage;
        try {
            reformattedMessage =  webchatMessageProcessor.processMessageFromUser(userMessage);
            if (reformattedMessage != null){
                reformattedMessage.user.connection=connection;
                sessionManager.fromUser(reformattedMessage,connection);
            }
                
        } catch (e) {
            console.log(e);
        }

        
    });

    connection.on('close', function (reasonCode, description) {
        console.log('Client has disconnected.');
    });
});

