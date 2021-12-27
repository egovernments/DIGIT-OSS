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
                tenantId: config.rootTenantId
            },
             user: {
                mobileNumber: requestBody.user.mobileNumber
            }

        }
        console.log("reformattedMessage:: ", reformattedMessage);
        return reformattedMessage;
    }

    sendMessageToUser(user, outputMessages, extraInfo,connection) {
        if(!Array.isArray(outputMessages)) {
            let message = outputMessages;
            outputMessages = [ message ];
            console.warn('Output array had to be constructed. Remove the use of deeprecated function from the code. \ndialog.sendMessage() function should be used to send any message instead of any previously used methods.');
        }

        // console.log(user);
        for(let message of outputMessages) {
           // console.log("type of message: ", typeof message);
            console.log(message);
            connection.sendUTF(JSON.stringify(message));

        }
    }
}

module.exports = new WebMessageProcessor();