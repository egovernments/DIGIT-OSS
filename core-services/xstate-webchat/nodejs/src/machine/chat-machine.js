const { createMachine, assign } = require('xstate');
const dialog = require('./util/dialog.js');
const messages = require('./messages/chat-machine');
const citizenComplaint = require('./citizen-complaint');
const serviceRating = require('./serviceRating');

const chatStateMachine = createMachine({
  id: 'chatMachine',
  initial: 'start',
  on: {
    USER_RESET: {
      target: '#chatmenu'
    }
  },
  states: {
    start: {
      on: {
        USER_MESSAGE: {
            target: '#chatmenu'
          }
        }
    },
    chatmenu: {
      id: 'chatmenu',
      initial: 'question',
      states: {
        question: {
          onEntry: assign((context, event) => {
            let message = dialog.get_message(messages.menu.prompt, context.user.locale);
            const grammer = dialog.constructContextGrammer(messages.menu.options.list, 
              messages.menu.options.messageBundle, context.user.locale);
            context.grammer = grammer;
            dialog.sendMessage(context, message, true);
          }),
          on: {
            USER_MESSAGE: 'process',
          },
        },
        process: {
          onEntry: assign((context, event) => {
            context.intention = dialog.get_intention(context.grammer, event, true);
          }),
          always: [
            {
              cond: (context) => context.intention == 'complaint',
              target: '#citizenComplaint',
            },
            {
              target: '#serviceRating',
              cond: (context) => context.intention == 'providefeedback'
            },
            {
              target: '#serviceRating',
              cond: (context) => context.intention == 'rateservice'
            },
            {
              target: 'error'
            }
          ]
        },
        error: {
          onEntry: assign((context, event) => {
            dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), true);
          }),
          always: 'question'
        },
        citizenComplaint: citizenComplaint,
        serviceRating: serviceRating
      }
    },
    endstate: {
      id: 'endstate',
      always: 'start',
    },
    system_error: {
      id: 'system_error',
      always: {
        target: 'start',
        actions: assign((context, event) => {
          const message = dialog.get_message(dialog.global_messages.system_error, context.user.locale);
          dialog.sendMessage(context, message, true);
          context.chatInterface.system_error(event.data);
        }),
      },
    },
  }, // states
}); // Machine

module.exports = chatStateMachine;
