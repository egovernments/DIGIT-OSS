const { assign } = require('xstate');
const { pgrService } = require('./service/service-loader');
const { workFlowService, propertyService } = require('./service/service-loader');
const dialog = require('./util/dialog');
const { messages, grammers } = require('./messages/complaint-messages');
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
            let a = dialog.get_intention(context.grammer, event, true);
            context.intention = a;
            
          }),
          always: [
                        {
                            cond: (context) => context.intention == dialog.INTENTION_GOBACK,
                            target: '#complaintCategory',
                        },
                        {
                            cond: (context) => context.intention == 'appidSearch',
                            target: '#appidSearch',
                            actions: assign((context, event) => {
                                context.slots.pgr["complaintItem"] = context.intention;
                            })
                        },
                        {
                          cond: (context) => context.intention == 'rejectionreason',
                          target: '#rejectionreason',
                          actions: assign((context, event) => {
                            context.slots.pgr.complaintItem = context.intention;
                          }),
                        },
                        {
                            cond: (context) => context.intention == 'persistComplaint',
                            target: '#persistComplaint',
                            actions: assign((context, event) => {
                                context.slots.pgr["complaintItem"] = context.intention;
                            })
                        },
                        {
                          cond: (context) => context.intention == 'selectproperty',
                          target: '#selectProperty',
                          actions: assign((context, event) => {
                              context.slots.pgr["mobileNumber"] = context.intention;
                          })
                        },
                        {
                            cond: (context) => context.intention != dialog.INTENTION_UNKOWN,
                            target: '#complaintItem',
                            actions: assign((context, event) => {
                                context.slots.pgr["complaintItem"] = context.intention;
                            })
                        },
                        {
                          target: 'error',
                        },
          ],
        }, // process
        error: {
          onEntry: assign((context, event) => {
            dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), true);
          }),
          always: 'question',
        }, // error
      }, // states of complaintItem
    }, // complaintItem

        appidSearch: {
            id: 'appidSearch',
            invoke: {
                id: 'fetchappStatus',
                src: (context) => workFlowService.getApplicationStatus(context.user,context.extraInfo.applicationId),
                onDone: {
                    target: '#appidSubmit',
                    actions: assign((context, event) => {
                        let message = dialog.get_message(messages.complaintCategoryItems.appidSearch.messageBundle, context.user.locale);
                        message.appstatus=event.data.AppStatus;
                        let nextStepList = messages.complaintCategoryItems[context.intention].nextStep;
                        let messageBundleForCode = '';
                        let grammer = dialog.constructContextGrammer(nextStepList, messageBundleForCode, context.user.locale);
                        context.grammer = grammer;
                        dialog.sendMessage(context, message);
                    })
                }
            }
        },

        appidSubmit: {
            id: 'appidSubmit',
            initial: 'wait',
            states: {
                wait: {
                       on: {USER_MESSAGE: 'process' }
                }, 
                process: {
                    onEntry: assign((context, event) => {
                        context.intention = dialog.get_intention(context.grammer, event, true)
                    }),
                    always: [
                        {
                            cond: (context) => context.intention == 'Yes',
                            target: '#complaintItem',
                            actions: assign((context, event) => {
                                //Here we need to push Complaint Comments to the context to ask for user comments
                                context.slots.pgr["complaintItem"] = 'complaintComments';
                            })
                        },
                        {
                            cond: (context) => context.intention == 'No',
                            target: '#endstate'

                        },
                       {
                            target: 'error'
                       }
                    ]
                }, // process
                error: {
                    onEntry: assign((context, event) => {
                        dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), true);
                    }),
                    always: 'wait',
                } 
            } 
        }, 
        
        selectProperty:{
          id: 'selectProperty',
            invoke: {
                id: 'fetchPropertyData',
                src: (context) => propertyService.getPropertyData(context.extraInfo.mobileNumber,context.user),
                onDone: {
                    target: '#lastbillgenerated',
                    actions: assign((context, event) => {
                        let billDetails = event.data;
                        let messageBundleForCode = messages.complaintCategoryItems['selectproperty'].messageBundle;
                        let message = dialog.get_message(messageBundleForCode, context.user.locale);
                        message.option.length=0;
                        for(let i = 0; i<billDetails.length;i++){
                          let option = {
                            key: i+1,
                            value: billDetails[i].id
                          };
                          message.option.push(option);
                        }
                        dialog.sendMessage(context, message, true);
                        context.slots.pgr["billDetails"] = billDetails;  
                    })
                }
            }

        },

        lastbillgenerated:{
          id:'lastbillgenerated',
          initial: 'question',
          states:{
            question: {
              onEntry: assign((context, event) => {
                
              }),
              on: {
                USER_MESSAGE: 'process',
              },
            },

            process: {
              onEntry: assign((context, event) => {
               let input = parseInt(event.message.input);
               let billSize = context.slots.pgr["billDetails"].length;
               let isValid = input>0 && input <= billSize ? true : false;
               context.message = {
                 isValid: isValid,
                 messageContent: input
               };
              }),
              always: [
                {
                  target: '#billComplaintProcess',
                  cond: (context) => context.message.isValid
                }
              ],
            }
          },
        },

        billComplaintProcess: {
          id:'billComplaintProcess',
          initial: 'question',
          states:{
            question: {
              onEntry: assign((context, event) => {
                let messageBundleForCode = messages.complaintCategoryItems['lastbillgenerated'].messageBundle;
                let message = dialog.get_message(messageBundleForCode, context.user.locale);
                let data = context.slots.pgr.billDetails[context.message.messageContent - 1];
                message.message = message.message.replace('<Bill ID>', data.billNumber);
                message.message = message.message.replace('<Amount>',data.dueAmount);

                dialog.sendMessage(context, message, true);
              }),
              on: {
                USER_MESSAGE: 'process',
              },
            },
            process:{
              onEntry: assign((context, event) => {
                context.intention = dialog.get_intention(grammers.confirmation.choice, event);
              }),
              always: [
                {
                  target: '#complaintComments',
                  cond: (context) => ( context.intention == 'No' || context.intention == 'Yes'),
                  actions: assign((context, event) => {
                    context.slots.pgr["raisebillComplaintChoice"] = context.intention;
                  })
                },
                {
                  target: 'error',
                  cond: (context, event) => context.intention === dialog.INTENTION_UNKOWN,
                },
              ],
            },
            error: {
              onEntry: assign((context, event) => {
                  dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), true);
              }),
              always: 'wait',
            },
            wait: {
              on: {USER_MESSAGE: 'process' }
            }, 

          },  
        },
        complaintComments: {
          id: 'complaintComments',
          initial: 'question',
          states: {
            question: {
              onEntry: assign((context, event) => {
                let messageBundleForCode = messages.complaintCategoryItems['complaintComments'].messageBundle;
                let message = dialog.get_message(messageBundleForCode, context.user.locale);
                dialog.sendMessage(context, message, true);
              }),
              on: {
                USER_MESSAGE: 'process',
              },
            }, // question
            process: {
              onEntry: assign((context, event) => {
                context.slots.pgr['comments'] = event.extraInfo.comments;
                context.slots.pgr['filestoreId'] = event.extraInfo.filestoreId;
              }),
              always: {
                target: '#persistComplaint',
              },
    
            },
          },
        },

        rejectionreason: {
          id: 'rejectionreason',
          invoke: {
            id: 'rejectionreason',
            src: (context) => workFlowService.getApplicationStatus(context.user, context.extraInfo.applicationId),
            onDone: {
              target: '#rejectionprocessing',
              actions: assign((context, event) => {
                let message = dialog.get_message(messages.complaintCategoryItems.rejectionreason.messageBundle, context.user.locale);
                const appStatus = String(event.data.AppStatus[0].status);
                const uptMsg = message.message.replace('{{rejectionReason}}', appStatus);
                message.message = uptMsg;
                const nextStepList = messages.complaintCategoryItems[context.intention].nextStep;
                const messageBundleForCode = '';
                const grammer = dialog.constructContextGrammer(nextStepList, messageBundleForCode, context.user.locale);
                context.grammer = grammer;
                dialog.sendMessage(context, message);
              }),
            },
          },
        },
    
        rejectionprocessing: {
          id:'rejectionprocessing',
          initial: 'question',
          initial: 'question',
          states:{
            question: {
              onEntry: assign((context, event) => {
                
              }),
              on: {
                USER_MESSAGE: 'process',
              },
            },
            process:{
              onEntry: assign((context, event) => {
                context.intention = dialog.get_intention(grammers.confirmation.choice, event);
              }),
              always: [
                {
                    cond: (context) => context.intention == 'Yes',
                    target: '#complaintItem',
                    actions: assign((context, event) => {
                        context.slots.pgr["complaintItem"] = 'complaintComments';
                    })
                },
                {
                    cond: (context) => context.intention == 'No',
                    target: '#endstate'
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
              always: 'wait',
            },
            wait: {
              on: {USER_MESSAGE: 'process' }
            }, 
          },
        },
        persistComplaint: {
            id: 'persistComplaint',
            invoke: {
                id: 'persistComplaint',
                src: (context) => pgrService.persistComplaint(context.user, context.slots.pgr, context.extraInfo,context.user.locale),
                onDone: {
                    target: '#endstate',
                    actions: assign((context, event) => {
                        let complaintDetails = event.data;
                        let message = dialog.get_message(messages.persistComplaint, context.user.locale);
                        //Email Notification here
                        let complaintType='Technical';
                        let complaintSubType = dialog.get_message(messages.complaintMenu.options.messageBundle[context.slots.pgr.complaint], context.user.locale);
                        let complaintId=complaintDetails.complaintNumber;
                        let application_number='';
                        let phoneNumber=context.user.mobileNumber;
                        let ComplaintComments=context.extraInfo.comments;
                        let imageFilestoreId=context.extraInfo.filestoreId;
                        //Insert the code for pushing email message to the Kafka topic here
                        //Email notification ends
                         message = message.replace('{{complaintNumber}}', complaintDetails.complaintNumber);
                         dialog.sendMessage(context, message);
                    })
                }
            }
        },
      },
    
  
};

module.exports = citizenComplaint;
