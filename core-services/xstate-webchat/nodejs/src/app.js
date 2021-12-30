// Node.js WebSocket server script
// const express = require('express');
const http = require('http');
const WebSocketServer = require('websocket').server;
const sessionManager = require('./session/session-manager');
const webchatMessageProcessor = require('./channel/webchat-message-processor');

const server = http.createServer();
server.listen(8080);
const wsServer = new WebSocketServer({
  httpServer: server,
});

wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);

  connection.on('message', (message) => {
    console.log('Received Message:', message.utf8Data);
    const userMessage = JSON.parse(message.utf8Data);
    let reformattedMessage;
    try {
      reformattedMessage = webchatMessageProcessor.processMessageFromUser(userMessage);
      if (reformattedMessage != null) {
        reformattedMessage.user.connection = connection;
        sessionManager.fromUser(reformattedMessage, connection);
      }
    } catch (e) {
      console.log(e);
    }
  });

  connection.on('close', (reasonCode, description) => {
    console.log('Client has disconnected.');
  });
});
