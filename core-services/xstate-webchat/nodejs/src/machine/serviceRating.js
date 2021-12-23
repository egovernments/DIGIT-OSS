const { assign } = require('xstate');
const { ratingAndFeedback } = require('./service/service-loader');
const dialog = require('./util/dialog');
const config = require('../env-variables');
const chatStateRepository = require('../session/repo');
const uuid = require('uuid');

const serviceRating =  {
  id: 'serviceRating',
  initial: 'ratingandfeedbackmenu',
  onEntry: assign((context, event) => {
    context.slots.serviceRating = {}
    context.serviceRating = {slots: {}};
  }),
  states: {
    ratingandfeedbackmenu : {
      id: 'ratingandfeedbackmenu',
      initial: 'question',
      states: {
        question: {
          always : [
            {
              target: '#ratingOptions',
              cond: (context) => context.intention == 'rating'
            },
            {
              target: '#ratingComment', 
              cond: (context) => context.intention == 'provide_feedback'
            },
            {
              target: 'error'
            }
          ]
        },
        error: {
          onEntry: assign( (context, event) => dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), false)),
          always : 'question'
        }
      },
    },
    ratingOptions : {
      id: 'ratingOptions',
      initial: 'question',
      states: {
        question: {
          onEntry: assign( (context, event) => {
            let preamble = dialog.get_message(messages.rating.question, context.user.locale);
            let maxStarRating = config.egovServices.maxStarRating;
            let optionList = [];
            for(let i=0;i<maxStarRating;i++)
              optionList.push('*');
            let {prompt, grammer} = dialog.constructContextGrammer(optionList, null, context.user.locale, 'starRating');

            let starRatingQuestion = {
              message: preamble, 
              step: 'intermediate',
              option: prompt
            };
            dialog.sendMessage(context, starRatingQuestion);
          }),
          on: {
            USER_MESSAGE: 'process'
          }
        },
        process: {
          onEntry: assign((context, event) =>{
            context.intention = dialog.get_intention(grammer.rating.question, event);
            context.slots.serviceRating["starRating"] = event.message.input;
          }),
          always : [
            {
              target: '#rating_group_one',
              cond: (context) => context.intention == 'rating_group_one'
            },
            {
              target: '#rating_group_two', 
              cond: (context) => context.intention == 'rating_group_two'
            },
            {
              target: 'error',
              cond: (context, event) => context.intention === dialog.INTENTION_UNKOWN
            }
          ]
        }, 
        error: {
          onEntry: assign( (context, event) => dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), false)),
          always : 'question'
        }
      },
    },
   rating_group_one: {
    id: 'rating_group_one',
    initial: 'question',
    states: {
      question: {
        invoke: {
          src: (context) => ratingAndFeedback.fetchFeedbackOptions(context.extraInfo.tenantId,"rating_group_one"),
          id: 'fetchFeedbackOption',
          onDone: {
           actions: assign((context, event) => {
              let { feedbackOptions, messageBundle } = event.data;
              let preamble = dialog.get_message(messages.rating.feedbackRatingGroupOneQuestion, context.user.locale);
              let {prompt, grammer} = dialog.constructListPromptAndGrammer(feedbackOptions, messageBundle, context.user.locale, false, false, 'mutliplechoice');
              context.grammer = grammer;

              let feedbackMessage = {
                message: preamble, 
                step: 'intermediate', 
                option: prompt
              };

              dialog.sendMessage(context, feedbackMessage);
            })
          },
          onError: {
            target: '#system_error'
          }
        },
        on: {
          USER_MESSAGE: 'process'
        }
      },
      process: {
        onEntry: assign((context, event) => {
          let choices = event.message.input;
          let selectedOption = [];
          for(let data of choices){
            event.message.input = data;
            let option = dialog.get_intention(context.grammer, event);
            selectedOption.push(option);
          }

          if(selectedOption.includes('INTENTION_UKNOWN'))
            context.intention = 'INTENTION_UKNOWN';
          else
            context.intention = selectedOption;
          
        }),
        always: [
          {
            target: '#ratingComment',
            cond: (context) => context.intention != dialog.INTENTION_UNKOWN,
            actions: assign((context, event) => {
              context.slots.serviceRating["feedbackSelectedOptions"] = {selectedOption: context.intention};
            })
          },
          {
            target: 'error',
            cond: (context) => context.intention == dialog.INTENTION_UNKOWN
          }
        ]
      }, 
      error: {
        onEntry: assign( (context, event) => {
          dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), false);
        }),
        always: 'question',
      }
    },
   },
   rating_group_two: {
    id: 'rating_group_two',
    initial: 'question',
    states: {
      question: {
        invoke: {
          src: (context) => ratingAndFeedback.fetchFeedbackOptions(context.extraInfo.tenantId,"rating_group_two"),
          id: 'fetchFeedbackOption',
          onDone: {
           actions: assign((context, event) => {
              let { feedbackOptions, messageBundle } = event.data;
              let preamble = dialog.get_message(messages.rating.feedbackRatingGroupTwoQuestion, context.user.locale);
              let {prompt, grammer} = dialog.constructListPromptAndGrammer(feedbackOptions, messageBundle, context.user.locale, false, false, 'mutliplechoice');
              context.grammer = grammer;

              let feedbackMessage = {
                message: preamble, 
                step: 'intermediate', 
                option: prompt
              };

              dialog.sendMessage(context, feedbackMessage);
            })
          },
          onError: {
            target: '#system_error'
          }
        },
        on: {
          USER_MESSAGE: 'process'
        }
      }, //question
      process: {
        onEntry: assign((context, event) => {
          let choices = event.message.input;
          let selectedOption = [];
          for(let data of choices){
            event.message.input = data;
            let option = dialog.get_intention(context.grammer, event);
            selectedOption.push(option);
          }

          if(selectedOption.includes('INTENTION_UKNOWN'))
            context.intention = 'INTENTION_UKNOWN';
          else
            context.intention = selectedOption;
          
        }),
        always: [
          {
            target: '#ratingComment',
            cond: (context) => context.intention != dialog.INTENTION_UNKOWN,
            actions: assign((context, event) => {
              context.slots.serviceRating["feedbackSelectedOptions"]= context.intention;
            })
          },
          {
            target: 'error',
            cond: (context) => context.intention == dialog.INTENTION_UNKOWN
          }
        ]
      }, 
      error: {
        onEntry: assign( (context, event) => {
          dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), false);
        }),
        always: 'question',
      }
    },
   },
   
   ratingComment: {
    id: 'ratingComment',
    initial: 'question',
    states: {
      question: { 
        onEntry: assign( (context, event) => {
          let commentMessage =[];
          let preamble = dialog.get_message(messages.rating.comment, context.user.locale);
          let commentQuestion = {
            message: preamble, 
            step: 'last',
            optionType: 'textarea',
            option: [{ key: '1', value: ''  }]
          };
          commentMessage.push(commentQuestion);

          let imageQuestion = {
            message: dialog.get_message(messages.rating.Image, context.user.locale), 
            step: 'last',
            optionType: 'image',
            option: [{ key: '1', value: dialog.get_message(messages.rating.Gallery, context.user.locale), type: 'button' }, { key: '2', value: dialog.get_message(messages.rating.Screenshot, context.user.locale), type: 'button' }]
          };
          commentMessage.push(imageQuestion);

          dialog.sendMessage(context, commentMessage);
        }),
        on: {
          USER_MESSAGE: 'process'
        }
      }, //question
      process: {
        onEntry: assign((context, event) => {
          context.slots.serviceRating["comments"] = event.message.input;
          context.slots.serviceRating["filestoreId"] = event.extraInfo.filestoreId
        }),
        always: {
            target: '#submitRating'
        }
        
      }
    },
   },
   submitRating: {
    id: 'submitRating',
    onEntry: assign((context, event) => {
      dialog.sendMessage(context, dialog.get_message(messages.rating.submitRating, context.user.locale));
      chatStateRepository.insertRatingData(
          uuid.v4(),
          context.user.userInfo.uuid,
          context.slots.serviceRating.starRating,
          JSON.stringify(context.slots.serviceRating.feedbackSelectedOptions),
          context.slots.serviceRating.comments,
          context.slots.serviceRating.filestoreId,
          new Date().getTime()
      );
      
    }),
    always: {
        target:'#endstate',
    }
   }

  } 
};

