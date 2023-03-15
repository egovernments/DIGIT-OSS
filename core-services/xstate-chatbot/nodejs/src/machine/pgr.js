const { assign } = require('xstate');
const { pgrService } = require('./service/service-loader');
const dialog = require('./util/dialog');
const localisationService = require('./util/localisation-service');
const config = require('../env-variables');
const moment = require("moment-timezone");

const pgr =  {
  id: 'pgr',
  initial: 'pgrmenu',
  onEntry: assign((context, event) => {
    context.slots.pgr = {}
    context.pgr = {slots: {}};
  }),
  states: {
    pgrmenu : {
      id: 'pgrmenu',
      initial: 'question',
      states: {
        question: {
          /*onEntry: assign( (context, event) => {
            dialog.sendMessage(context, dialog.get_message(messages.pgrmenu.question, context.user.locale));
          }),
          on: {
            USER_MESSAGE: 'process'
          }*/
          always : [
            {
              target: '#fileComplaint',
              cond: (context) => context.intention == 'file_new_complaint'
            },
            {
              target: '#trackComplaint', 
              cond: (context) => context.intention == 'track_existing_complaints'
            },
            {
              target: 'error'
            }
          ]

        }, // pgrmenu.question
        process: {
          onEntry: assign((context, event) => context.intention = dialog.get_intention(grammer.pgrmenu.question, event)),
          always : [
            {
              target: '#fileComplaint',
              cond: (context) => context.intention == 'file_new_complaint'
            },
            {
              target: '#trackComplaint', 
              cond: (context) => context.intention == 'track_existing_complaints'
            },
            {
              target: 'error'
            }
          ]
        }, // pgrmenu.process
        error: {
          onEntry: assign( (context, event) => dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), false)),
          always : 'question'
        } // pgrmenu.error
      }, // pgrmenu.states
    }, // pgrmenu
    fileComplaint: {
      id: 'fileComplaint',
      initial: 'type',
      states: {
        type: {
          id: 'type',
          initial: 'complaintType2Step',
          states: {
            complaintType: {
              id: 'complaintType',
              initial: 'question',
              states: {
                question: {
                  invoke: {
                    src: (context) => pgrService.fetchFrequentComplaints(context.extraInfo.tenantId),
                    id: 'fetchFrequentComplaints',
                    onDone: {
                      actions: assign((context, event) => {
                        let preamble = dialog.get_message(messages.fileComplaint.complaintType.question.preamble, context.user.locale);
                        let {complaintTypes, messageBundle} = event.data;
                        let {prompt, grammer} = dialog.constructListPromptAndGrammer(complaintTypes, messageBundle, context.user.locale, true);
                        context.grammer = grammer; // save the grammer in context to be used in next step
                        dialog.sendMessage(context, `${preamble}${prompt}`);
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
                    context.intention = dialog.get_intention(context.grammer, event) 
                  }),
                  always: [
                    {
                      target: '#complaintType2Step',
                      cond: (context) => context.intention == dialog.INTENTION_MORE
                    },
                    {
                      target: '#location',
                      cond: (context) => context.intention != dialog.INTENTION_UNKOWN,
                      actions: assign((context, event) => {
                        context.slots.pgr["complaint"]= context.intention;
                      })
                    },
                    {
                      target: 'error'
                    }
                  ]
                }, // process
                error: {
                  onEntry: assign( (context, event) => {
                    dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), false);
                  }),
                  always: 'question',
                } // error
              } // states of complaintType
            }, // complaintType
            complaintType2Step: {
              id: 'complaintType2Step',
              initial: 'complaintCategory',
              states: {
                complaintCategory: {
                  id: 'complaintCategory',
                  initial: 'question',
                  states: {
                    question: {
                      invoke:  {                  
                        src: (context, event)=>pgrService.fetchComplaintCategories(context.extraInfo.tenantId),
                        id: 'fetchComplaintCategories',
                        onDone: {
                          actions: assign((context, event) => {
                            let { complaintCategories, messageBundle } = event.data;
                            let preamble = dialog.get_message(messages.fileComplaint.complaintType2Step.category.question.preamble, context.user.locale);
                            let {prompt, grammer} = dialog.constructListPromptAndGrammer(complaintCategories, messageBundle, context.user.locale);

                            let lengthOfList = grammer.length;
                            let otherTypeGrammer = { intention: 'Others', recognize: [ (lengthOfList + 1).toString() ] };
                            prompt += `\n*${lengthOfList + 1}.* ` + dialog.get_message(messages.fileComplaint.complaintType2Step.category.question.otherType, context.user.locale);
                            grammer.push(otherTypeGrammer);

                            context.grammer = grammer; // save the grammer in context to be used in next step
                            dialog.sendMessage(context, `${preamble}${prompt}`);
                          }),
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
                        context.intention = dialog.get_intention(context.grammer, event, true) 
                      }),
                      always: [
                        {
                          target: '#other',
                          cond: (context) => context.intention == 'Others',
                          actions: assign((context, event) => {
                            context.slots.pgr["complaint"] = context.intention;
                          })
                        },
                        {
                          target: '#complaintItem',
                          cond: (context) => context.intention != dialog.INTENTION_UNKOWN,
                          actions: assign((context, event) => {
                            context.slots.pgr["complaint"] = context.intention;
                          })
                        },
                        {
                          target: 'error'
                        }
                      ]
                    }, // process
                    error: {
                      onEntry: assign( (context, event) => {
                        dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), false);
                      }),
                      always:  'question',
                    } // error
                  } // states of complaintCategory
                }, // complaintCategory
                complaintItem: {
                  id: 'complaintItem',
                  initial: 'question',
                  states: {
                    question: {
                      invoke:  {                  
                        src: (context) => pgrService.fetchComplaintItemsForCategory(context.slots.pgr.complaint,context.extraInfo.tenantId),
                        id: 'fetchComplaintItemsForCategory',
                        onDone: {
                          actions: assign((context, event) => {
                            let { complaintItems, messageBundle } = event.data;
                            let preamble = dialog.get_message(messages.fileComplaint.complaintType2Step.item.question.preamble, context.user.locale);
                            let localisationPrefix = 'CS_COMPLAINT_TYPE_';
                            let complaintType = localisationService.getMessageBundleForCode(localisationPrefix + context.slots.pgr.complaint.toUpperCase());
                            preamble = preamble.replace('{{complaint}}',dialog.get_message(complaintType,context.user.locale));
                            let {prompt, grammer} = dialog.constructListPromptAndGrammer(complaintItems, messageBundle, context.user.locale, false, true);
                            context.grammer = grammer; // save the grammer in context to be used in next step
                            dialog.sendMessage(context, `${preamble}${prompt}`);
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
                        context.intention = dialog.get_intention(context.grammer, event, true) 
                      }),
                      always: [
                        {
                          target: '#complaintCategory',
                          cond: (context) => context.intention == dialog.INTENTION_GOBACK
                        },
                        {
                          target: '#other',
                          cond: (context) => context.intention != dialog.INTENTION_UNKOWN,
                          actions: assign((context, event) => {
                            context.slots.pgr["complaint"]= context.intention;
                          })
                        },
                        {
                          target: 'error'
                        }
                      ]
                    }, // process
                    error: {
                      onEntry: assign( (context, event) => {
                        dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), false);
                      }),
                      always:  'question',
                    } // error
                  } // states of complaintItem
                }, // complaintItem
              } // states of complaintType2Step
            }, // complaintType2Step
          }
        },
        location: {
          id: 'location',
          initial: 'geoLocationSharingInfo',
          states: {
            geoLocationSharingInfo: {
              id: 'geoLocationSharingInfo',
              onEntry: assign( (context, event) => {
                var message = {
                  type: 'image',
                  output: config.pgrUseCase.informationImageFilestoreId
                };
                dialog.sendMessage(context, message);
              }),
              always: 'geoLocation'
            },
            geoLocation: {
              id: 'geoLocation',
              initial: 'question',
              states : {
                question: {
                  onEntry: assign( (context, event) => {
                    let message = dialog.get_message(messages.fileComplaint.geoLocation.question, context.user.locale)
                    dialog.sendMessage(context, message);
                  }),
                  on: {
                    USER_MESSAGE: 'process'
                  }
                },
                process: {
                  invoke: {
                    id: 'getCityAndLocality',
                    src: (context, event) => {
                      if(event.message.type === 'location') {
                        context.slots.pgr.geocode = event.message.input;
                        return pgrService.getCityAndLocalityForGeocode(event.message.input, context.extraInfo.tenantId);
                      }
                      context.message = event.message.input;
                      return Promise.resolve();
                    },
                    onDone: [
                      {
                        target: '#confirmLocation',
                        cond: (context, event) => event.data,
                        actions: assign((context, event) => {
                          context.pgr.detectedLocation = event.data;
                        })
                      },
                      {
                        target: '#city',
                        cond: (context, event) => !event.data && context.message ==='1' && !config.pgrUseCase.geoSearch
                        
                      },
                      {
                        target: '#nlpCitySearch',
                        cond: (context, event) => !event.data && context.message ==='1' && config.pgrUseCase.geoSearch
                      },
                      {
                        target: '#geoLocation',
                        cond: (context, event) => !event.data && context.message !='1',
                        actions: assign((context, event) => {
                          let message = dialog.get_message(dialog.global_messages.error.retry, context.user.locale);
                          dialog.sendMessage(context, message,false);
                        })
                      }
                    ],
                    onError: [
                      {
                        target: '#city',
                        cond: (context, event) => !config.pgrUseCase.geoSearch,

                      },
                      {
                        target: '#nlpCitySearch',
                        cond: (context, event) => config.pgrUseCase.geoSearch,
                      }

                    ],
                  },
                }
              }
            },
            confirmLocation: {
              id: 'confirmLocation',
              initial: 'question',
              states: {
                question: {
                  onEntry: assign((context, event) => {
                    let message;
                    if(context.pgr.detectedLocation.locality) {
                      let localityName = dialog.get_message(context.pgr.detectedLocation.matchedLocalityMessageBundle, context.user.locale);
                      message = dialog.get_message(messages.fileComplaint.confirmLocation.confirmCityAndLocality, context.user.locale);
                      message = message.replace('{{locality}}', localityName);
                    } else {
                      message = dialog.get_message(messages.fileComplaint.confirmLocation.confirmCity, context.user.locale);                      
                    }
                    let cityName = dialog.get_message(context.pgr.detectedLocation.matchedCityMessageBundle, context.user.locale);
                    message = message.replace('{{city}}', cityName);
                    dialog.sendMessage(context, message);
                  }),
                  on: {
                    USER_MESSAGE: 'process'
                  }
                },
                process: {
                  onEntry: assign((context, event) => {
                    // TODO: Generalised "disagree" intention
                    if(event.message.input.trim().toLowerCase() === '1') {
                      context.slots.pgr["locationConfirmed"] = false;
                      context.message = {
                        isValid: true
                      };
                    } 
                    else if(event.message.input.trim().toLowerCase() === '2'){
                      context.slots.pgr["locationConfirmed"] = true;
                      context.slots.pgr.city = context.pgr.detectedLocation.city;
                      if(context.pgr.detectedLocation.locality) {
                        context.slots.pgr.locality = context.pgr.detectedLocation.locality;
                      }

                      context.message = {
                        isValid: true
                      };
                    }

                    else {
                      context.message = {
                        isValid: false
                      };
                    }
                  }),
                  always: [
                    {
                      target: '#persistComplaint',
                      cond: (context, event) => context.message.isValid && context.slots.pgr["locationConfirmed"]  && context.slots.pgr["locality"]
                    },
                    {
                      target: '#locality',
                      cond: (context, event) => context.message.isValid && !config.pgrUseCase.geoSearch && context.slots.pgr["locationConfirmed"] 
                    },
                    {
                      target: '#nlpLocalitySearch',
                      cond: (context, event) => context.message.isValid && config.pgrUseCase.geoSearch && context.slots.pgr["locationConfirmed"] 
                    },
                    {
                      target: '#city',
                      cond: (context, event) => context.message.isValid && !config.pgrUseCase.geoSearch,

                    },
                    {
                      target: '#nlpCitySearch',
                      cond: (context, event) => context.message.isValid && config.pgrUseCase.geoSearch,
                    },
                    {
                      target: 'process',
                      cond: (context, event) => {return !context.message.isValid;}                    
                    }
                  ]
                }
              }
            },
            nlpCitySearch: {
              id: 'nlpCitySearch',
              initial: 'question',
              states: {
                question: {
                  onEntry: assign((context, event) => {
                    let message = dialog.get_message(messages.fileComplaint.cityFuzzySearch.question, context.user.locale)
                    dialog.sendMessage(context, message);
                  }),
                  on: {
                    USER_MESSAGE: 'process'
                  }
                },
                process: {
                  invoke: {
                    id: 'cityFuzzySearch',
                    src: (context, event) => pgrService.getCity(event.message.input,context.user.locale),
                    onDone: {
                      target: 'route',
                      cond: (context, event) => event.data,
                      actions: assign((context, event) => {
                        let {predictedCityCode, predictedCity, isCityDataMatch} = event.data;
                        context.slots.pgr["predictedCityCode"] = predictedCityCode;
                        context.slots.pgr["predictedCity"] = predictedCity;
                        context.slots.pgr["isCityDataMatch"] = isCityDataMatch;
                        context.slots.pgr["city"] = predictedCityCode;
                      })
                    }, 
                    onError: {
                      target: '#system_error'
                    }

                  },
                },
                route:{
                  onEntry: assign((context, event) => {
                  }),
                  always: [
                    {
                      target: '#nlpLocalitySearch',
                      cond: (context) => context.slots.pgr["isCityDataMatch"] && context.slots.pgr["predictedCity"] != null && context.slots.pgr["predictedCityCode"] != null
                    },
                    {
                      target: '#confirmationFuzzyCitySearch',
                      cond: (context) => !context.slots.pgr["isCityDataMatch"] && context.slots.pgr["predictedCity"] != null && context.slots.pgr["predictedCityCode"] != null
                    },
                    {
                      target: '#nlpCitySearch',
                      cond: (context) => !context.slots.pgr["isCityDataMatch"] && context.slots.pgr["predictedCity"] == null && context.slots.pgr["predictedCityCode"] == null,
                      actions: assign((context, event) => {
                        let message = dialog.get_message(messages.fileComplaint.cityFuzzySearch.noRecord, context.user.locale)
                        dialog.sendMessage(context, message);
                      })

                    }
                  ]

                },
                confirmationFuzzyCitySearch:{
                  id: 'confirmationFuzzyCitySearch',
                  initial: 'question',
                  states:{
                    question: {
                      onEntry: assign((context, event) => {
                        let message = dialog.get_message(messages.fileComplaint.cityFuzzySearch.confirmation, context.user.locale);
                        message = message.replace('{{city}}',context.slots.pgr["predictedCity"]);
                        dialog.sendMessage(context, message);
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
                          target: '#nlpLocalitySearch',
                          cond: (context) => context.intention == 'Yes'
                        },
                        {
                          target: '#nlpCitySearch',
                          cond: (context) => context.intention == 'No',
                        },
                        {
                          target: 'error',
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

                }
              }  
            },
            nlpLocalitySearch: {
              id: 'nlpLocalitySearch',
              initial: 'question',
              states: {
                question: {
                  onEntry: assign((context, event) => {
                    let message = dialog.get_message(messages.fileComplaint.localityFuzzySearch.question, context.user.locale)
                    dialog.sendMessage(context, message);
                  }),
                  on: {
                    USER_MESSAGE: 'process'
                  }
                },
                process: {
                  invoke: {
                    id: 'localityFuzzySearch',
                    src: (context, event) => pgrService.getLocality(event.message.input, context.slots.pgr["city"], context.user.locale),
                    onDone: {
                      target: 'route',
                      cond: (context, event) => event.data,
                      actions: assign((context, event) => {
                        let {predictedLocalityCode, predictedLocality, isLocalityDataMatch} = event.data;
                        context.slots.pgr["predictedLocalityCode"] = predictedLocalityCode;
                        context.slots.pgr["predictedLocality"] = predictedLocality;
                        context.slots.pgr["isLocalityDataMatch"] = isLocalityDataMatch;
                        context.slots.pgr["locality"] = predictedLocalityCode;
                      })
                    }, 
                    onError: {
                      target: '#system_error'
                    }
                  },
                },
                route:{
                  onEntry: assign((context, event) => {
                  }),
                  always: [
                    {
                      target: '#persistComplaint',
                      cond: (context) => context.slots.pgr["isLocalityDataMatch"] && context.slots.pgr["predictedLocality"] != null && context.slots.pgr["predictedLocalityCode"] != null
                    },
                    {
                      target: '#confirmationFuzzyLocalitySearch',
                      cond: (context) => !context.slots.pgr["isLocalityDataMatch"] && context.slots.pgr["predictedLocality"] != null && context.slots.pgr["predictedLocalityCode"] != null
                    },
                    {
                      target: '#nlpLocalitySearch',
                      cond: (context) => !context.slots.pgr["isLocalityDataMatch"] && context.slots.pgr["predictedLocality"] == null && context.slots.pgr["predictedLocalityCode"] == null,
                      actions: assign((context, event) => {
                        let message = dialog.get_message(messages.fileComplaint.localityFuzzySearch.noRecord, context.user.locale)
                        dialog.sendMessage(context, message);
                      })

                    }
                  ]

                },
                confirmationFuzzyLocalitySearch:{
                  id: 'confirmationFuzzyLocalitySearch',
                  initial: 'question',
                  states:{
                    question: {
                      onEntry: assign((context, event) => {
                        let message = dialog.get_message(messages.fileComplaint.localityFuzzySearch.confirmation, context.user.locale);
                        message = message.replace('{{locality}}',context.slots.pgr["predictedLocality"]);
                        dialog.sendMessage(context, message);
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
                          target: '#persistComplaint',
                          cond: (context) => context.intention == 'Yes'
                        },
                        {
                          target: '#nlpLocalitySearch',
                          cond: (context) => context.intention == 'No',
                        },
                        {
                          target: 'error',
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

                }
              }
            },
            city: {
              id: 'city',
              initial: 'question',
              states: {
                question: {
                  invoke: {
                    id: 'fetchCities',
                    src: (context, event) => pgrService.fetchCitiesAndWebpageLink(context.extraInfo.tenantId,context.extraInfo.whatsAppBusinessNumber),
                    onDone: {
                      actions: assign((context, event) => {
                        let { cities, messageBundle, link } = event.data;
                        let preamble = dialog.get_message(messages.fileComplaint.city.question.preamble, context.user.locale);
                        let message = preamble + '\n' + link;
                        let grammer = dialog.constructLiteralGrammer(cities, messageBundle, context.user.locale);
                        context.grammer = grammer;
                        dialog.sendMessage(context, message);
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
                  onEntry:  assign((context, event) => {
                    context.intention = dialog.get_intention(context.grammer, event) 
                  }),
                  always : [
                    {
                      target: '#locality',
                      cond: (context) => context.intention != dialog.INTENTION_UNKOWN,
                      actions: assign((context, event) => context.slots.pgr["city"] = context.intention)    
                    },
                    {
                      target: 'error',
                    }, 
                  ]
                },
                error: {
                  onEntry: assign( (context, event) => {
                    dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), false);
                  }),
                  always:  'question',
                }
              }
            },
            locality: {
              id: 'locality',
              initial: 'question',
              states: {
                question: {
                  invoke: {
                    id: 'fetchLocalities',
                    src: (context) => pgrService.fetchLocalitiesAndWebpageLink(context.slots.pgr.city,context.extraInfo.whatsAppBusinessNumber),
                    onDone: {
                      actions: assign((context, event) => {
                        let { localities, messageBundle,link } = event.data;
                        let preamble = dialog.get_message(messages.fileComplaint.locality.question.preamble, context.user.locale);
                        let message = preamble + '\n' + link;
                        let grammer = dialog.constructLiteralGrammer(localities, messageBundle, context.user.locale);
                        context.grammer = grammer;
                        dialog.sendMessage(context, message);
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
                  onEntry:  assign((context, event) => {
                    context.intention = dialog.get_intention(context.grammer, event) 
                  }),
                  always : [
                    {
                      target: '#persistComplaint',
                      cond: (context) => context.intention != dialog.INTENTION_UNKOWN,
                      actions: assign((context, event) => context.slots.pgr["locality"] = context.intention)
                    },
                    {
                      target: 'error',
                    }, 
                  ]
                },
                error: {
                  onEntry: assign( (context, event) => {
                    dialog.sendMessage(context, dialog.get_message(dialog.global_messages.error.retry, context.user.locale), false);
                  }),
                  always:  'question',
                }
              }
            },
            landmark: {
              // come here when user 1) did not provide geolocation or 2) did not confirm geolocation - either because google maps got it wrong or if there was a google api error 

            }
          }
        },
        other: {
          // get other info
          id: 'other',
          initial: 'imageUpload',
          states: {
            imageUpload: {
              id: 'imageUpload',
              initial: 'question',
              states: {
                question: {
                  onEntry: assign((context, event) => {
                    let message = dialog.get_message(messages.fileComplaint.imageUpload.question, context.user.locale);
                    dialog.sendMessage(context, message);
                  }),
                  on: {
                    USER_MESSAGE: 'process'
                  }
                },
                process: {
                  onEntry: assign((context, event) => {
                    if(dialog.validateInputType(event, 'image')) {
                      context.slots.pgr.image = event.message.input;
                      context.message = {
                        isValid: true
                      };
                    }
                    else{
                      let parsed = event.message.input;
                      let isValid = (parsed === "1");
                      context.message = {
                        isValid: isValid,
                        messageContent: event.message.input
                      };
                    }
                  }),
                  always:[
                    {
                      target: 'error',
                      cond: (context, event) => {
                        return ! context.message.isValid;
                      }
                    },
                    {
                      target: '#location',
                      cond: (context, event) => {
                        return context.message.isValid;
                      }
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
        },
        persistComplaint: {
          id: 'persistComplaint',
          invoke: {
            id: 'persistComplaint',
            src: (context) => pgrService.persistComplaint(context.user,context.slots.pgr,context.extraInfo),
            onDone: {
              target: '#endstate',
              actions: assign((context, event) => {
                let templateList;
                let complaintDetails = event.data;
                let localeList = config.supportedLocales.split(',');
                let localeIndex = localeList.indexOf(context.user.locale);
                templateList =  config.valueFirstWhatsAppProvider.valuefirstNotificationLodgeCompliantTemplateid.split(',');
                
                if(templateList[localeIndex])
                  context.extraInfo.templateId = templateList[localeIndex];
                else
                  context.extraInfo.templateId = templateList[0];

                let params=[];
                params.push(complaintDetails.complaintNumber);

                let urlComponemt = complaintDetails.complaintLink.split('/');
                let bttnUrlComponent = urlComponemt[urlComponemt.length -1];

                var templateContent = {
                  output: context.extraInfo.templateId,
                  type: "template",
                  params: params,
                  bttnUrlComponent: bttnUrlComponent
                };

                dialog.sendMessage(context, templateContent, true);
              })
            }
          }
        },
      }, // fileComplaint.states
    },  // fileComplaint
    trackComplaint: {
      id: 'trackComplaint',
      invoke: {
        id: 'fetchOpenComplaints',
        src: (context) => pgrService.fetchOpenComplaints(context.user),
        onDone: [
          {
            target: '#endstate',
            cond: (context, event) => {
              return event.data.length>0;
            },
            actions: assign((context, event) => {
              (async() => {   
                let templateList;
                let localeList = config.supportedLocales.split(',');
                let localeIndex = localeList.indexOf(context.user.locale);
                templateList =  config.valueFirstWhatsAppProvider.valuefirstNotificationTrackCompliantTemplateid.split(',');
                
                if(templateList[localeIndex])
                  context.extraInfo.templateId = templateList[localeIndex];
                else
                  context.extraInfo.templateId = templateList[0];


                let complaints = event.data;
                var preamble =  dialog.get_message(messages.trackComplaint.results.preamble, context.user.locale);
                dialog.sendMessage(context, preamble, true);
                await new Promise(resolve => setTimeout(resolve, 1000));
                for(let i = 0; i < complaints.length; i++) {
                  let params=[];
                  let complaint = complaints[i];

                  params.push(complaint.complaintType);
                  params.push(complaint.complaintNumber);
                  params.push(complaint.filedDate);
                  params.push(complaint.complaintStatus);

                  let urlComponemt = complaint.complaintLink.split('/');
                  let bttnUrlComponent = urlComponemt[urlComponemt.length -1];

                  var templateContent = {
                    output: context.extraInfo.templateId,
                    type: "template",
                    params: params,
                    bttnUrlComponent: bttnUrlComponent
                  };

                  dialog.sendMessage(context, templateContent, true);
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
                var closingStatement = dialog.get_message(messages.trackComplaint.results.closingStatement, context.user.locale);
                dialog.sendMessage(context, closingStatement, true);
              })();
            })
          },
          {
            target: '#endstate',
            actions: assign((context, event) => {
              let message = dialog.get_message(messages.trackComplaint.noRecords, context.user.locale);
              dialog.sendMessage(context, message);
            })
          }
        ]
      }
    } // trackComplaint
  } // pgr.states
}; // pgr

let messages = {
  pgrmenu: {
    question: {
      en_IN : 'Please type and send the number for your option 👇\n\n1. File New Complaint.\n2. Track Old Complaints.',
      hi_IN: ' सेवा का चयन करने के लिए प्रासंगिक विकल्प संख्या टाइप करें और भेजें 👇\n\n1. शिकायत दर्ज करें\n2. शिकायतों को ट्रैक करें'
    }
  },
  fileComplaint: {
    complaintType: {
      question: {
        preamble: {
          en_IN : 'What is the complaint about ? Please type and send the number of your option 👇',
          hi_IN : 'कृपया अपनी शिकायत के लिए नंबर दर्ज करें'
        },
        other: {
          en_IN : 'Other ...',
          hi_IN : 'कुछ अन्य ...'
        }
      }
    }, // complaintType
    complaintType2Step: {
      category: {
        question: {
          preamble: {
            en_IN : 'Please type and send the number to select a complaint type from the list below 👇\n',
            hi_IN : 'नीचे दी गई सूची से शिकायत प्रकार चुनने के लिए विकल्प संख्या टाइप करें और भेजें 👇'
          },
          otherType: {
            en_IN: 'Others',
            hi_IN: 'अन्य'
          }
        }
      },
      item: {
        question: {
          preamble : {
            en_IN : 'What is the problem you are facing with {{complaint}}?\n',
            hi_IN : '{{complaint}} से आप किस प्रकार की समस्या का सामना कर रहे हैं?\n',
          },
        }
      },
    }, // complaintType2Step
    geoLocation: {
      question: {
        en_IN :'Please share your location if you are at the grievance site.\n\n👉  Refer the image below to understand steps for sharing the location.\n\n👉  To continue without sharing the location, type and send  *1*.',
        hi_IN : 'यदि आप शिकायत स्थल पर हैं तो कृपया अपना स्थान साझा करें।\n\n👉 स्थान साझा करने के चरणों को समझने के लिए नीचे दी गई छवि देखें।\n\n👉 स्थान साझा किए बिना जारी रखने के लिए, 1 टाइप करें और भेजें।'
      }
    }, // geoLocation 
    confirmLocation: {
      confirmCityAndLocality: {
        en_IN: 'Is this the correct location of the complaint?\nCity: {{city}}\nLocality: {{locality}}\n\nType and send *1* if it is incorrect\nElse, type and send *2* to confirm and proceed',
        hi_IN: 'क्या यह शिकायत का सही स्थान है?\nशहर: {{city}} \n स्थान: {{locality}} \n\nयदि यह गलत है *1* टाइप करें और भेजें\nअन्यथा, पुष्टि करने और आगे बढ़ने के लिए *2* टाइप करें और भेजें'
      },
      confirmCity: {
        en_IN: 'Is this the correct location of the complaint?\nCity: {{city}}\n\nType and send *1* if it is incorrect\nElse, type and send *2* to confirm and proceed',
        hi_IN: 'क्या यह शिकायत का सही स्थान है? \nशहर: {{city}}\nयदि यह गलत है *1* टाइप करें और भेजें\nअन्यथा, पुष्टि करने और आगे बढ़ने के लिए *2* टाइप करें और भेजें'
      }
    },
    city: {
      question: {
        preamble: {
          en_IN: 'Please select your city from the link given below. Tap on the link to search and select your city.',
          hi_IN: 'कृपया नीचे दिए गए लिंक से अपने शहर का चयन करें। अपने शहर को खोजने और चुनने के लिए लिंक पर टैप करें।'
        }
      }
    }, // city
    locality: {
      question: {
        preamble: {
          en_IN: 'Please select the locality of your complaint from the link below. Tap on the link to search and select a locality.',
          hi_IN: 'कृपया नीचे दिए गए लिंक से अपनी शिकायत के इलाके का चयन करें। किसी इलाके को खोजने और चुनने के लिए लिंक पर टैप करें।'
        }
      }
    }, // locality
    imageUpload: {
      question: {
        en_IN: 'If possible, attach a photo of your grievance.\n\nTo continue without photo, type and send *1*',
        hi_IN: 'यदि संभव हो तो अपनी शिकायत का फोटो संलग्न करें।\n\nफोटो के बिना जारी रखने के लिए, *1* टाइप करें और भेजें'
      },
      error:{
        en_IN : 'Sorry, I didn\'t understand',
        hi_IN: 'क्षमा करें, मुझे समझ नहीं आया।',
      }
    },
    persistComplaint: {
      en_IN: 'Thank You 😃 Your complaint is registered successfully with mSeva.\n\nThe Complaint No is : *{{complaintNumber}}*\n\nClick on the link below to view and track your complaint:\n{{complaintLink}}\n',
      hi_IN: 'धन्यवाद 😃 आपकी शिकायत mSeva के साथ सफलतापूर्वक दर्ज हो गई है।\n\nशिकायत संख्या है : *{{complaintNumber}}*\n\nअपनी शिकायत देखने और ट्रैक करने के लिए नीचे दिए गए लिंक पर क्लिक करें:\n {{complaintLink}}\n'
    },
    closingStatement: {
      en_IN: '\nIn case of any help please type and send "mseva"',
      hi_IN: '\nकिसी भी मदद के लिए कृपया "mseva" टाइप करें और भेजें'
    },
    cityFuzzySearch: {
      question: {
        en_IN: "Enter the name of your city.\n\n(For example - Jalandhar, Amritsar, Ludhiana)",
        hi_IN: "अपने शहर का नाम दर्ज करें।\n\n(उदाहरण के लिए - जालंधर, अमृतसर, लुधियाना)"
      },
      confirmation: {
        en_IN: "Did you mean *“{{city}}”* ?\n\n👉  Type and send *1* to confirm.\n\n👉  Type and send *2* to write again.",
        hi_IN: "क्या आपका मतलब *“{{city}}”* था?\n\n👉 पुष्टि करने के लिए *1* टाइप करें और भेजें।\n\n👉 फिर से लिखने के लिए *2* टाइप करें और भेजें।"
      },
      noRecord:{
        en_IN: 'The provided city is either incorrect or not present in our record.\nPlease enter the details again.',
        hi_IN: 'प्रदान किया गया शहर या तो गलत है या हमारे रिकॉर्ड में मौजूद नहीं है।\nकृपया विवरण फिर से दर्ज करें'
      }
    },
    localityFuzzySearch: {
      question: {
        en_IN: "Enter the name of your locality.\n\n(For example - Ajit Nagar)",
        hi_IN: "अपने इलाके का नाम दर्ज करें।\n\n(उदाहरण के लिए - अजीत नगर)"
      },
      confirmation: {
        en_IN: "Did you mean *“{{locality}}”* ?\n\n👉  Type and send *1* to confirm.\n\n👉  Type and send *2* to write again.",
        hi_IN: "क्या आपका मतलब *“{{locality}}”* था?\n\n👉 पुष्टि करने के लिए *1* टाइप करें और भेजें।\n\n👉 फिर से लिखने के लिए *2* टाइप करें और भेजें।"      
      },
      noRecord:{
        en_IN: 'The provided locality is either incorrect or not present in our record.\nPlease enter the details again.',
        hi_IN: 'प्रदान किया गया स्थान या तो गलत है या हमारे रिकॉर्ड में मौजूद नहीं है।\nकृपया विवरण फिर से दर्ज करें'
      }
    }
  }, // fileComplaint
  trackComplaint: {
    noRecords: {
      en_IN: 'Sorry 😥 No complaints are found registered from this mobile number.\n\n👉 To go back to the main menu, type and send mseva.',
      hi_IN: 'अब आपके द्वारा पंजीकृत कोई खुली शिकायत नहीं है।\n\n👉 मुख्य मेनू पर वापस जाने के लिए mseva टाइप करें और भेजें।'
    },
    results: {
      preamble: {
        en_IN: 'Following are your open complaints',
        hi_IN: 'आपकी निम्नलिखित शिकायतें खुली हैं:'
      },
      complaintTemplate: {
        en_IN: '*{{complaintType}}*\n\nFiled Date: {{filedDate}}\n\nCurrent Complaint Status: *{{complaintStatus}}*\n\nTap on the link below to view complaint details\n{{complaintLink}}',
        hi_IN: '*{{complaintType}}*\n\nदायर तिथि: {{filedDate}}\n\nवर्तमान शिकायत की स्थिति: *{{complaintStatus}}*\n\nशिकायत विवरण देखने के लिए नीचे दिए गए लिंक पर टैप करें\n{{complaintLink}}'
      },
      closingStatement: {
        en_IN: '👉 To go back to the main menu, type and send mseva.',
        hi_IN: '👉 मुख्य मेनू पर वापस जाने के लिए mseva टाइप करें और भेजें।'
      }
    }
  }
}; // messages

let grammer = {
  pgrmenu: {
    question: [
      {intention: 'file_new_complaint', recognize: ['1', 'file', 'new']},
      {intention: 'track_existing_complaints', recognize: ['2', 'track', 'existing']}
    ]
  },
  confirmation: {
    choice: [
      {intention: 'Yes', recognize: ['1',]},
      {intention: 'No', recognize: ['2']}
    ]
  }
};
module.exports = pgr;
