const config = require('../env-variables');

class WebMessageProcessor {
   
    processMessageFromUser(userMessage) {
        let requestBody = userMessage;
        
        let reformattedMessage = {
            message: {
                type: requestBody.message.type,
                input: requestBody.message.input
            },
            user: {
                mobileNumber: requestBody.user.mobileNumber
                
            },
            extraInfo: {
                tenantId: config.rootTenantId,
                filestoreId: requestBody.extraInfo.filestoreId,
                applicationId: requestBody.extraInfo.applicationId,
                comments:requestBody.extraInfo.comments
            },
             user: {
                mobileNumber: requestBody.user.mobileNumber
            }

        }
        return reformattedMessage;
    }

    sendMessageToUser(user, outputMessages, extraInfo,connection) {
        if(!Array.isArray(outputMessages)) {
            let message = outputMessages;
            outputMessages = [ message ];
            console.warn('Output array had to be constructed. Remove the use of deeprecated function from the code. \ndialog.sendMessage() function should be used to send any message instead of any previously used methods.');
        }
        for(let message of outputMessages) {
          connection.sendUTF(JSON.stringify(message));

        }
    }
}

module.exports = new WebMessageProcessor();