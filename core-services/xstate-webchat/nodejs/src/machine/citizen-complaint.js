const { assign } = require('xstate');
const { pgrService } = require('./service/service-loader');
const dialog = require('./util/dialog');
const messages = require('./messages/complaint-messages');
const emailNotificationService = require('./service/email-notification');

const citizenComplaint = {
  id: 'citizenComplaint',
  initial: 'complaintCategory',
  onEntry: assign((context, event) => {
    context.slots.pgr = {};
  }),
  states: {
    complaintCategory: {
      id: 'complaintCategory',
      initial: 'question',
      states: {
        question: {
          onEntry: assign((context, event) => {
            const message = dialog.get_message(messages.complaintMenu.prompt, context.user.locale);
            const grammer = dialog.constructContextGrammer(messages.complaintMenu.options.list,
              messages.complaintMenu.options.messageBundle, context.user.locale);
            context.grammer = grammer;
            dialog.sendMessage(context, message, true);
          }),
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
                context.slots.pgr.complaintItem = context.intention;
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
          onEntry: assign((context, event) => {
            const { complaintItem } = context.slots.pgr;
            const messageBundleForCode = messages.complaintCategoryItems[complaintItem].messageBundle;
            const message = dialog.get_message(messageBundleForCode, context.user.locale);
            const nextStepList = messages.complaintCategoryItems[complaintItem].nextStep;
            const grammer = dialog.constructContextGrammer(nextStepList, messageBundleForCode, context.user.locale);
            context.grammer = grammer;
            dialog.sendMessage(context, message, true);
          }),
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
              actions: assign((context, event) => {
                context.slots.pgr.complaintItem = context.intention;
              }),
            },
            {
              cond: (context) => context.intention != dialog.INTENTION_UNKOWN,
              target: '#complaintItem',
              actions: assign((context, event) => {
                context.slots.pgr.complaintItem = context.intention;
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
        src: (context) => pgrService.persistComplaint(context.user, context.slots.pgr, context.extraInfo, context.user.locale),
        onDone: {
          target: '#endstate',
          actions: assign((context, event) => {
            const complaintDetails = event.data;
            let message = dialog.get_message(messages.persistComplaint, context.user.locale);
            // Email Notification here
            const complaintType = 'Technical';
            const complaintSubType = dialog.get_message(messages.complaintMenu.options.messageBundle[context.slots.pgr.complaint], context.user.locale);
            const complaintId = complaintDetails.complaintNumber;
            const application_number = '';
            const phoneNumber = context.user.mobileNumber;
            const ComplaintComments = context.extraInfo.comments;
            const imageFilestoreId = context.extraInfo.filestoreId;
            // Insert the code for pushing email message to the Kafka topic here
            // TODO : Enter email address, location and requestInfo
            emailNotificationService.sendNewComplaintEmail({}, /*email needed here, */'abc@gmail.com', complaintId, complaintType, complaintSubType, application_number, phoneNumber, /*location, */'Ludhiana', ComplaintComments, imageFilestoreId);
            // Email notification ends
            message = message.replace('{{complaintNumber}}', complaintDetails.complaintNumber);
            dialog.sendMessage(context, message);
          }),
        },
      },
    },
  },
};

module.exports = citizenComplaint;
