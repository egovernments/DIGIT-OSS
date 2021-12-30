const { assign } = require('xstate');
const { pgrService } = require('./service/service-loader');
const dialog = require('./util/dialog');
const messages = require('./messages/complaint-messages');

const citizenComplaint = {
  id: 'citizenComplaint',
  initial: 'complaintCategory',
  onEntry: assign((context, event) => {
    context.slots.pgr = {};
    context.pgr = { slots: {} };
  }),
  states: {
    complaintCategory: {
      id: 'complaintCategory',
      initial: 'question',
      states: {
        question: {
          invoke: {
            src: (context, event) => pgrService.fetchComplaintCategories(context.extraInfo.tenantId),
            id: 'fetchComplaintCategories',
            onDone: {
              actions: assign((context, event) => {
                const { complaintCategories, messageBundle } = event.data;
                const message = dialog.get_message(messages.complaintMenu.prompt.preamble, context.user.locale);
                const grammer = dialog.constructContextGrammer(messages.complaintMenu.prompt.options.list,
                  messages.complaintMenu.prompt.options.messageBundle, context.user.locale);
                context.grammer = grammer;
                dialog.sendMessage(context, message, true);
              }),
            },
            onError: {
              target: '#system_error',
            },
          },
          on: {
            USER_MESSAGE: 'process',
          },
        }, // question
        process: {
          onEntry: assign((context, event) => {
            context.intention = dialog.get_intention(context.grammer, event, true);
          }),
          always: [
            {
              target: '#complaintItem',
              cond: (context) => context.intention != dialog.INTENTION_UNKOWN,
              actions: assign((context, event) => {
                context.slots.pgr.complaint = context.intention;
                // context.slots.pgr["ComplaintType"] = dialog.get_message(messages.complaintMenu.options.messageBundle[context.intention], context.user.locale);
              }),
            },
            {
              target: 'error',
            },
          ],
        }, // process
        error: {
          onEntry: assign((context, event) => {
            dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), false);
          }),
          always: 'question',
        }, // error
      }, // states of complaintCategory
    }, // complaintCategory

    complaintItem: {
      id: 'complaintItem',
      initial: 'question',
      states: {
        question: {
          invoke: {
            src: (context) => pgrService.fetchComplaintItemsForCategory(context.slots.pgr.complaint, context.extraInfo.tenantId),
            id: 'fetchComplaintItemsForCategory',
            onDone: {
              actions: assign((context, event) => {
                const { complaintItems, messageBundle } = event.data;
                const complaintItem = context.slots.pgr.complaint;
                const messageBundleForCode = messages.complaintCategoryItems[complaintItem].messageBundle;
                const message = dialog.get_message(messageBundleForCode, context.user.locale);
                const nextStepList = messages.complaintCategoryItems[complaintItem].nextStep;
                const grammer = dialog.constructContextGrammer(nextStepList, messageBundleForCode, context.user.locale);
                context.grammer = grammer;
                dialog.sendMessage(context, message, true);
              }),
            },
            onError: {
              target: '#system_error',
            },
          },
          on: {
            USER_MESSAGE: 'process',
          },
        }, // question
        process: {
          onEntry: assign((context, event) => {
            context.intention = dialog.get_intention(context.grammer, event, true);
          }),
          always: [
            {
              cond: (context) => context.intention == dialog.INTENTION_GOBACK,
              target: '#complaintCategory',

            },
            {
              cond: (context) => context.intention == 'persistComplaint',
              target: '#persistComplaint',
              // actions: assign((context,event)=>{
              //     context.slots.pgr["image"]=event.message.input;
              //     context.slots.pgr["additionalDetail"]=event.message.input;
              // })

            },
            {
              cond: (context) => context.intention != dialog.INTENTION_UNKOWN,
              target: '#complaintItem',
              actions: assign((context, event) => {
                context.slots.pgr.complaint = context.intention;
              }),
            },

            {
              target: 'error',
            },
          ],
        }, // process
        error: {
          onEntry: assign((context, event) => {
            dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), false);
          }),
          always: 'question',
        }, // error
      }, // states of complaintItem
    }, // complaintItem

    persistComplaint: {
      id: 'persistComplaint',
      invoke: {
        id: 'persistComplaint',
        src: (context) => pgrService.persistComplaint(context.user, context.slots.pgr, context.extraInfo),
        onDone: {
          target: '#endstate',
          actions: assign((context, event) => {
            const complaintDetails = event.data;
            let message = dialog.get_message(messages.persistComplaint, context.user.locale);
            // Email Notification here
            //  message = message.replace('{1234567890}', complaintDetails.complaintNumber);
            // message = message.replace('{{complaintLink}}', complaintDetails.complaintLink);
            const closingStatement = dialog.get_message(messages.closingStatement, context.user.locale);
            message += closingStatement;
            dialog.sendMessage(context, message);
          }),
        },
      },
    },
  }, // fileComplaint.states

  // pgr.states
}; // pgr

module.exports = citizenComplaint;
