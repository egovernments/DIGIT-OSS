const config = require('../env-variables');

class ConsoleProvider {
    processMessageFromUser(req) {
        let requestBody = req.body;
        let reformattedMessage = {
            message: {
                type: requestBody.message.type,
                input: requestBody.message.input
            },
            user: {
                mobileNumber: requestBody.user.mobileNumber
            },
            extraInfo: {
                whatsAppBusinessNumber: requestBody.extraInfo.whatsAppBusinessNumber,
                tenantId: config.rootTenantId
            }
        }
        return reformattedMessage;
    }

    sendMessageToUser(user, outputMessages, extraInfo) {
        if(!Array.isArray(outputMessages)) {
            let message = outputMessages;
            outputMessages = [ message ];
        }

    }
}

module.exports = new ConsoleProvider();