let messages = {
  rating: {
    question: {
      en_IN : 'How would you rate your experience with us?',
      hi_IN: ' सेवा का चयन करने के लिए प्रासंगिक विकल्प संख्या टाइप करें और भेजें 👇\n\n1. शिकायत दर्ज करें\n2. शिकायतों को ट्रैक करें'
    },
    feedbackRatingGroupOneQuestion:{
      en_IN: 'Tell us what you did not like?',
      hi_IN: 'क्या गलत हो गया ?'
    },
    feedbackRatingGroupTwoQuestion:{
      en_IN: 'Tell us what did you like?',
      hi_IN: 'क्या गलत हो गया ?'
    },
    comment:{
      en_IN: 'Comments',
      hi_IN: 'टिप्पणियाँ'
    },
    Image:{
      en_IN: 'Image',
      hi_IN: 'Image'
    },
    Gallery:{
      en_IN: 'Gallery',
      hi_IN: 'Gallery'
    },
    Screenshot:{
      en_IN: 'Take Screenshot',
      hi_IN: 'Take Screenshot'
    },
    submitRating: {
      en_IN: 'Thank you for providing feedback. Your response has been submitted successfully.',
      hi_IN: 'प्रतिक्रिया देने के लिए धन्यवाद। आपकी प्रतिक्रिया सफलतापूर्वक सबमिट कर दी गई है।'
    }
  }
};

let grammer = {
  rating: {
    question: [
      {intention: 'rating_group_one', recognize: ['1', '2', '3']},
      {intention: 'rating_group_two', recognize: ['4', '5']}
    ]
  },
  confirmation: {
    choice: [
      {intention: 'Yes', recognize: ['1',]},
      {intention: 'No', recognize: ['2']}
    ]
  }
};
module.exports = serviceRating;
