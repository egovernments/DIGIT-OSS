const { assign } = require('xstate');
const { billService } = require('./service/service-loader');
const dialog = require('./util/dialog');
const config = require('../env-variables');


const bills = {
  id: 'bills',
  initial: 'start',
  states: {
    start: {
      onEntry: assign((context, event) => {
        context.slots.bills = {};
        context.bills = {slots: {}};
        if(context.intention == 'ws_bills')
          context.service = 'WS';
        else if(context.intention == 'pt_bills')
          context.service = 'PT';
        else
          context.service = null;
      }),
      invoke: {
        id: 'fetchBillsForUser',
        src: (context) => billService.fetchBillsForUser(context.user,context.service),
        onDone: [
          {
            target: 'personalBills',
            cond: (context, event) => {
              return event.data.pendingBills;
            },
            actions: assign((context, event) => {
              context.bills.pendingBills = event.data.pendingBills;
            })
          },
          {
            target: 'noBills',
            actions: assign((context, event) => {
              context.totalBills = event.data.totalBills;
            })
          }
        ],
        onError: {
          target: '#endstate',
          actions: assign((context, event) => {
            let message = dialog.get_message(dialog.global_messages.system_error, context.user.locale);
            dialog.sendMessage(context, message, true);
          })
        }
      }
    },
    personalBills: {
      id: 'personalBills',
      onEntry: assign((context, event) => {
        (async() => { 
          let templateList;
          let bills = context.bills.pendingBills;
          let localeList = config.supportedLocales.split(',');
          let localeIndex = localeList.indexOf(context.user.locale);
          if(context.service == 'WS')
            templateList =  config.valueFirstWhatsAppProvider.valuefirstNotificationWSBillTemplateid.split(',');
          else
            templateList =  config.valueFirstWhatsAppProvider.valuefirstNotificationPTBillTemplateid.split(',');
  
          if(templateList[localeIndex])
            context.extraInfo.templateId = templateList[localeIndex];
          else
            context.extraInfo.templateId = templateList[0];
  
          if(bills.length === 1) {
            let bill = bills[0];
            dialog.sendMessage(context, dialog.get_message(messages.personalBills.singleRecord, context.user.locale), true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            let params=[];
            params.push(bill.id);
            params.push(bill.payerName);
            params.push("₹ "+bill.dueAmount);
            params.push(bill.dueDate);
  
            let urlComponemt = bill.paymentLink.split('/');
            let bttnUrlComponent = urlComponemt[urlComponemt.length -1];
  
            var templateContent = {
              output: context.extraInfo.templateId,
              type: "template",
              params: params,
              bttnUrlComponent: bttnUrlComponent
            };
  
            dialog.sendMessage(context, templateContent, true);
          } else {
            let services = bills.map(element => element.service);
            let serviceSet = new Set(services);
            if(services.length === serviceSet.size) {
              dialog.sendMessage(context, dialog.get_message(messages.personalBills.multipleRecords, context.user.locale), true);
              await new Promise(resolve => setTimeout(resolve, 1000));

              for(let i = 0; i < bills.length; i++) {
                let bill = bills[i];
  
                let params=[];
                params.push(bill.id);
                params.push(bill.payerName);
                params.push("₹ "+bill.dueAmount);
                params.push(bill.dueDate);
  
                let urlComponemt = bill.paymentLink.split('/');
                let bttnUrlComponent = urlComponemt[urlComponemt.length -1];
  
                var templateContent = {
                  output: context.extraInfo.templateId,
                  type: "template",
                  params: params,
                  bttnUrlComponent: bttnUrlComponent
                };
  
                if(i==bills.length-1)
                  dialog.sendMessage(context, templateContent, true);
                else
                  dialog.sendMessage(context, templateContent, false);
              }
            } else {
              dialog.sendMessage(context, dialog.get_message(messages.personalBills.multipleRecordsSameService, context.user.locale), true);
              await new Promise(resolve => setTimeout(resolve, 1000));

              for(let i = 0; i < bills.length; i++) {
                let bill = bills[i];
  
                let params=[];
                params.push(bill.id);
                params.push(bill.payerName);
                params.push("₹ "+bill.dueAmount);
                params.push(bill.dueDate);
  
                let urlComponemt = bill.paymentLink.split('/');
                let bttnUrlComponent = urlComponemt[urlComponemt.length -1];
  
                var templateContent = {
                  output: context.extraInfo.templateId,
                  type: "template",
                  params: params,
                  bttnUrlComponent: bttnUrlComponent
                };
  
                if(i == bills.length-1)
                  dialog.sendMessage(context, templateContent, true);
                else
                  dialog.sendMessage(context, templateContent, false);            }
            }
          }

        })();
        
      }),
      always: '#searchBillInitiate'
    },
    searchBillInitiate: {
      id: 'searchBillInitiate',
      initial: 'question',
      states: {
        question: {
          onEntry: assign((context, event) => {
            /*let { services, messageBundle } = billService.getSupportedServicesAndMessageBundle();
            let billServiceName = dialog.get_message(messageBundle[context.service],context.user.locale);
            let message = dialog.get_message(messages.searchBillInitiate.question, context.user.locale);
            message = message.replace(/{{billserviceName}}/g, billServiceName);
            dialog.sendMessage(context, message);*/        
          }),
          on: {
            USER_MESSAGE: 'process'
          }
        },
        process: {
          onEntry: assign((context, event) => {
            let messageText = event.message.input;
            messageText = messageText.toLowerCase();
            let isValid = ((messageText === 'main menu' || messageText === 'pay other bill') && dialog.validateInputType(event, 'button'));
            context.message = {
              isValid: isValid,
              messageContent: messageText
            };
          }),
          always: [
            {
              target: 'error',
              cond: (context, event) => {
                return ! context.message.isValid;
              }
            },
            {
              target: '#billServices',
              cond: (context, event) => {
                return (context.message.isValid && context.message.messageContent ==='pay other bill');
              }
            },
            {
              target: '#sevamenu',
              cond: (context, event) => {
                return (context.message.isValid && context.message.messageContent ==='main menu');
              }
            }
          ]
        },
        error: {
          onEntry: assign( (context, event) => {
            let message = dialog.get_message(dialog.global_messages.error.retry, context.user.locale);
            dialog.sendMessage(context, message);
          }),
          always : 'question'
        }
      }
    },
    noBills: {
      id: 'noBills',
      onEntry: assign( (context, event) => {
        let message;
        let { services, messageBundle } = billService.getSupportedServicesAndMessageBundle();
        let billServiceName = dialog.get_message(messageBundle[context.service],context.user.locale);

        if(context.totalBills === 0) {
          let { searchOptions, messageBundle } = billService.getSearchOptionsAndMessageBundleForService(context.service);
          context.slots.bills.searchParamOption = searchOptions[0];
          let { option, example } = billService.getOptionAndExampleMessageBundle(context.service, context.slots.bills.searchParamOption);
          let optionMessage = dialog.get_message(option, context.user.locale);
          message = dialog.get_message(messages.noBills.notLinked, context.user.locale);
          message = message.replace(/{{searchOption}}/g,optionMessage);
          message = message.replace(/{{service}}/g,billServiceName.toLowerCase());
        } else {
          message = dialog.get_message(messages.noBills.noPending, context.user.locale);
        }
        dialog.sendMessage(context, message, true);
        
      }),
      always: 'billServices'
    },

   /* billServices: {
      id: 'billServices',
      initial: 'question',
      states: {
        question: {
          onEntry: assign((context, event) => {
            let { services, messageBundle } = billService.getSupportedServicesAndMessageBundle();
            let preamble = dialog.get_message(messages.billServices.question.preamble, context.user.locale);
            let { prompt, grammer } = dialog.constructListPromptAndGrammer(services, messageBundle, context.user.locale);
            context.grammer = grammer;
            dialog.sendMessage(context, `${preamble}${prompt}`);
          }),
          on: {
            USER_MESSAGE: 'process'
          }    
        },
        process: {
          onEntry: assign((context, event) => {
            context.intention = dialog.get_intention(context.grammer, event, true);
          }),
          always: [
            {
              target: 'error',
              cond: (context, event) => context.intention === dialog.INTENTION_UNKOWN
            },
            {
              target: '#searchParamOptions',
              actions: assign((context, event) => {
                context.slots.bills['service'] = context.intention;
              })
            }
          ]
        },
        error: {
          onEntry: assign((context, event) => {
            let message = dialog.get_message(messages.billServices.error, context.user.locale);
            dialog.sendMessage(context, message, false);
          }),
          always: 'question'
        }
      }
    },
    searchParamOptions: {
      id: 'searchParamOptions',
      initial: 'question',
      states: {
        question: {
          onEntry: assign((context, event) => {
            let { searchOptions, messageBundle } = billService.getSearchOptionsAndMessageBundleForService(context.slots.bills.service);
            let preamble = dialog.get_message(messages.searchParamOptions.question.preamble, context.user.locale);
            let { prompt, grammer } = dialog.constructListPromptAndGrammer(searchOptions, messageBundle, context.user.locale);
            context.grammer = grammer;
            dialog.sendMessage(context, `${preamble}${prompt}`);
          }),
          on: {
            USER_MESSAGE: 'process'
          },
        },
        process: {
          onEntry: assign((context, event) => {
            context.intention = dialog.get_intention(context.grammer, event, true);
          }),
          always: [
            {
              target: 'error',
              cond: (context, event) => context.intention === dialog.INTENTION_UNKOWN
            },
            {
              target: '#paramInput',
              actions: assign((context, event) => {
                context.slots.bills.searchParamOption = context.intention;
              })
            }  
          ]
        },
        error: {
          onEntry: assign((context, event) => {
            let message = dialog.get_message(messages.searchParamOptions.error, context.user.locale);
            dialog.sendMessage(context, message, false);
          }),
          always: 'question'
        }
      }
    },*/
    

    billServices: {
      id: 'billServices',
      initial: 'question',
      states: {
        question: {
          onEntry: assign((context, event) => {
            (async() => { 
              await new Promise(resolve => setTimeout(resolve, 1500));
              let { searchOptions, messageBundle } = billService.getSearchOptionsAndMessageBundleForService(context.service);
              context.slots.bills.searchParamOption = searchOptions[0];
              let { option, example } = billService.getOptionAndExampleMessageBundle(context.service, context.slots.bills.searchParamOption);
              let optionMessage = dialog.get_message(option, context.user.locale);
  
              let message = dialog.get_message(messages.billServices.question.preamble, context.user.locale);
              message = message.replace(/{{searchOption}}/g,optionMessage);
              dialog.sendMessage(context, message, true);
            })();

          }),
          on: {
            USER_MESSAGE: 'process'
          }    
        },
        process: {
          onEntry: assign((context, event) => {
            if(dialog.validateInputType(event, 'text'))
              context.intention = dialog.get_intention(grammer.confirmation.choice, event, true);
            else
              context.intention = dialog.INTENTION_UNKOWN;
          }),
          always: [
            {
              target: '#paramInput',
              cond: (context) => context.intention == 'Yes'
            },
            {
              target: 'openSearch',
              cond: (context) => context.intention == 'No',
            },
            {
              target: 'error'
            }
          ]
        },
        openSearch:{
          onEntry: assign((context, event) => {
            (async() => {
              context.slots.bills.openSearchLink = await billService.getOpenSearchLink(context.service);
              let { services, messageBundle } = billService.getSupportedServicesAndMessageBundle();
              let billServiceName = dialog.get_message(messageBundle[context.service],context.user.locale);
              let message = dialog.get_message(messages.openSearch, context.user.locale);
              message = message.replace(/{{billserviceName}}/g,billServiceName.toLowerCase());
              message = message.replace('{{link}}',context.slots.bills.openSearchLink);

              dialog.sendMessage(context, message, true);
              var imageMessage = {
                type: 'image',
                output: config.billsAndReceiptsUseCase.openSearchImageFilestoreId
              };
              dialog.sendMessage(context, imageMessage);
            })();
          }),


          always: '#endstate'
        },
        error: {
          onEntry: assign( (context, event) => {
            dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), true);
          }),
          always : 'question'
        }
      }
    },
    paramInput: {
      id: 'paramInput',
      initial: 'question',
      states: {
        question: {
          onEntry: assign((context, event) => {
            (async() => { 
              await new Promise(resolve => setTimeout(resolve, 1500));
              let { searchOptions, messageBundle } = billService.getSearchOptionsAndMessageBundleForService(context.service);
              context.slots.bills.searchParamOption = searchOptions[0];
              let { option, example } = billService.getOptionAndExampleMessageBundle(context.service, context.slots.bills.searchParamOption);
              let message = dialog.get_message(messages.paramInput.question, context.user.locale);
              let optionMessage = dialog.get_message(option, context.user.locale);
              let exampleMessage = dialog.get_message(example, context.user.locale);
              message = message.replace('{{option}}', optionMessage);
              message = message.replace('{{example}}', exampleMessage);
              dialog.sendMessage(context, message, true);

            })();
            
          }),
          on: {
            USER_MESSAGE: 'process'
          }
        },
        process: {
          onEntry: assign((context, event) => {
            let paramInput = event.message.input;
            let { searchOptions, messageBundle } = billService.getSearchOptionsAndMessageBundleForService(context.service);
            context.slots.bills.searchParamOption = searchOptions[0];
            context.isValid = billService.validateParamInput(context.service, context.slots.bills.searchParamOption, paramInput);
            if(context.isValid) {
              context.slots.bills.paramInput = paramInput;
            }
          }),
          always: [
            {
              target: '#billSearchResults',
              cond: (context, event) => context.isValid
            },
            {
              target: 're_enter'
            }
          ]
        },
        re_enter: {
          onEntry: assign((context, event) => {
            let { searchOptions, messageBundle } = billService.getSearchOptionsAndMessageBundleForService(context.service);
            context.slots.bills.searchParamOption = searchOptions[0];
            let { option, example } = billService.getOptionAndExampleMessageBundle(context.slots.bills.service, context.slots.bills.searchParamOption);
            let message = dialog.get_message(messages.paramInput.re_enter, context.user.locale);
            let optionMessage = dialog.get_message(option, context.user.locale);
            message = message.replace('{{option}}', optionMessage);
            dialog.sendMessage(context, message, true);
          }),
          always:{
            target: 'question'
          }
        }
      }
    },
    billSearchResults: {
      id: 'billSearchResults',
      initial: 'fetch',
      states: {
        fetch: {
          invoke: {
            id: 'fetchBillsForParam',
            src: (context, event) => {
              let slots = context.slots.bills;
              return billService.fetchBillsForParam(context.user, context.service, slots.searchParamOption, slots.paramInput);
            },
            onDone: [
              {
                cond: (context, event) => event.data === undefined || event.data.length === 0,
                target: 'noRecords'
              },
              {
                target: 'results',
                actions: assign((context, event) => {
                  context.bills.searchResults = event.data;
                })
              }
            ]
          }
        },
        noRecords: {
          onEntry: assign((context, event) => {
            /*let message = dialog.get_message(messages.billSearchResults.noRecords, context.user.locale);
            let { searchOptions, messageBundle } = billService.getSearchOptionsAndMessageBundleForService(context.slots.bills.service);
            message = message.replace('{{searchParamOption}}', dialog.get_message(messageBundle[context.slots.bills.searchParamOption], context.user.locale));
            message = message.replace('{{paramInput}}', context.slots.bills.paramInput);
            dialog.sendMessage(context, message, false);*/
            (async() => { 
              let { option, example } = billService.getOptionAndExampleMessageBundle(context.slots.bills.service, context.slots.bills.searchParamOption);
              let message = dialog.get_message(messages.paramInput.re_enter, context.user.locale);
              let optionMessage = dialog.get_message(option, context.user.locale);
              message = message.replace('{{option}}', optionMessage);
              dialog.sendMessage(context, message, true);
              await new Promise(resolve => setTimeout(resolve, 1000));
            })();
            
          }),
          always: '#paramInput'
        },
        results: {
          onEntry: assign((context, event) => {
            (async() => {  
              let templateList;
              let bills = context.bills.searchResults;
              let localeList = config.supportedLocales.split(',');
              let localeIndex = localeList.indexOf(context.user.locale);
              if(context.service == 'WS')
                templateList =  config.valueFirstWhatsAppProvider.valuefirstNotificationWSBillTemplateid.split(',');
              else
                templateList =  config.valueFirstWhatsAppProvider.valuefirstNotificationPTBillTemplateid.split(',');
    
              if(templateList[localeIndex])
                context.extraInfo.templateId = templateList[localeIndex];
              else
                context.extraInfo.templateId = templateList[0];
  
  
              if(bills.length === 1) {
                let bill = bills[0];
                dialog.sendMessage(context, dialog.get_message(messages.billSearchResults.singleRecord, context.user.locale), true);
                await new Promise(resolve => setTimeout(resolve, 1000));

                let params=[];
                params.push(bill.id);
                params.push(bill.payerName);
                params.push("₹ "+bill.dueAmount);
                params.push(bill.dueDate);
  
                let urlComponemt = bill.paymentLink.split('/');
                let bttnUrlComponent = urlComponemt[urlComponemt.length -1];
  
                var templateContent = {
                  output: context.extraInfo.templateId,
                  type: "template",
                  params: params,
                  bttnUrlComponent: bttnUrlComponent
                };
  
                dialog.sendMessage(context, templateContent, true);
              } else {
                let services = bills.map(element => element.service);
                let serviceSet = new Set(services);
                if(services.length === serviceSet.size) {
                  dialog.sendMessage(context, dialog.get_message(messages.billSearchResults.multipleRecords, context.user.locale), true);
                  await new Promise(resolve => setTimeout(resolve, 1000));

                  for(let i = 0; i < bills.length; i++) {
                    let bill = bills[i];
  
                    let params=[];
                    params.push(bill.id);
                    params.push(bill.payerName);
                    params.push("₹ "+bill.dueAmount);
                    params.push(bill.dueDate);
  
                    let urlComponemt = bill.paymentLink.split('/');
                    let bttnUrlComponent = urlComponemt[urlComponemt.length -1];
  
                    var templateContent = {
                      output: context.extraInfo.templateId,
                      type: "template",
                      params: params,
                      bttnUrlComponent: bttnUrlComponent
                    };
  
                    dialog.sendMessage(context, templateContent, true);
                  }
                } else {
                  dialog.sendMessage(context, dialog.get_message(messages.billSearchResults.multipleRecordsSameService, context.user.locale), true);
                  await new Promise(resolve => setTimeout(resolve, 1000));

                  for(let i = 0; i < bills.length; i++) {
                    let bill = bills[i];
  
                    let params=[];
                    params.push(bill.id);
                    params.push(bill.payerName);
                    params.push("₹ "+bill.dueAmount);
                    params.push(bill.dueDate);
  
                    let urlComponemt = bill.paymentLink.split('/');
                    let bttnUrlComponent = urlComponemt[urlComponemt.length -1];
                    context.extraInfo.bttnUrlComponent = bttnUrlComponent;
  
                    var templateContent = {
                      output: context.extraInfo.templateId,
                      type: "template",
                      params: params,
                      bttnUrlComponent: bttnUrlComponent
                    };
  
                    dialog.sendMessage(context, templateContent, true);
                  }
                }
              }
              let endStatement = dialog.get_message(messages.endStatement, context.user.locale);
              await new Promise(resolve => setTimeout(resolve, 1500));
              dialog.sendMessage(context, endStatement);
            })();

          }),
          always: '#haltState'
        }
      }
    },
    haltState:{
      id: 'haltState',
      initial: 'question',
      states: {
        question: {
          onEntry: assign((context, event) => { }),
          on: {
            USER_MESSAGE: 'process'
          }
        },
        process: {
          onEntry: assign((context, event) => {
            let messageText = event.message.input;
            messageText = messageText.toLowerCase();
            let isValid = ((messageText === 'main menu' || messageText === 'pay other bill') && dialog.validateInputType(event, 'button'));
            //let textValid = (messageText === '1' || messageText === '2');
            context.message = {
              isValid: (isValid || textValid),
              messageContent: messageText
            };
          }),
          always: [
            {
              target: 'error',
              cond: (context, event) => {
                return ! context.message.isValid;
              }
            },
            {
              target: '#billServices',
              cond: (context, event) => {
                return (context.message.isValid && context.message.messageContent ==='pay other bill');
              }
            },
            {
              target: '#sevamenu',
              cond: (context, event) => {
                return (context.message.isValid && context.message.messageContent ==='main menu');
              }
            },
            /*{
              target: '#endstate',
              cond: (context, event) => {
                return (context.message.isValid && context.message.messageContent ==='1');
              },
              actions: assign((context, event) => {
                let { services, messageBundle } = billService.getSupportedServicesAndMessageBundle();
                let billServiceName = dialog.get_message(messageBundle[context.service],context.user.locale);
                let message = dialog.get_message(messages.newNumberregistration.confirm, context.user.locale);
                message = message.replace('{{service}}', billServiceName.toLowerCase());
                message = message.replace('{{consumerCode}}', context.slots.bills.paramInput);
                message = message.replace('{{mobileNumber}}', context.user.mobileNumber);
                dialog.sendMessage(context, message);              
              })
            },
            {
              target: '#endstate',
              cond: (context, event) => {
                return (context.message.isValid && context.message.messageContent ==='2');
              },
              actions: assign((context, event) => {
                let message = dialog.get_message(messages.newNumberregistration.decline, context.user.locale);
                dialog.sendMessage(context, message);              
              })
            }*/

          ]
        },
        error: {
          onEntry: assign( (context, event) => {
            let message = dialog.get_message(dialog.global_messages.error.retry, context.user.locale);
            dialog.sendMessage(context, message);
          }),
          always : 'question'
        }
      }
    },
    paramInputInitiate: {
      id: 'paramInputInitiate',
      initial: 'question',
      states: {
        question: {
          onEntry: assign((context, event) => {
            let message = dialog.get_message(messages.paramInputInitiate.question, context.user.locale);
            let { searchOptions, messageBundle } = billService.getSearchOptionsAndMessageBundleForService(context.slots.bills.service);
            message = message.replace('{{searchParamOption}}', dialog.get_message(messageBundle[context.slots.bills.searchParamOption], context.user.locale));
            dialog.sendMessage(context, message);
          }),
          on: {
            USER_MESSAGE: 'process'
          }
        },
        process: {
          onEntry: assign((context, event) => {
            let messageText = event.message.input;
            let parsed = parseInt(event.message.input.trim())
            let isValid = parsed === 1;
            context.message = {
              isValid: isValid,
              messageContent: event.message.input
            };
          }),
          always: [
            {
              target: 'error',
              cond: (context, event) => {
                return ! context.message.isValid;
              }
            },
            {
              target: '#paramInput'
            }
          ]
        },
        error: {
          onEntry: assign( (context, event) => {
            let message = dialog.get_message(dialog.global_messages.error.retry, context.user.locale);
            dialog.sendMessage(context, message, false);
          }),
          always : 'question'
        }
      }
    }
  }
};

