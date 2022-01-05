const { assign } = require('xstate');
const uuid = require('uuid');
const { ratingAndFeedback } = require('./service/service-loader');
const dialog = require('./util/dialog');
const config = require('../env-variables');
const chatStateRepository = require('../session/repo');
const { messages, grammers } = require('./messages/rating-feedback-messages');

const serviceRating = {
  id: 'serviceRating',
  initial: 'ratingandfeedbackmenu',
  onEntry: assign((context, event) => {
    context.slots.serviceRating = {};
    context.serviceRating = { slots: {} };
  }),
  states: {
    ratingandfeedbackmenu: {
      id: 'ratingandfeedbackmenu',
      initial: 'question',
      states: {
        question: {
          always: [
            {
              target: '#ratingOptions',
              cond: (context) => context.intention == 'rateservice',
            },
            {
              target: '#ratingComment',
              cond: (context) => context.intention == 'providefeedback',
            },
            {
              target: 'error',
            },
          ],
        },
        error: {
          onEntry: assign((context, event) => dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), false)),
          always: 'question',
        },
      },
    },
    ratingOptions: {
      id: 'ratingOptions',
      initial: 'question',
      states: {
        question: {
          onEntry: assign((context, event) => {
            const preamble = dialog.get_message(messages.rating.question, context.user.locale);

            const starRatingQuestion = {
              message: preamble,
              step: 'intermediate',
              optionType: "stars",
              option: []
            };
            dialog.sendMessage(context, starRatingQuestion);
          }),
          on: {
            USER_MESSAGE: 'process',
          },
        },
        process: {
          onEntry: assign((context, event) => {
            context.intention = dialog.get_intention(grammers.rating.question, event);
            context.slots.serviceRating.starRating = event.message.input;
          }),
          always: [
            {
              target: '#rating_group_one',
              cond: (context) => context.intention == 'rating_group_one',
            },
            {
              target: '#rating_group_two',
              cond: (context) => context.intention == 'rating_group_two',
            },
            {
              target: 'error',
              cond: (context, event) => context.intention === dialog.INTENTION_UNKOWN,
            },
          ],
        },
        error: {
          onEntry: assign((context, event) => dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), false)),
          always: 'question',
        },
      },
    },
    rating_group_one: {
      id: 'rating_group_one',
      initial: 'question',
      states: {
        question: {
          invoke: {
            src: (context) => ratingAndFeedback.fetchFeedbackOptions(context.extraInfo.tenantId, 'rating_group_one'),
            id: 'fetchFeedbackOption',
            onDone: {
              actions: assign((context, event) => {
                const { feedbackOptions, messageBundle } = event.data;
                const preamble = dialog.get_message(messages.rating.feedbackRatingGroupOneQuestion, context.user.locale);
                const { prompt, grammer } = dialog.constructListPromptAndGrammer(feedbackOptions, messageBundle, context.user.locale, false, false, 'mutliplechoice');
                context.grammer = grammer;

                const feedbackMessage = {
                  message: preamble,
                  step: 'intermediate',
                  optionType: "multiSelect",
                  option: prompt,
                };

                dialog.sendMessage(context, feedbackMessage);
              }),
            },
            onError: {
              target: '#system_error',
            },
          },
          on: {
            USER_MESSAGE: 'process',
          },
        },
        process: {
          onEntry: assign((context, event) => {
            const choices = event.message.input;
            const selectedOption = [];
            for (const data of choices) {
              event.message.input = data;
              const option = dialog.get_intention(context.grammer, event);
              selectedOption.push(option);
            }

            if (selectedOption.includes('INTENTION_UKNOWN')) { context.intention = 'INTENTION_UKNOWN'; } else { context.intention = selectedOption; }
          }),
          always: [
            {
              target: '#ratingComment',
              cond: (context) => context.intention != dialog.INTENTION_UNKOWN,
              actions: assign((context, event) => {
                context.slots.serviceRating.feedbackSelectedOptions = { selectedOption: context.intention };
              }),
            },
            {
              target: 'error',
              cond: (context) => context.intention == dialog.INTENTION_UNKOWN,
            },
          ],
        },
        error: {
          onEntry: assign((context, event) => {
            dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), false);
          }),
          always: 'question',
        },
      },
    },
    rating_group_two: {
      id: 'rating_group_two',
      initial: 'question',
      states: {
        question: {
          invoke: {
            src: (context) => ratingAndFeedback.fetchFeedbackOptions(context.extraInfo.tenantId, 'rating_group_two'),
            id: 'fetchFeedbackOption',
            onDone: {
              actions: assign((context, event) => {
                const { feedbackOptions, messageBundle } = event.data;
                const preamble = dialog.get_message(messages.rating.feedbackRatingGroupTwoQuestion, context.user.locale);
                const { prompt, grammer } = dialog.constructListPromptAndGrammer(feedbackOptions, messageBundle, context.user.locale, false, false, 'mutliplechoice');
                context.grammer = grammer;

                const feedbackMessage = {
                  message: preamble,
                  step: 'intermediate',
                  option: prompt,
                };

                dialog.sendMessage(context, feedbackMessage);
              }),
            },
            onError: {
              target: '#system_error',
            },
          },
          on: {
            USER_MESSAGE: 'process',
          },
        }, // question
        process: {
          onEntry: assign((context, event) => {
            const choices = event.message.input;
            const selectedOption = [];
            for (const data of choices) {
              event.message.input = data;
              const option = dialog.get_intention(context.grammer, event);
              selectedOption.push(option);
            }

            if (selectedOption.includes('INTENTION_UKNOWN')) { context.intention = 'INTENTION_UKNOWN'; } else { context.intention = selectedOption; }
          }),
          always: [
            {
              target: '#ratingComment',
              cond: (context) => context.intention != dialog.INTENTION_UNKOWN,
              actions: assign((context, event) => {
                context.slots.serviceRating.feedbackSelectedOptions = context.intention;
              }),
            },
            {
              target: 'error',
              cond: (context) => context.intention == dialog.INTENTION_UNKOWN,
            },
          ],
        },
        error: {
          onEntry: assign((context, event) => {
            dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), false);
          }),
          always: 'question',
        },
      },
    },

    ratingComment: {
      id: 'ratingComment',
      initial: 'question',
      states: {
        question: {
          onEntry: assign((context, event) => {
            const preamble = dialog.get_message(messages.rating.comment, context.user.locale);
            const commentQuestion = {
              message: preamble,
              step: 'last',
              optionType: 'textarea',
              option: [{ key: '1', value: '' }],
            };

            dialog.sendMessage(context, commentQuestion);
          }),
          on: {
            USER_MESSAGE: 'process',
          },
        }, // question
        process: {
          onEntry: assign((context, event) => {
            context.slots.serviceRating.comments = event.message.input;
            context.slots.serviceRating.filestoreId = event.extraInfo.filestoreId;
          }),
          always: {
            target: '#submitRating',
          },

        },
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
          new Date().getTime(),
        );
      }),
      always: {
        target: '#endstate',
      },
    },

  },
};

module.exports = serviceRating;
