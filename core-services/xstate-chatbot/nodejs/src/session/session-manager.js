const sevaStateMachine =  require('../machine/seva'),
    channelProvider = require('../channel'),
    chatStateRepository = require('./repo'),
    telemetry = require('./telemetry'),
    system = require('./system'),
    userService = require('./user-service');
const { State, interpret } = require('xstate');
const dialog = require('../machine/util/dialog.js');

class SessionManager {

    async fromUser(reformattedMessage) {
        let mobileNumber = reformattedMessage.user.mobileNumber;
        let user = await userService.getUserForMobileNumber(mobileNumber, reformattedMessage.extraInfo.tenantId);
        reformattedMessage.user = user;
        let userId = user.userId;

        let chatState = await chatStateRepository.getActiveStateForUserId(userId);
        telemetry.log(userId, 'from_user', reformattedMessage);

        // handle reset case
        let intention = dialog.get_intention(grammer.reset, reformattedMessage, true)
        // if (intention == 'reset' && chatState) {
        //     chatStateRepository.updateState(userId, false, JSON.stringify(chatState));
        //     chatState = null; // so downstream code treats this like an inactive state and creates a new machine
        // }

        let service;
        if(!chatState) {
            // come here if virgin dialog, old dialog was inactive, or reset case
            chatState = this.createChatStateFor(user);
            let saveState = JSON.parse(JSON.stringify(chatState));
            saveState = this.removeUserDataFromState(saveState);
            await chatStateRepository.insertNewState(userId, true, JSON.stringify(saveState));
        } 
        service = this.getChatServiceFor(chatState, reformattedMessage);
        
        let event = (intention == 'reset')? 'USER_RESET' : 'USER_MESSAGE';
        service.send(event, reformattedMessage );
    }
    async toUser(user, outputMessages, extraInfo) {
        channelProvider.sendMessageToUser(user, outputMessages, extraInfo);
        for(let message of outputMessages) {
            telemetry.log(user.userId, 'to_user', {message : {type: "text", output: message}});
        }
    }

    removeUserDataFromState(state) {
        let userId = state.context.user.userId;
        let locale = state.context.user.locale;
        state.context.user = undefined;
        state.context.user = { locale: locale, userId: userId };
        state.event = {};
        state._event = {};
        if(state.history)
            state.history.context.user = {};
        return state;
    }

    getChatServiceFor(chatStateJson, reformattedMessage) {
        const context = chatStateJson.context;
        context.chatInterface = this;
        let locale = context.user.locale;
        context.user = reformattedMessage.user;
        context.user.locale = locale;
        context.extraInfo = reformattedMessage.extraInfo;

        const state = State.create(chatStateJson);
        const resolvedState = sevaStateMachine.withContext(context).resolveState(state);
        const service = interpret(sevaStateMachine).start(resolvedState);

        service.onTransition( state => {
            if(state.changed) {
                let userId = state.context.user.userId;
                let stateStrings = state.toStrings()
                telemetry.log(userId, 'transition', {destination: stateStrings[stateStrings.length-1]});

                let active = !state.done && !state.forcedClose;
                let saveState = JSON.parse(JSON.stringify(state));      // deep copy
                saveState = this.removeUserDataFromState(saveState);
                chatStateRepository.updateState(userId, active, JSON.stringify(saveState));
            }
        });

        return service;
    }

    createChatStateFor(user) {
        let service = interpret(sevaStateMachine.withContext ({
            chatInterface: this,
            user: user,
            slots: {pgr: {}, bills: {}, receipts: {}}
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
        {intention: 'reset', recognize: ['Hi', 'hi', 'mseva', 'seva', 'सेवा']},
    ]
}

module.exports = new SessionManager();