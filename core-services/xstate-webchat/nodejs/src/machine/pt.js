const { Machine, assign } = require('xstate');
const citizenComplaint = require('./citizen-complaint');
const dialog = require('./util/dialog.js');

const ptMachine = Machine({
  id: 'ptservices',
  initial: 'start',
  on: {
    USER_RESET: {
      target: '#welcome'      
    }
  },
  states: {

    start: {
        on: {
          USER_MESSAGE: [
            {
              cond: (context) => context.user.locale,
              target: '#welcome'
            }
          ]
        }
      },
      welcome: {
        id: 'welcome',
        initial: 'preCondition',
        states: {
          preCondition: {
                always: [
                  {
                    target: '#ptmenu',
                    cond: (context) => context.user.locale 
                  }
                ]
          }
        }      
      },

    ptmenu : { 
      id: 'ptmenu',
      initial: 'question',
      states: {
        question: {
          onEntry: assign( (context, event) => {
            (async() => {  
            await new Promise(resolve => setTimeout(resolve, 1000));
            dialog.sendMessage(context, dialog.get_message(messages.sevamenu.question, context.user.locale), true);
          })();
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
              target: '#citizenComplaint',
              cond: (context) => context.intention == 'raise_a_complaint'
            },
            {
              target: 'error'
            }
          ]
        }, 
        error: {
          onEntry: assign( (context, event) => {
            dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), true);
          }),
          always : 'question'
        }, 
        citizenComplaint: citizenComplaint
      } 
    }, 
    endstate: {
      id: 'endstate',
      always: 'start'
    },
    system_error: {
      id: 'system_error',
      always: {
        target: '#welcome',
        actions: assign((context, event) => {
          let message = dialog.get_message(dialog.global_messages.system_error, context.user.locale);
          dialog.sendMessage(context, message, true);
          context.chatInterface.system_error(event.data);
        })
      }
    }
  }, // states
}); // Machine

