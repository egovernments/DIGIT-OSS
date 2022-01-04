const messages = {
  complaintMenu: {
    prompt: {
      en_IN: {
        message: 'What is your complaint about?', step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'Not Receiving OTP' }, { key: '2', value: 'Unable to Proceed Forward' }, { key: '3', value: 'Bill Amount is incorrect' }, { key: '4', value: 'Application Process taking long time' }, { key: '5', value: 'Application is getting rejected' }, { key: '6', value: 'Others' }],
      },
      hi_IN: {
        message: 'What is your complaint about?', step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'ओटीपी प्राप्त नहीं हो रहा है' }, { key: '2', value: 'आगे बढ़ने में असमर्थ' }, { key: '3', value: 'बिल राशि गलत है' }, { key: '4', value: 'आवेदन प्रक्रिया में लंबा समय लग रहा है' }, { key: '5', value: 'आवेदन खारिज हो रहा है' }, { key: '6', value: 'अन्य' }],
      },
    },
    options: {
      list: ['nootp', 'unabletoproceed', 'billincorrect', 'apptakinglong', 'apprejected', 'others'],
      messageBundle: {
        nootp: {
          en_IN: 'Not Receiving OTP',
          hi_IN: 'कोविड में अपना ख्याल कैसे रखें?',
        },
        unabletoproceed: {
          en_IN: 'Unable to Proceed Forward',
          hi_IN: 'फतेह किट का इस्तेमाल कैसे करें',
        },
        billincorrect: {
          en_IN: 'Bill Amount is incorrect',
          hi_IN: 'कोविड बेड की उपलब्धता के बारे में जानकारी',
        },
        apptakinglong: {
          en_IN: 'Application Process taking long time',
          hi_IN: 'टीकाकरण केंद्रों की जानकारी',
        },
        apprejected: {
          en_IN: 'Application is getting rejected?',
          hi_IN: 'टीकाकरण के लिए मुझे कहां पंजीकरण कराना चाहिए?',
        },
        others: {
          en_IN: 'Others',
          hi_IN: 'काले फंगस के बारे में विस्तृत जानकारी और क्या करें और क्या न करें',
        },
      },
    },

  },

  complaintCategoryItems: {

    nootp: {
      nextStep: ['complaintComments'],
      messageBundle: {
        en_IN: {
          message: 'Please enter your mobile number', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: '' }],
        },
        hi_IN: {
          message: 'अपना मोबाइल नंबर दर्ज करें', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: '' }],
        },

      },
    },
    unabletoproceed: {
      nextStep: ['appstuck', 'apperor', 'optionNotFound'],
      messageBundle: {
        en_IN: { step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'Application is stuck and not moving forward' }, { key: '2', value: 'Application is showing unexpected error' }, { key: '3', value: 'Necessary Option not found' }] },
        hi_IN: { step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'Application is stuck and not moving forward' }, { key: '2', value: 'Application is showing unexpected error' }, { key: '3', value: 'Necessary Option not found' }] },
      },
    },
    appstuck: {
      nextStep: ['complaintComments'],
      messageBundle: {
        en_IN: {
          message: 'Please enter your mobile number', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: '' }],
        },
        hi_IN: {
          message: 'अपना मोबाइल नंबर दर्ज करें', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: '' }],
        },
      },
    },
    apperor: {
      nextStep: ['complaintComments'],
      messageBundle: {
        en_IN: {
          message: 'Please enter your mobile number', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: '' }],
        },
        hi_IN: {
          message: 'अपना मोबाइल नंबर दर्ज करें', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: '' }],
        },
      },
    },
    optionNotFound: {
      nextStep: ['complaintComments'],
      messageBundle: {
        en_IN: {
          message: 'Please enter your mobile number', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: '' }],
        },
        hi_IN: {
          message: 'अपना मोबाइल नंबर दर्ज करें', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: '' }],
        },
      },
    },
    apptakinglong: {
      nextStep: ['propreg', 'mutation'],
      messageBundle: {
        en_IN: {
          message: 'Please tell us which which application is taking time?', step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'Property Registration' }, { key: '2', value: 'Mutation' }],
        },
        hi_IN: {
          message: 'Please tell us which which application is taking time?', step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'Property Registration' }, { key: '2', value: 'Mutation' }],
        },
      },
    },
    propreg: {
      nextStep: ['complaintComments'],
      messageBundle: {
        en_IN: {
          message: 'Please enter the Application ID', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: '' }],
        },
        hi_IN: {
          message: 'Please enter the Application ID', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: '' }],
        },
      },
    },
    mutation: {
      nextStep: ['complaintComments'],
      messageBundle: {
        en_IN: {
          message: 'Please enter the Application ID', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: '' }],
        },
        hi_IN: {
          message: 'Please enter the Application ID', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: '' }],
        },
      },
    },
    appidSearch: {
      nextStep: ['complaintComments'],
      messageBundle: {
        en_IN: {
          message: 'Please enter the Application ID', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: '' }],
        },
        hi_IN: {
          message: 'Please enter the Application ID', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: '' }],
        },
      },
    },
    others: {
      nextStep: ['persistComplaint'],
      messageBundle: {
        en_IN: {
          message: 'Let us know about your complaint', step: 'last', optionType: 'textarea', option: [{ key: '1', value: '' }],
        },
        hi_IN: {
          message: 'हमें अपनी शिकायत के बारे में बताएं।', step: 'last', optionType: 'textarea', option: [{ key: '1', value: '' }],
        },
      },

    },
    complaintComments: {
      nextStep: ['persistComplaint'],
      messageBundle: {
        en_IN: {
          message: 'Let us know about your complaint', step: 'last', optionType: 'textarea', option: [{ key: '1', value: '' }],
        },
        hi_IN: {
          message: 'हमें अपनी शिकायत के बारे में बताएं।', step: 'last', optionType: 'textarea', option: [{ key: '1', value: '' }],
        },
      },

    },
    billincorrect: {
      nextStep: ['selectproperty'],
      messageBundle: {
        en_IN: {
          message: 'Please enter your mobile number', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: '' }],
        },
        hi_IN: {
          message: 'अपना मोबाइल नंबर दर्ज करें', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: '' }],
        },
      },
    },
    selectproperty: {
      nextStep: ['lastbillgenerated'],
      messageBundle: {
        en_IN: {
          message: 'Please select your property from the below list which you want to report', step: 'intermediate', optionType: 'button', option: [],
        },
        hi_IN: {
          message: 'कृपया नीचे दी गई सूची में से अपनी संपत्ति का चयन करें जिसकी आप रिपोर्ट करना चाहते हैंxdder', step: 'intermediate', optionType: 'button', option: [],
        },
      },
    },
    lastbillgenerated: {
      nextStep: ['complaintComments'],
      messageBundle: {
        en_IN: {
          message: 'Last Bill Generated <Bill ID> is Rs. <Amount>. Do you want to report this as incorrect?', step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'Yes' }, { key: '2', value: 'No' }],
        },
        hi_IN: {
          message: 'अंतिम उत्पन्न बिल <बिल आईडी> <राशि> रुपये है। क्या आप इसे गलत के रूप में रिपोर्ट करना चाहते हैं?', step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'हां' }, { key: '2', value: 'नहीं' }],
        },
      },
    },
    apprejected: {
      nextStep: ['propcreation', 'mutation'],
      messageBundle: {
        en_IN: {
          message: 'Which Application is getting rejected?', step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'Property creation' }, { key: '2', value: 'Mutation' }],
        },
        hi_IN: {
          message: 'कौन सा आवेदन खारिज हो रहा है?', step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'संपत्ति निर्माण' }, { key: '2', value: 'उत्परिवर्तन' }],
        },
      },
    },
    propcreation: {
      nextStep: ['rejectionreason'],
      messageBundle: {
        en_IN: {
          message: 'Please enter the Application ID', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: '' }],
        },
        hi_IN: {
          message: 'कृपया आवेदन आईडी दर्ज करें', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: '' }],
        },
      },
      rejectionreason: {
        nextStep: ['complaintComments'],
        messageBundle: {
          en_IN: {
            message: 'Show reason for "rejection". \n Do you want to raise complaint on this?', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: 'Yes' }, { key: '2', value: 'No' }],
          },
          hi_IN: {
            message: '"अस्वीकृति" का कारण दिखाएं। \n क्या आप इस पर शिकायत करना चाहते हैं?', step: 'intermediate', optionType: 'textbox', option: [{ key: '1', value: 'हां' }, { key: '2', value: 'नहीं' }],
          },
        },
      },
    },
  },
  persistComplaint: {
    en_IN: 'Complaint created successfully \n Complaint ID: {{complaintNumber}} \n Your Complaint has been registered and one of our representatives will get in touch with you regarding the issue\n',
    hi_IN: 'धन्यवाद! आपने सफलतापूर्वक शिकायत दर्ज की है।\nआपकी शिकायत संख्या: {{complaintNumber}}\n',
  },
  closingStatement: {
    en_IN: '\nIn case of any help please type and send "mseva"',
    hi_IN: '\nजब भी आपको मेरी सहायता की आवश्यकता हो तो कृपया "mseva" लिखें और भेजें',
  },

};

module.exports = messages;