let messages = {
  personalBills: {
    singleRecord: {
      en_IN: 'Following are the unpaid bills linked to this mobile number 👇',
      hi_IN: 'निम्नलिखित बिल मिले:',
      billTemplate: {
        en_IN: '👉  *{{service}} Bill*\n\n*Connection No*\n{{id}}\n\n*Owner Name*\n{{payerName}}\n\n*Amount Due*\nRs {{dueAmount}}\n\n*Due Date*\n{{dueDate}}\n\n*Payment Link :*\n{{paymentLink}}',
        hi_IN: '👉  *{{service}} बिल*\n\n*कनेक्शन नंबर*\n{{id}}\n\n*स्वामी का नाम*\n{{payerName}}\n\n*देय राशि*\nरु {{dueAmount}}\n\n*देय तिथि *\n{{dueDate}}\n\n*भुगतान लिंक :*\n{{PaymentLink}}'
      }
    },
    multipleRecords: {
      en_IN: 'Following are the unpaid bills linked to this mobile number 👇',
      hi_IN: 'आपके मोबाइल नंबर के खिलाफ पाए गए बिल: ',
      billTemplate: {
        en_IN: '👉  *{{service}} Bill*\n\n*Connection No*\n{{id}}\n\n*Owner Name*\n{{payerName}}\n\n*Amount Due*\nRs {{dueAmount}}\n\n*Due Date*\n{{dueDate}}\n\n*Payment Link :*\n{{paymentLink}}',
        hi_IN: '👉  *{{service}} बिल*\n\n*कनेक्शन नंबर*\n{{id}}\n\n*स्वामी का नाम*\n{{payerName}}\n\n*देय राशि*\nरु {{dueAmount}}\n\n*देय तिथि *\n{{dueDate}}\n\n*भुगतान लिंक :*\n{{PaymentLink}}'
      }
    },
    multipleRecordsSameService: {
      en_IN: 'Following are the unpaid bills linked to this mobile number 👇',
      hi_IN: 'आपके मोबाइल नंबर के खिलाफ पाए गए बिल: ',
      billTemplate: {
        en_IN: '👉  *{{service}} Bill*\n\n*Connection No*\n{{id}}\n\n*Owner Name*\n{{payerName}}\n\n*Amount Due*\nRs {{dueAmount}}\n\n*Due Date*\n{{dueDate}}\n\n*Payment Link :*\n{{paymentLink}}',
        hi_IN: '👉  *{{service}} बिल*\n\n*कनेक्शन नंबर*\n{{id}}\n\n*स्वामी का नाम*\n{{payerName}}\n\n*देय राशि*\nरु {{dueAmount}}\n\n*देय तिथि *\n{{dueDate}}\n\n*भुगतान लिंक :*\n{{PaymentLink}}'
      }
    }
  },
  noBills: {
    notLinked: {
      en_IN: 'Sorry 😥 !  Your mobile number is not linked to the selected service.\n\nWe can still proceed with the payment using the *{{searchOption}}* mentioned in your {{service}} bill/receipt.',
      hi_IN: 'क्षमा करें, आपका मोबाइल नंबर किसी सेवा से लिंक नहीं है। इसे लिंक करने के लिए अपने शहरी स्थानीय निकाय से संपर्क करें। आप नीचे दी गई जानकारी के अनुसार अपनी खाता जानकारी खोज कर सेवा प्राप्त कर सकते हैं:'
    },
    noPending: {
      en_IN: 'There are no pending bills against your account. You can still search the bills as given below',
      hi_IN: 'आपके खाते के खिलाफ कोई लंबित बिल नहीं हैं। आप अभी भी नीचे दी गई सेवाओं के बिल खोज सकते हैं'
    }
  },
  searchBillInitiate: {
    question: {
      en_IN: '\nWant to pay any other {{billserviceName}} Bill ?\n\n👉 Type and Send *1* to Search & Pay for other bills.\n\n👉 To go back to the main menu, type and send *mseva*.',
      hi_IN: '\nकृपया अन्य बिल या शुल्क के लिए खोज और भुगतान करें जो आपके मोबाइल नंबर से लिंक नहीं हैं, टाइप करें ‘1’ और भेजें। मुख्य मेनू पर वापस जाने के लिए ‘mseva’ टाइप करें और भेजें ।'
    },
    error:{
      en_IN: "Option you have selected seems to be invalid  😐\nKindly click on the above button to proceed further.",
      hi_IN: "क्षमा करें, मुझे समझ में नहीं आया"
    }
  },
  billServices: {
    question: {
      preamble: {
        en_IN: 'Type and send the option number to indicate if you know the *{{searchOption}}* 👇\n\n*1.* Yes\n*2.* No',
        hi_IN: 'कृपया टाइप करें और अपने विकल्प के लिए नंबर भेजें👇\n\n1.हां\n2.नहीं'
      },
      confirmation:{
        en_IN: 'Do you have the *{{searchOption}}* to proceed for payment ?\n',
        hi_IN: 'क्या आपके पास भुगतान के लिए आगे बढ़ने के लिए {{searchOption}} है ?\n'
      }
    },
    error:{
      en_IN: 'Option you have selected seems to be invalid  😐\nKindly select the valid option to proceed further.',
      hi_IN: 'क्षमा करें, मुझे समझ में नहीं आया। कृपया दिए गए विकल्पों के लिए फिर से एक नंबर दर्ज करे।'
    }
  },
  searchParamOptions: {
    question: {
      preamble: {
        en_IN: 'Please type and send the number for your option👇',
        hi_IN: 'कृपया नीचे दिए गए सूची से अपना विकल्प टाइप करें और भेजें:'
      }
    },
    error:{
      en_IN: 'Option you have selected seems to be invalid  😐\nKindly select the valid option to proceed further.',
      hi_IN: 'क्षमा करें, मुझे समझ में नहीं आया। कृपया दिए गए विकल्पों के लिए फिर से एक नंबर दर्ज करे।'
    }
  },
  paramInput: {
    question: {
      en_IN: 'Please enter the *{{option}}*\n\n{{example}}',
      hi_IN: 'बिल देखने के लिए कृपया *{{option}}* डालें\n\n{{example}}'
    },
    re_enter: {
      en_IN: 'The entered {{option}} is not found in our records.\n\nPlease check the entered details and try again.\n\n👉 To go back to the main menu, type and send mseva.',
      hi_IN: 'क्षमा करें, आपके द्वारा प्रदान किया गया मूल्य गलत है। बिलों को प्राप्त करने के लिए \n कृपया फिर से {{option}} दर्ज करें।\n\nमुख्य मेनू पर वापस जाने के लिए ‘mseva’ टाइप करें और भेजें ।'
    }
  },
  billSearchResults: {
    noRecords: {
      en_IN: 'The {{searchParamOption}} : {{paramInput}} is not found in our records.\n\nPlease check the entered details and try again.',
      hi_IN: 'आपके द्वारा प्रदान किए गए विवरण {{searchParamOption}} :   {{paramInput}} हमारे रिकॉर्ड में नहीं पाया जाता है। कृपया आपके द्वारा प्रदान किए गए विवरण को एक बार फिर से देखें।'
    },
    singleRecord: {
      en_IN: 'Following unpaid bills are found 👇',
      hi_IN: 'निम्नलिखित बिल मिले:',
      billTemplate: {
        en_IN: '👉  *{{service}} Bill*\n\n*Connection No*\n{{id}}\n\n*Owner Name*\n{{payerName}}\n\n*Amount Due*\nRs {{dueAmount}}\n\n*Due Date*\n{{dueDate}}\n\n*Payment Link :*\n{{paymentLink}}',
        hi_IN: '👉  *{{service}} बिल*\n\n*कनेक्शन नंबर*\n{{id}}\n\n*स्वामी का नाम*\n{{payerName}}\n\n*देय राशि*\nरु {{dueAmount}}\n\n*देय तिथि *\n{{dueDate}}\n\n*भुगतान लिंक :*\n{{PaymentLink}}'
      }
    },
    multipleRecords: {
      en_IN: 'Following unpaid bills are found 👇',
      hi_IN: 'निम्नलिखित बिल मिले:',
      billTemplate: {
        en_IN: '👉  *{{service}} Bill*\n\n*Connection No*\n{{id}}\n\n*Owner Name*\n{{payerName}}\n\n*Amount Due*\nRs {{dueAmount}}\n\n*Due Date*\n{{dueDate}}\n\n*Payment Link :*\n{{paymentLink}}',
        hi_IN: '👉  *{{service}} बिल*\n\n*कनेक्शन नंबर*\n{{id}}\n\n*स्वामी का नाम*\n{{payerName}}\n\n*देय राशि*\nरु {{dueAmount}}\n\n*देय तिथि *\n{{dueDate}}\n\n*भुगतान लिंक :*\n{{PaymentLink}}'
      }
    },
    multipleRecordsSameService: {
      en_IN: 'Following unpaid bills are found 👇',
      hi_IN: 'निम्नलिखित बिल मिले:',
      billTemplate: {
        en_IN: '👉  *{{service}} Bill*\n\n*Connection No*\n{{id}}\n\n*Owner Name*\n{{payerName}}\n\n*Amount Due*\nRs {{dueAmount}}\n\n*Due Date*\n{{dueDate}}\n\n*Payment Link :*\n{{paymentLink}}',
        hi_IN: '👉  *{{service}} बिल*\n\n*कनेक्शन नंबर*\n{{id}}\n\n*स्वामी का नाम*\n{{payerName}}\n\n*देय राशि*\nरु {{dueAmount}}\n\n*देय तिथि *\n{{dueDate}}\n\n*भुगतान लिंक :*\n{{PaymentLink}}'
      }
    }
  },
  paramInputInitiate: {
    question: {
      en_IN: 'Please type and send ‘1’ to Enter {{searchParamOption}} again. \nOr \'mseva\' to Go ⬅️ Back to the main menu.',
      hi_IN: 'कृपया {{searchParamOption}} फिर से टाइप करने के लिए ’1’ टाइप करें और भेजें।\n\nमुख्य मेनू पर वापस जाने के लिए ‘mseva’ टाइप करें और भेजें ।'
    },
    error:{
      en_IN: "Option you have selected seems to be invalid  😐\nKindly select the valid option to proceed further.",
      hi_IN: "क्षमा करें, मुझे समझ में नहीं आया"
    }
  },
  openSearch: {
    en_IN: "Click on the link below to search and pay your {{billserviceName}} bill -\n{{link}}\n\nThe image below shows you how to search and pay {{billserviceName}} bill using this link. 👇.",
    hi_IN: "आप नीचे दिए गए लिंक पर क्लिक करके {{billserviceName}} खोज और भुगतान कर सकते हैं👇\n\n{{link}}\n\nइस लिंक से {{billserviceName}} खोजने और भुगतान करने के चरणों को समझने के लिए कृपया नीचे दी गई छवि देखें।"
  },
  newNumberregistration:{
    confirm:{
      en_IN: 'Thank you for the response 🙏\n\n You will now receive {{service}} bill alerts for *{{consumerCode}}* on *{{mobileNumber}}*.',
      hi_IN: 'प्रतिक्रिया के लिए धन्यवाद 🙏\n\nअब आप *{{mobileNumber}}* पर *{{consumerCode}}* के लिए {{service}} बिल अलर्ट प्राप्त करेंगे।'
    },
    decline:{
      en_IN: 'Thank you for the response 🙏\n\n👉 To go back to the main menu, type and send *mseva*',
      hi_IN: 'प्रतिक्रिया के लिए धन्यवाद 🙏\n\n👉 मुख्य मेनू पर वापस जाने के लिए, टाइप करें और भेजें *mseva*'
    }
  },
  endStatement: {
    en_IN: "👉 To go back to the main menu, type and send *mseva*",
    hi_IN: "👉 मुख्य मेनू पर वापस जाने के लिए, टाइप करें और भेजें *mseva*"
  }
}
let grammer = {
  confirmation: {
    choice: [
      {intention: 'Yes', recognize: ['1']},
      {intention: 'No', recognize: ['2']}
    ]
  }
}


module.exports = bills;