const messages = {
  rating: {
    question: {
      en_IN: 'How would you rate your experience with us?',
      hi_IN: ' सेवा का चयन करने के लिए प्रासंगिक विकल्प संख्या टाइप करें और भेजें 👇\n\n1. शिकायत दर्ज करें\n2. शिकायतों को ट्रैक करें',
    },
    feedbackRatingGroupOneQuestion: {
      en_IN: 'Tell us what you did not like?',
      hi_IN: 'क्या गलत हो गया ?',
    },
    feedbackRatingGroupTwoQuestion: {
      en_IN: 'Tell us what did you like?',
      hi_IN: 'क्या गलत हो गया ?',
    },
    comment: {
      en_IN: 'Comments',
      hi_IN: 'टिप्पणियाँ',
    },
    Image: {
      en_IN: 'Image',
      hi_IN: 'Image',
    },
    Gallery: {
      en_IN: 'Gallery',
      hi_IN: 'Gallery',
    },
    Screenshot: {
      en_IN: 'Take Screenshot',
      hi_IN: 'Take Screenshot',
    },
    submitRating: {
      en_IN: 'Thank you for providing feedback. Your response has been submitted successfully.',
      hi_IN: 'प्रतिक्रिया देने के लिए धन्यवाद। आपकी प्रतिक्रिया सफलतापूर्वक सबमिट कर दी गई है।',
    },
  },
};

const grammers = {
  rating: {
    question: [
      { intention: 'rating_group_one', recognize: ['1', '2', '3'] },
      { intention: 'rating_group_two', recognize: ['4', '5'] },
    ],
  },
  confirmation: {
    choice: [
      { intention: 'Yes', recognize: ['1'] },
      { intention: 'No', recognize: ['2'] },
    ],
  },
};

module.exports.messages = messages;
module.exports.grammers = grammers;
