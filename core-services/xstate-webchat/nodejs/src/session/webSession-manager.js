const ptMachine = require('../machine/pt'),
    channelProvider = require('../channel'),
    chatStateRepository = require('./repo'),
    telemetry = require('./telemetry'),
    system = require('./system'),
    userService = require('./user-service');
const { State, interpret } = require('xstate');
const dialog = require('../machine/util/dialog.js');

class WebSessionManager {

    async fromUser(reformattedMessage, connection) {
        let mobileNumber = reformattedMessage.user.mobileNumber;
        let user = await userService.getUserForMobileNumber(mobileNumber, reformattedMessage.extraInfo.tenantId);
        reformattedMessage.user = user;
        let userId = user.userId;
        let chatState = await chatStateRepository.getActiveStateForUserId(userId);
        telemetry.log(userId, 'from_user', reformattedMessage);

        if (!chatState) {
            // come here if virgin dialog, old dialog was inactive, or reset case
            chatState = this.createChatStateFor(user, connection);
            let saveState = JSON.parse(JSON.stringify(chatState, function (key, value) {
                if (key == 'connection') {
                    return;
                } else {
                    return value;
                };
            }));
            saveState = this.removeUserDataFromState(saveState);
            await chatStateRepository.insertNewState(userId, true, JSON.stringify(saveState));
        }
        let service = this.getChatServiceFor(chatState, reformattedMessage,connection);
        let intention = await dialog.get_intention(grammer.reset, reformattedMessage, true);
        let event = (intention == 'reset') ? 'USER_RESET' : 'USER_MESSAGE';
        service.send(event, reformattedMessage);
    }

   
    async toUser(user, outputMessages, extraInfo,connection){
        console.log("channelProvider",channelProvider);
        channelProvider.sendMessageToUser(user, outputMessages, extraInfo,connection);
        for (let message of outputMessages) {
            telemetry.log(user.userId, 'to_user', { message: { type: "text", output: message } });
        }
    }

    removeUserDataFromState(state) {
        let userId = state.context.user.userId;
        let locale = state.context.user.locale;
        state.context.user = undefined;
        state.context.user = { locale: locale, userId: userId };
        state.event = {};
        state._event = {};
        if (state.history)
            state.history.context.user = {};
        return state;
    }

    getChatServiceFor(chatStateJson, reformattedMessage,connection) {
        const context = chatStateJson.context;
        context.chatInterface = this;
        let locale = context.user.locale;
        context.user = reformattedMessage.user;
        context.user.locale = locale;
        context.extraInfo = reformattedMessage.extraInfo;
        context.connection = connection;

        const state = State.create(chatStateJson);
        const resolvedState = ptMachine.withContext(context).resolveState(state);
        const service = interpret(ptMachine).start(resolvedState);

        service.onTransition(state => {
            if (state.changed) {
                let userId = state.context.user.userId;
                let stateStrings = state.toStrings()
                telemetry.log(userId, 'transition', { destination: stateStrings[stateStrings.length - 1] });

                let active = !state.done && !state.forcedClose;
                let saveState = JSON.parse(JSON.stringify(state,function( key, value) {
                    if(key == 'connection') { 
                      return ;
                    } else {
                      return value;
                    };
                  }));      // deep copy
                saveState = this.removeUserDataFromState(saveState);
                chatStateRepository.updateState(userId, active, JSON.stringify(saveState));
            }
        });

        return service;
    }

    createChatStateFor(user,connection) {
        let service = interpret(ptMachine.withContext({
            chatInterface: this,
            user: user,
            slots: {pgr: {}, bills: {}, receipts: {}},
            connection:connection
        }));
        service.start();
        return service.state;
    }

    

    system_error(message) {
        system.error(message);
    }
}

let grammer = { 
    reset: [
        { intention: 'reset', recognize: ['Hi', 'hi', 'mseva', 'seva', 'सेवा'] },
    ]
}

module.exports = new WebSessionManager();