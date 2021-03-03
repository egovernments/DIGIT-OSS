const express = require('express'),
    router = express.Router(),
    config = require('../../env-variables'),
    sessionManager = require('../../session/session-manager'),
    channelProvider = require('../');

router.post('/message', async (req, res) =>  {
    try {
        let reformattedMessage = await channelProvider.processMessageFromUser(req);
        sessionManager.fromUser(reformattedMessage);
    } catch(e) {
        console.log(e);
    }
    res.end();
});

router.get('/health', (req, res) => res.sendStatus(200));

module.exports = router;
