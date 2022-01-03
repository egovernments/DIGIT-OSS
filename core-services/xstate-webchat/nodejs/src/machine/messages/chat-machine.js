const messages = {

  menu: {
     prompt: {
        en_IN: { message: 'Please select what you need help with?', step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'Raise a complaint' }, { key: '2', value: 'Provide Feedback'  }, { key: '3', value: 'Rate the service'  }] },
        hi_IN: { message: 'कृपया चुनें कि आपको किसमें सहायता चाहिए?।', step: 'intermediate', optionType: 'button', option: [{ key: '1', value: 'शिकायत दर्ज करें।'  }, { key: '2', value: 'अपनी राय बताएं।'  }, { key: '3', value: 'सेवा को रेट करें।'  }] }
      },
      options: {
        list: ['complaint', 'providefeedback', 'rateservice'],
        messageBundle: {
          complaint: {
            en_IN: 'Raise a complaint',
            hi_IN: 'शिकायत दर्ज करें',
          },
          providefeedback: {
            en_IN: 'Provide Feedback',
            hi_IN: 'अपनी राय बताएं।',
          },
          rateservice: {
            en_IN: 'Rate the service',
            hi_IN: 'सेवा को रेट करें।',
          },
        },
      },
    
  },
};

module.exports = messages;
