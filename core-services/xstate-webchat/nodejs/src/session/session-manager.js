const { State, interpret } = require('xstate');
const chatStateMachine = require('../machine/chat-machine');
const channelProvider = require('../channel/webchat-message-processor');
const chatStateRepository = require('./repo');
const telemetry = require('./telemetry');
const system = require('./system');
const userService = require('./user-service');
const dialog = require('../machine/util/dialog.js');

class SessionManager {
  async fromUser(reformattedMessage, connection) {
    const { mobileNumber } = reformattedMessage.user;
    const user = await userService.getUserForMobileNumber(mobileNumber, reformattedMessage.extraInfo.tenantId);
    reformattedMessage.user = user;
    const userId = user.userId;
    let chatState = await chatStateRepository.getActiveStateForUserId(userId);
    telemetry.log(userId, 'from_user', reformattedMessage);

    if (!chatState) {
      // come here if virgin dialog, old dialog was inactive, or reset case
      chatState = this.createChatStateFor(user, connection);
      let saveState = JSON.parse(JSON.stringify(chatState, (key, value) => {
        if (key == 'connection') {
          return {};
        } else {
          return value;
      };
      }));
      saveState = this.removeUserDataFromState(saveState);
      await chatStateRepository.insertNewState(userId, true, JSON.stringify(saveState));
    }
    const service = this.getChatServiceFor(chatState, reformattedMessage, connection);
    const intention = await dialog.get_intention(grammer.reset, reformattedMessage, true);
    const event = (intention == 'reset') ? 'USER_RESET' : 'USER_MESSAGE';
    service.send(event, reformattedMessage);
  }

  async toUser(user, outputMessages, extraInfo, connection) {
    console.log('channelProvider', channelProvider);
    channelProvider.sendMessageToUser(user, outputMessages, extraInfo, connection);
    for (const message of outputMessages) {
      telemetry.log(user.userId, 'to_user', { message: { type: 'text', output: message } });
    }
  }

  removeUserDataFromState(state) {
    const { userId } = state.context.user;
    const { locale } = state.context.user;
    state.context.user = undefined;
    state.context.user = { locale, userId };
    state.event = {};
    state._event = {};
    if (state.history) { state.history.context.user = {}; }
    return state;
  }

  getChatServiceFor(chatStateJson, reformattedMessage, connection) {
    const { context } = chatStateJson;
    context.chatInterface = this;
    const { locale } = context.user;
    context.user = reformattedMessage.user;
    context.user.locale = locale;
    context.extraInfo = reformattedMessage.extraInfo;
    context.connection = connection;

    const state = State.create(chatStateJson);
    const resolvedState = chatStateMachine.withContext(context).resolveState(state);
    const service = interpret(chatStateMachine).start(resolvedState);

    service.onTransition((state) => {
      if (state.changed) {
        const { userId } = state.context.user;
        const stateStrings = state.toStrings();
        telemetry.log(userId, 'transition', { destination: stateStrings[stateStrings.length - 1] });

        const active = !state.done && !state.forcedClose;
        let saveState = JSON.parse(JSON.stringify(state, (key, value) => {
          if (key == 'connection') {

          } else {
            return value;
          }
        })); // deep copy
        saveState = this.removeUserDataFromState(saveState);
        chatStateRepository.updateState(userId, active, JSON.stringify(saveState));
      }
    });

    return service;
  }

  createChatStateFor(user, connection) {
    const service = interpret(chatStateMachine.withContext({
      chatInterface: this,
      user,
      slots: { pgr: {} },
      connection,
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
  ],
};

module.exports = new SessionManager();
