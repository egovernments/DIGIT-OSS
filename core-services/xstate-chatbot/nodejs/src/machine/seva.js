const { Machine, assign } = require('xstate');
const pgr = require('./pgr');
const bills = require('./bills');
const receipts = require('./receipts');
const userProfileService = require('./service/egov-user-profile');
const dialog = require('./util/dialog.js');

const sevaMachine = Machine({
  id: 'mseva',
  initial: 'start',
  on: {
    USER_RESET: {
      target: '#welcome',
      // actions: assign( (context, event) => dialog.sendMessage(context, dialog.get_message(messages.reset, context.user.locale), false))
    }
  },
  states: {
    start: {
      on: {
        USER_MESSAGE: [
          {
            cond: (context) => context.user.locale,
            target: '#welcome'
          },
          {
            target: '#onboarding'
          }
        ]
      }
    },
    onboarding: {
      id: 'onboarding',
      initial: 'onboardingWelcome',
      states:{
        onboardingWelcome: {
          id: 'onboardingWelcome',
          onEntry: assign((context, event) => {
            context.onboarding = {};
            let message = messages.onboarding.onboardingWelcome;
            dialog.sendMessage(context, message, false);
          }),
          always: '#onboardingLocale'
        },
        onboardingLocale: {
          id: 'onboardingLocale',
          initial: 'question',
          states: {
            question: {
              onEntry: assign((context, event) => {
                let message = messages.onboarding.onboardingLocale.question;
                context.grammer = grammer.locale.question;
                dialog.sendMessage(context, message, true);
              }),
              on: {
                USER_MESSAGE: 'process'
              }
            },
            process: {
              onEntry: assign((context, event) => {
                if(dialog.validateInputType(event, 'text'))
                  context.intention = dialog.get_intention(context.grammer, event, true);
                else 
                  context.intention = dialog.INTENTION_UNKOWN;
                if(context.intention != dialog.INTENTION_UNKOWN) {
                  context.user.locale = context.intention;
                } else {
                  context.user.locale = 'en_IN';
                }
                context.onboarding.locale = context.user.locale;
              }),
              always: '#onboardingName'
            }
          }
        },
        onboardingName: {
          id: 'onboardingName',
          initial: 'preCondition',
          states: {
            preCondition: {
              always: [
                {
                  target: '#onboardingUpdateUserProfile',
                  cond: (context) => context.user.name 
                },
                {
                  target: 'question'
                }
              ]
            },
            question: {
              onEntry: assign((context, event) => {
                let message = dialog.get_message(messages.onboarding.onboardingName.question, context.user.locale);
                dialog.sendMessage(context, message);
              }),
              on: {
                USER_MESSAGE: 'process'
              }
            },
            process: {
              onEntry: assign((context, event) => {
                if(!dialog.validateInputType(event, 'text'))
                  return;
                let name = dialog.get_input(event, false);
                if(name.toLowerCase() != 'no') {
                  context.onboarding.name = name;
                }
              }),
              always: [
                {
                  cond: (context) => context.onboarding.name,
                  target: '#onboardingNameConfirmation'
                },
                {
                  target: '#onboardingUpdateUserProfile'
                }
              ]
            }
          }
        },
        onboardingNameConfirmation: {
          id: 'onboardingNameConfirmation',
          initial: 'question',
          states: {
            question: {
              onEntry: assign((context, event) => {
                let message = dialog.get_message(messages.onboarding.onboardingNameConfirmation, context.user.locale);
                message = message.replace('{{name}}', context.onboarding.name);
                dialog.sendMessage(context, message);
              }),
              on: {
                USER_MESSAGE: 'process'
              }
            },
            process: {
              onEntry: assign((context, event) => {
                if(!dialog.validateInputType(event, 'text')) {
                  context.intention = 'error';
                  return;
                }
                let input = dialog.get_input(event);
                if(input == 'no')
                  context.intention = 'disagree';
                if(input == 'yes')
                  context.intention = 'agree';
              }),
              always: [
                {
                  cond: (context) => context.intention == 'agree',
                  target: '#onboardingUpdateUserProfile'
                },
                {
                  cond: (context) => context.intention == 'disagree',
                  target: '#onboardingName'
                },
                {
                  target: 'error'
                }
              ]
            },
            error: {
              onEntry: assign((context, event) => {
                let message = dialog.get_message(dialog.global_messages.error.retry, context.user.locale);
                dialog.sendMessage(context, message, false);
              }),
              always: 'question'
            }
          }
        },
        onboardingUpdateUserProfile: {
          id: 'onboardingUpdateUserProfile',
          invoke: {
            id: 'updateUserProfile',
            src: (context, event) => userProfileService.updateUser(context.user, context.onboarding, context.extraInfo.tenantId),
            onDone: [
              {
                target: '#onboardingThankYou',
                actions: assign((context, event) => {
                  context.user.name = context.onboarding.name;
                  context.user.locale = context.onboarding.locale;
                  context.onboarding = undefined;
                }),
                cond: (context) => context.onboarding.name
              },
              {
                target: '#welcome'
              }
            ],
            onError: {
              target: '#welcome'
            }
          }
        },
        onboardingThankYou: {
          id: 'onboardingThankYou',
          onEntry: assign((context, event) => {
            let message = dialog.get_message(messages.onboarding.onboardingThankYou, context.user.locale);
            message = message.replace('{{name}}', context.user.name);
            dialog.sendMessage(context, message, false);
          }),
          always: '#welcome'
        },
      }
    },
    welcome: {
      id: 'welcome',
      onEntry: assign((context, event) => {
        var message = dialog.get_message(messages.welcome, context.user.locale);
        if(context.user.name)
          message = message.replace('{{name}}', context.user.name);
        else 
          message = message.replace(' {{name}}', '');
        dialog.sendMessage(context, message, false);
      }),
      always: '#sevamenu'
    },
    updateLocale: {
      id: 'updateLocale',
      onEntry: assign((context, event) => {
        var message = dialog.get_message(messages.updateLocaleMessage, context.user.locale);
        if(context.user.name)
          message = message.replace('{{name}}', context.user.name);
        else 
          message = message.replace(' {{name}}', '');
        dialog.sendMessage(context, message, false);
      }),
      always: '#sevamenu'
    },
    locale: {
      id: 'locale',
      initial: 'question',
      states: {
        question: {
          onEntry: assign((context, event) => {
            dialog.sendMessage(context, dialog.get_message(messages.locale.question, context.user.locale));
          }),
          on: {
            USER_MESSAGE: 'process'
          }
        },
        process: {
          invoke: {
            id: 'updateUserLocale',
            src: (context, event) => {
              if(dialog.validateInputType(event, 'text')) {
                context.intention = dialog.get_intention(grammer.locale.question, event, true);
              } else {
                context.intention = dialog.INTENTION_UNKOWN;
              }
              if (context.intention === dialog.INTENTION_UNKOWN) {
                context.user.locale = 'en_IN';
                dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.proceeding, context.user.locale));
              } else {
                context.user.locale = context.intention;
              }
              return userProfileService.updateUser(context.user, context.extraInfo.tenantId);
            },
            onDone: [
              {
                target: '#updateLocale',
                cond: (context) => context.intention != dialog.INTENTION_UNKOWN
              },
              {
                target: '#sevamenu',
                cond: (context) => context.intention === dialog.INTENTION_UNKOWN
              }
            ],
            onError: {
              target: '#welcome'
            }
          }
        }
      }
    },
    sevamenu : { 
      id: 'sevamenu',
      initial: 'question',
      states: {
        question: {
          onEntry: assign( (context, event) => {
            dialog.sendMessage(context, dialog.get_message(messages.sevamenu.question, context.user.locale), true);
          }),
          on: {
            USER_MESSAGE: 'process'
          }
        },
        process: {
          onEntry: assign((context, event) => {
            if(dialog.validateInputType(event, 'text'))
              context.intention = dialog.get_intention(grammer.menu.question, event, true);
            else
              context.intention = dialog.INTENTION_UNKOWN;
          }),
          always: [
            {
              target: '#pgr',
              cond: (context) => context.intention == 'pgr'
            },
            {
              target: '#bills', 
              cond: (context) => context.intention == 'bills'
            },
            {
              target: '#receipts', 
              cond: (context) => context.intention == 'receipts'
            },
            {
              target: '#locale', 
              cond: (context) => context.intention == 'locale'
            },
            {
              target: 'error'
            }
          ]
        }, // sevamenu.process
        error: {
          onEntry: assign( (context, event) => {
            dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), false);
          }),
          always : 'question'
        }, // sevamenu.error 
        pgr: pgr,
        bills: bills,
        receipts: receipts
      } // sevamenu.states
    }, // sevamenu
    endstate: {
      id: 'endstate',
      always: 'start',
      // type: 'final', //Another approach: Make it a final state so session manager kills this machine and creates a new one when user types again
      // onEntry: assign((context, event) => {
      //   dialog.sendMessage(context, dialog.get_message(messages.endstate, context.user.locale));
      // })
    },
    system_error: {
      id: 'system_error',
      always: {
        target: '#welcome',
        actions: assign((context, event) => {
          let message = dialog.get_message(dialog.global_messages.system_error, context.user.locale);
          dialog.sendMessage(context, message, false);
          context.chatInterface.system_error(event.data);
        })
      }
    }
  }, // states
}); // Machine

