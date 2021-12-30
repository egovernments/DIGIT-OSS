const messages = {
  complaintMenu: {
    prompt: {
      preamble: {
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
  },
  persistComplaint: {
    en_IN: 'Your complaint is registered successfully with mSeva.\n\nThe Complaint No is : *{{complaintNumber}}*\n\nClick on the link below to view and track your complaint:\n{{complaintLink}}\n',
    hi_IN: 'धन्यवाद! आपने mSeva Punjab के माध्यम से सफलतापूर्वक शिकायत दर्ज की है।\nआपकी शिकायत संख्या: {{complaintNumber}}\n आप नीचे दिए गए लिंक के माध्यम से अपनी शिकायत देख और ट्रैक कर सकते हैं:\n {{complaintLink}}\n',
  },
  closingStatement: {
    en_IN: '\nIn case of any help please type and send "mseva"',
    hi_IN: '\nजब भी आपको मेरी सहायता की आवश्यकता हो तो कृपया "mseva" लिखें और भेजें',
  },

};

module.exports = messages;