let messages = {
    sevamenu: {
        question: {
            en_IN: { message: 'Please select what you need help with?', step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'Raise a complaint' }, { key: '2', value: 'Provide Feedback'  }, { key: '3', value: 'Rate the service'  }] },
            hi_IN: { message: 'कृपया चुनें कि आपको किसमें सहायता चाहिए?।', step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'शिकायत दर्ज करें।'  }, { key: '2', value: 'अपनी राय बताएं।'  }, { key: '3', value: 'सेवा को रेट करें।'  }] }
        },
        complainttype: {
            en_IN: { step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'Not Receiving OTP'  }, { key: '2', value: 'Unable to Proceed Forward'  }, { key: '3', value: 'Bill Amount is incorrect'  }, { key: '4', value: 'Application Process taking long time'  }, { key: '5', value: 'Application is getting rejected'  }, { key: '6', value: 'Others'  }] },
            hi_IN: { step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'ओटीपी प्राप्त नहीं हो रहा है'  }, { key: '2', value: 'आगे बढ़ने में असमर्थ'  }, { key: '3', value: 'बिल राशि गलत है'  }, { key: '4', value: 'आवेदन प्रक्रिया में लंबा समय लग रहा है'  }, { key: '5', value: 'आवेदन खारिज हो रहा है'  }, { key: '6', value: 'अन्य'  }] }
        },
        feedbackrating: {
            en_IN: { step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'Star Rating 1'  }, { key: '2', value: 'Star Rating 2'  }, { key: '3', value: 'Star Rating 3'  }, { key: '4', value: 'Star Rating 4'  }, { key: '5', value: 'Star Rating 5'  }] },
            hi_IN: { step: 'intermediate', optionType: 'button', option: [{ key: '1', value: '१ स्टार रेटिंग'  }, { key: '2', value: '२ स्टार रेटिंग'  }, { key: '3', value: '३ स्टार रेटिंग'  }, { key: '4', value: '४ स्टार रेटिंग'  }, { key: '5', value: '५ स्टार रेटिंग'  }] }
        },
        complainttype1: {
            en_IN: { message: 'Please enter your phone number', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: ''  }] },
            hi_IN: { message: 'कृपया अपना फोन नंबर दर्ज करें।', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: ''  }] }
        },
        complainttype1_1: {
            en_IN: { message: 'Let us know about your complaint', step: 'last', optionType: 'textarea', option: [{ key: '1', value: ''  }] },
            hi_IN: { message: 'हमें अपनी शिकायत के बारे में बताएं।', step: 'last', optionType: 'textarea', option: [{ key: '1', value: ''  }] }
        },
        complainttype2: {
            en_IN: { step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'Application is stuck and not moving forward'  }, { key: '2', value: 'Application is showing unexpected error'  }, { key: '3', value: 'Necessary Option not found'  }] },
            hi_IN: { step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'आवेदन अटका हुआ है और आगे नहीं बढ़ रहा है'  }, { key: '2', value: 'आवेदन अनपेक्षित त्रुटि दिखा रहा है'  }, { key: '3', value: 'आवश्यक विकल्प नहीं मिला'  }] }
        },
        complainttype2_1: {
            en_IN: { message: 'Please enter your phone number', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: ''  }] },
            hi_IN: { message: 'कृपया अपना फोन नंबर दर्ज करें।', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: ''  }] }
        },
        complainttype2_1_1: {
            en_IN: { message: 'Let us know about your complaint', step: 'last', optionType: 'textarea', option: [{ key: '1', value: ''  }] },
            hi_IN: { message: 'हमें अपनी शिकायत के बारे में बताएं।', step: 'last', optionType: 'textarea', option: [{ key: '1', value: ''  }] }
        },
        complainttype3: {
            en_IN: { message: 'Please enter your mobile number', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: ''  }] },
            hi_IN: { message: 'अपना मोबाइल नंबर दर्ज करें', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: ''  }] }
        },
        complainttype3_1: {
            en_IN: { message: 'Please select  your property from the below list which you want to report', step: 'intermediate', optionType: 'button', option: [{ key: '1', value: ''  }] },
            hi_IN: { message: 'कृपया नीचे दी गई सूची में से अपनी संपत्ति का चयन करें जिसकी आप रिपोर्ट करना चाहते हैं', step: 'intermediate', optionType: 'button', option: [{ key: '1', value: ''  }] }
        },
        complainttype3_1_1: {
            en_IN: { message: 'Last Bill Generated <Bill_ID> is Rs. <Amount>. Do you want to report this as incorrect?', step: 'intermediate', optionType: 'radio', option: [{ key: '1', value: 'Yes' }, { key: '2', value: 'No' }] },
            hi_IN: { message: 'अंतिम सृजित बिल <Bill_ID> रुपये है। <राशि>. क्या आप इसे गलत के रूप में रिपोर्ट करना चाहते हैं?', step: 'intermediate', optionType: 'radio', option: [{ key: '1', value: 'हां' }, { key: '2', value: 'नहीं' }] }
        },
        complainttype3_1_1_1: {
            en_IN: { message: 'Let us know about your complaint', step: 'last', optionType: 'textarea', option: [{ key: '1', value: ''  }] },
            hi_IN: { message: 'हमें अपनी शिकायत के बारे में बताएं।', step: 'last', optionType: 'textarea', option: [{ key: '1', value: ''  }] }
        },
        complainttype4: {
            en_IN: { message: 'Please tell us which application is taking time?', step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'Property Registration'  }, { key: '2', value: 'Mutation'  }] },
            hi_IN: { message: 'कृपया हमें बताएं कि किस आवेदन में समय लग रहा है?', step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'संपत्ति पंजीकरण'  }, { key: '2', value: 'उत्परिवर्तन'  }] }
        },
        complainttype4_1: {
            en_IN: { message: 'Please enter the Application ID', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: ''  }] },
            hi_IN: { message: 'कृपया आवेदन आईडी दर्ज करें।', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: ''  }] }
        },
        complainttype4_1_1: {
            en_IN: { message: 'Show timeline/status of application. Do you want to raise complaint on this?', step: 'intermediate', optionType: 'radio', option: [{ key: '1', value: 'Yes' }, { key: '2', value: 'No' }] },
            hi_IN: { message: 'आवेदन की समयावधि/स्थिति दिखाएं। क्या आप इस पर शिकायत करना चाहते हैं?', step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'हां' }, { key: '2', value: 'नहीं' }] }
        },
        complainttype4_1_1_1: {
            en_IN: { message: 'Let us know about your complaint', step: 'last', optionType: 'textarea', option: [{ key: '1', value: ''  }] },
            hi_IN: { message: 'हमें अपनी शिकायत के बारे में बताएं।', step: 'intermediate', optionType: 'textarea', option: [{ key: '1', value: ''  }] }
        },
        complainttype5: {
            en_IN: { message: 'Which Application is getting rejected?', step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'Property creation'  }, { key: '2', value: 'Mutation'  }] },
            hi_IN: { message: 'कौन सा आवेदन खारिज हो रहा है?', step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'संपत्ति निर्माण'  }, { key: '2', value: 'उत्परिवर्तन'  }] }
        },
        complainttype5_1: {
            en_IN: { message: 'Please enter the Application ID', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: ''  }] },
            hi_IN: { message: 'कृपया आवेदन आईडी दर्ज करें।', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: ''  }] }
        },
        complainttype5_1_1: {
            en_IN: { message: 'Show reason for "rejection". Do you want to raise complaint on this?', step: 'intermediate', optionType: 'radio', option: [{ key: '1', value: 'Yes' }, { key: '2', value: 'No' }] },
            hi_IN: { message: '"अस्वीकृति" का कारण दिखाएं। क्या आप इस पर शिकायत करना चाहते हैं?', step: 'intermediate', optionType: 'radio', option: [{ key: '1', value: 'हां' }, { key: '2', value: 'नहीं' }] }
        },
        complainttype5_1_1_1: {
            en_IN: { message: 'Let us know about your complaint', step: 'last', optionType: 'textarea', option: [{ key: '1', value: ''  }] },
            hi_IN: { message: 'हमें अपनी शिकायत के बारे में बताएं।', step: 'last', optionType: 'textarea', option: [{ key: '1', value: ''  }] }
        },
        complainttype6: {
            en_IN: { message: 'Let us know about your complaint', step: 'intermediate', optionType: 'textarea', option: [{ key: '1', value: ''  }] },
            hi_IN: { message: 'हमें अपनी शिकायत के बारे में बताएं', step: 'intermediate', optionType: 'textarea', option: [{ key: '1', value: ''  }] }
        },
    }
}

let grammer = {
    menu: {
        question: [
            { intention: 'raise_a_complaint', recognize: ['1', 'file', 'new'] },
            { intention: 'provide_feedback', recognize: ['2', 'file', 'new'] }
        ]
    }
}

module.exports = ptMachine;