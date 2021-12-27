const express = require('express');

const router = express.Router();
const config = require('../../env-variables');
const sessionManager = require('../../session/session-manager');
const channelProvider = require('..');
remindersService = require('../../machine/notifications/reminders-service');

router.post('/message', async (req, res) => {
  processHttpRequest(req, res);
});

router.get('/message', async (req, res) => {
  processHttpRequest(req, res);
});

router.post('/reminder', async (req, res) => {
  await remindersService.triggerReminders();
  res.end();
});

async function processHttpRequest(req, res) {
  try {
    const reformattedMessage = await channelProvider.processMessageFromUser(req);
    if (reformattedMessage) sessionManager.fromUser(reformattedMessage);
  } catch (e) {
    console.log(e);
  }
  res.end();
}

router.get('/health', (req, res) => res.sendStatus(200));

module.exports = router;
