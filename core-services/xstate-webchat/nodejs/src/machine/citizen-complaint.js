const { assign } = require('xstate');
const { pgrService } = require('./service/service-loader');
const dialog = require('./util/dialog');
const messages = require('./messages/complaint-messages');


const citizenComplaint = {
    id: 'citizenComplaint',
    initial: 'complaintCategory',
    onEntry: assign((context, event) => {
        context.slots.pgr = {}
        context.pgr = { slots: {} };
    }),
    states: {
        complaintCategory: {
            id: 'complaintCategory',
            initial: 'question',
            states: {
                question: {
                        onEntry: assign((context, event) => {
                        let message = dialog.get_message(messages.complaintMenu.prompt, context.user.locale);
                        const grammer = dialog.constructContextGrammer(messages.complaintMenu.options.list,
                                    messages.complaintMenu.options.messageBundle, context.user.locale);
                        context.grammer = grammer;
                        dialog.sendMessage(context, message, true);
                    }),
                    on: {
                        USER_MESSAGE: 'process'
                    }
                }, //question
                process: {
                    onEntry: assign((context, event) => {
                        context.intention = dialog.get_intention(context.grammer, event, true)
                    }),
                    always: [
                        {
                            target: '#complaintItem',
                            cond: (context) => context.intention != dialog.INTENTION_UNKOWN,
                            actions: assign((context, event) => {
                                context.slots.pgr["complaint"] = context.intention;
                                context.slots.pgr["complaintItem"] = context.intention;
                            })
                        },
                        {
                            target: 'error'
                        }
                    ]
                }, // process
                error: {
                    onEntry: assign((context, event) => {
                        dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), false);
                    }),
                    always: 'question',
                } // error
            } // states of complaintCategory
        }, // complaintCategory

        complaintItem: {
            id: 'complaintItem',
            initial: 'question',
            states: {
                question: {
                        onEntry: assign((context, event) => {
                        let complaintItem = context.slots.pgr.complaintItem;
                        let messageBundleForCode = messages.complaintCategoryItems[complaintItem].messageBundle;
                        let message = dialog.get_message(messageBundleForCode, context.user.locale);
                        let nextStepList = messages.complaintCategoryItems[complaintItem].nextStep;
                        let grammer = dialog.constructContextGrammer(nextStepList, messageBundleForCode, context.user.locale);
                        context.grammer = grammer;
                        dialog.sendMessage(context, message, true);
                    }),
                    on: {
                        USER_MESSAGE: 'process'
                    }
                }, //question
                process: {
                    onEntry: assign((context, event) => {
                        context.intention = dialog.get_intention(context.grammer, event, true)
                    }),
                    always: [
                        {
                            cond: (context) => context.intention == dialog.INTENTION_GOBACK,
                            target: '#complaintCategory'

                        },
                        {
                            cond: (context) => context.intention == 'persistComplaint',
                            target: '#persistComplaint',
                        },
                        {
                            cond: (context) => context.intention != dialog.INTENTION_UNKOWN,
                            target: '#complaintItem',
                            actions: assign((context, event) => {
                                context.slots.pgr["complaintItem"] = context.intention;
                            })
                        },

                        {
                            target: 'error'
                        }
                    ]
                }, // process
                error: {
                    onEntry: assign((context, event) => {
                        dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), false);
                    }),
                    always: 'question',
                } // error
            } // states of complaintItem
        }, // complaintItem



        persistComplaint: {
            id: 'persistComplaint',
            invoke: {
                id: 'persistComplaint',
                src: (context) => pgrService.persistComplaint(context.user, context.slots.pgr, context.extraInfo),
                onDone: {
                    target: '#endstate',
                    actions: assign((context, event) => {
                        let complaintDetails = event.data;
                        let message = dialog.get_message(messages.persistComplaint, context.user.locale);
                        //Email Notification here
                         message = message.replace('{{complaintNumber}}', complaintDetails.complaintNumber);
                         dialog.sendMessage(context, message);
                    })
                }
            }
        },
    }, 
}; 

module.exports = citizenComplaint;
