// Node.js WebSocket server script
const express = require('express'),
  router = express.Router(),
  webSessionManager = require('./session/webSession-manager'),
  channelProvider = require('./channel/web');


const http = require('http');
const WebSocketServer = require('websocket').server;
const server = http.createServer();
server.listen(9898);
const wsServer = new WebSocketServer({
  httpServer: server
});

wsServer.on('request', function (request) {
  const connection = request.accept(null, request.origin);

  connection.on('message', function (message) {
   // console.log('Received Message:', message.utf8Data);
    let userMessage = JSON.parse(message.utf8Data);
    let reformattedMessage;
    try {
      reformattedMessage = channelProvider.processMessageFromUser(userMessage);
      if (reformattedMessage != null) 
        webSessionManager.fromUser(reformattedMessage, connection);
    } catch (e) {
      console.log(e);
    }

   // connection.sendUTF('Hi this is WebSocket server!');
  });

  connection.on('close', function (reasonCode, description) {
    console.log('Client has disconnected.');
  });
  
});