let messages = {
  reset: {
    en_IN: 'Ok. Let\'s start over.',
    hi_IN: 'ठीक। फिर से शुरू करते हैं।'
  },
  onboarding: {
    onboardingWelcome: 'Welcome to mSeva Punjab. Now you can file a complaint and track it’s status, you can also Pay your bills through WhatsApp. \n\nmSeva पंजाब में आपका स्वागत🙏🏻 है। अब आप WhatsApp द्वारा कई सुविधाओं का लाभ ले सकते है जैसे शिकायत दर्ज करना, बिल का भुगतान करना।',
    onboardingLocale: {
      question: 'Please Select the Language of your choice from the list given below:\n\nनीचे दिए गए पर्याय में से आपकी पसंदीदा भाषा का चयन करें।\n\n1. English\n2. हिंदी'
    },
    onboardingName: {
      question: {
        en_IN: 'Before moving further, please share your name to make your experience more personalized.\nElse if you don\'t want to share your name, type and send "No".',
        hi_IN: 'आगे बढ़ने से पहले, अपने अनुभव को और व्यक्तिगत बनाने के लिए कृपया अपना नाम साझा करें।\nयदि आप अपना नाम साझा नहीं करना चाहते हैं, तो टाइप करें और "No" भेजें।'
      }      
    },
    onboardingNameConfirmation: {
      en_IN: "Please confirm your name {{name}} by typing “Yes” or send “No” to change your name.",
      hi_IN: "कृपया अपने नाम {{name}} की पुष्टि करने के लिए “Yes” टाइप करें। यदि आप अपना नाम बदलना चाहते हैं, तो “No” टाइप कीजिए।"
    },
    onboardingThankYou: {
      en_IN: 'Thank you so much {{name}} for the details, we are happy to serve you.',
      hi_IN: 'विवरण के लिए आपका बहुत-बहुत धन्यवाद {{name}}, हम आपकी सेवा करके प्रसन्न हैं।'
    }  
  },
  locale : {
    question: {
      en_IN: "Please choose your preferred language\n1. English\n2. हिंदी",
      hi_IN: "कृपया अपनी पसंदीदा भाषा चुनें\n1. English\n2. हिंदी"
    }
  },
  welcome: {
    en_IN: 'Hi {{name}}, \nWelcome to mSeva Punjab 🙏. Now, using WhatsApp, you can:\n  - File a Complaint and Track its Status\n  - Pay your Bills.',
    hi_IN: 'नमस्ते {{name}}\nmSeva पंजाब में आपका स्वागत है 🙏। अब आप WhatsApp द्वारा कई सुविधाओं का लाभ ले सकते है जैसे: \n  - आप शिकायत दर्ज कर सकते है \n  - बिल का भुगतान कर सकते है।'
  },
  sevamenu: {
    question: {
      en_IN : 'Please type and send the number of your option from the list given 👇 below:\n\n1. File or Track Complaints.\n2. Pay Bills and Fees.\n3. View Payments Receipts.\n4. Change Language.',
      hi_IN: 'कृपया नीचे 👇 दिए गए सूची से अपना विकल्प टाइप करें और भेजें:\n\n1. शिकायतों के लिए\n2. बिलों के लिए\n3. रसीदों के लिए\n4. भाषा बदलने के लिए'
    }
  },
  endstate: {
    en_IN: 'Goodbye. Say hi to start another conversation',
    hi_IN: 'अलविदा। एक और बातचीत शुरू करने के लिए नमस्ते कहें'
  },
  updateLocaleMessage:{
    en_IN: 'Thank you {{name}} for updating the Language of your choice.\n',
    hi_IN: 'अपनी पसंद की भाषा को अपडेट करने के लिए धन्यवाद {{name}} ।\n'
  }
}

let grammer = {
  locale: {
    question: [
      {intention: 'en_IN', recognize: ['1', 'english']},
      {intention: 'hi_IN', recognize: ['2', 'hindi']}
    ]
  },
  menu: {
    question: [
      {intention: 'pgr', recognize: ['1','complaint']}, 
      {intention: 'bills', recognize: ['2', 'bill']},
      {intention: 'receipts', recognize: ['3','receipt']},
      {intention: 'locale', recognize: ['4','language', 'english', 'hindi']}
    ]
  }
}

module.exports = sevaMachine;
