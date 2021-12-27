const INTENTION_UNKOWN = 'INTENTION_UKNOWN';
const INTENTION_MORE = 'more';
const INTENTION_GOBACK = 'goback';

function get_input(event, scrub = true) {
  return scrub ? event.message.input.trim().toLowerCase() : event.message.input;
}
function get_message(bundle, locale = 'en_IN') {
  return (bundle[locale] === undefined) ? bundle.en_IN : bundle[locale];
}
function get_intention(g, event, strict = false) {
  let utterance;
  if(typeof event.message.input == 'string')
    utterance = get_input(event);
  else
    utterance = get_input(event, false);

  function exact(e) {
    return e.recognize.includes(utterance);
  }
  function contains(e) {
    return e.recognize.find((r) => utterance.includes(r));
  }
  const index = strict ? g.findIndex(exact) : g.findIndex((e) => contains(e));
  return (index == -1) ? INTENTION_UNKOWN : g[index].intention;
}
function constructListPromptAndGrammer(keys, message_bundle, locale, more = false, goback = false, type = 'button') {
  let prompt = [];
  const grammer = [];
  if (more) {
    keys = keys.concat([INTENTION_MORE]);
    message_bundle = { ...message_bundle, [INTENTION_MORE]: global_messages.more };
  }
  if (goback) {
    keys = keys.concat([INTENTION_GOBACK]);
    message_bundle = { ...message_bundle, [INTENTION_GOBACK]: global_messages.goback };
  }

  keys.forEach((element, index) => {
    let value;
    if (message_bundle[element] !== undefined) {
      value = get_message(message_bundle[element], locale);
    }
    if (value === undefined) {
      value = element;
    }
    
    let data = {
      key: index+1,
      value: value,
      type: type
    };

    prompt.push(data);

    grammer.push({ intention: element, recognize: [(index + 1).toString()] });
  });
  return { prompt, grammer };
}
function constructLiteralGrammer(keys, message_bundle, locale) {
  const grammer = [];
  keys.forEach((element) => {
    let value;
    if (message_bundle[element] !== undefined) {
      value = get_message(message_bundle[element], locale);
    }
    if (value === undefined) {
      value = element;
    }
    grammer.push({ intention: element, recognize: [value.toLowerCase()] });
  });
  return grammer;
}

function constructContextGrammer(keys, message_bundle, locale, type = 'button') {
  var grammer = [];
  var prompt = [];
  keys.forEach((element, index) => {
    let value = undefined;
    if (value === undefined) {
      value = element;
    }
    
    let data = {
      key: index+1,
      value: value,
      type: type
    };

    prompt.push(data);
    grammer.push({intention: element, recognize: [(index+1).toString()]});
  });

  return grammer;
}

function validateInputType(event, type) {
  const inputType = event.message.type;
  return inputType === type;
} 
function sendMessage(context, message, immediate = true) {
  if (!context.output) {
    context.output = [];
  }
  context.output.push(message);
  if (immediate) {
    context.chatInterface.toUser(context.user, context.output, context.extraInfo,context.connection);
    context.output = [];
  }
}

// TODO: All the below regional langauges are translated by google, replace with original - marathi
let global_messages = {
  error: {
    optionsRetry: {
      en_IN: 'I am sorry, I didn\'t understand. Please select from the options given again.',
      pa_IN: 'ਮੈਨੂੰ ਮਾਫ ਕਰਨਾ, ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ. ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਦਿੱਤੀਆਂ ਗਈਆਂ ਚੋਣਾਂ ਵਿੱਚੋਂ ਚੋਣ ਕਰੋ.',
      hi_IN: 'मुझे क्षमा करें, मुझे समझ नहीं आया। कृपया दिए गए विकल्पों में से फिर से चयन करें।',
      ta_IN: 'மன்னிக்கவும், புரியவில்லை. கொடுக்கப்பட்ட ஆப்ஷன்களை மீண்டும் தேர்வு செய்க.',
      ma_IN: 'माफ करा, मला कळले नाही. कृपया पुन्हा दिलेल्या पर्यायांमधून निवडा.',
      kn_IN: 'ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು  ಕೊಟ್ಟಿರುವ ಆಯ್ಕೆಗಳಿಂದ ಆಯ್ದುಕೊಳ್ಳಿ',
      te_IN: 'క్షమించండి. మరోసారి ఈ కింద ఆప్షన్స్ నుంచి ఒక ఆప్షన్ సెలెక్ట్ చేయండి',
    },
    retry: {
      en_IN: 'I am sorry, I didn\'t understand. Let\'s try again.',
      pa_IN: 'ਮੈਨੂੰ ਮਾਫ ਕਰਨਾ, ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ. ਆਓ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੀਏ.',
      hi_IN: 'मुझे क्षमा करें, मुझे समझ नहीं आया। फिर से कोशिश करते है।',
      ta_IN: 'மன்னிக்கவும். புரியவில்லை. மீண்டும் முயற்சிக்கவும்.',
      ma_IN: 'माफ करा, मला कळले नाही. चला पुन्हा प्रयत्न करूया.',
      kn_IN: 'ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸೋಣ.',
      te_IN: 'క్షమించండి. అర్థం కాలేదు. మరోసారి ప్రయత్నం చేయండి',
    },
    proceeding: {
      en_IN: 'I am sorry, I didn\'t understand. But proceeding nonetheless',
      hi_IN: 'सॉरी, मुझे समझ नहीं आया लेकिन फिर भी आगे बढ़ें।',
      ta_IN: 'மன்னிக்கவும், புரியவில்லை. இருந்தாலும் மீண்டும் முயற்சிக்கவும்.',
      ma_IN: 'माफ करा, मला कळले नाही. पण तरीही पुढे',
      kn_IN: 'ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ಆದರೆ ಪ್ರಕ್ರಿಯೆ ಮುಂದುವರೆಯಲಿದೆ',
      te_IN: 'నక్షమించండి. అర్థంకాలేదు. అయినా సరే కొనసాగించాలనుకుంటున్నారా',
    },
  },
  system_error: {
    en_IN: 'I am sorry, our system has a problem and I cannot fulfill your request right now. Could you try again in a few minutes please?',
    hi_IN: 'सॉरी, हमारे सिस्टम में कुछ दिक्कत है, हम आपकी रिक्वेस्ट को फिलहाल पूरा नहीं कर सकते। क्या आप थोड़ी देर में फिर से ट्राइ कर सकते हैं?',
    ta_IN: 'மன்னிக்கவும், எங்களது சிஸ்டத்தில் பிரச்சினை. உங்களது கோரிக்கையை தற்போது பரிசீலிக்க முடியவில்லை. சில நிமிடங்கள் கழித்து மீ ண்டும் முயற்சி செய்ய முடியுமா?',
    ma_IN: 'मला माफ करा, आमच्या सिस्टममध्ये समस्या आहे आणि मी आत्ताच आपली विनंती पूर्ण करू शकत नाही. कृपया काही मिनिटात पुन्हा प्रयत्न कराल का?',
    kn_IN: 'ಕ್ಷಮಿಸಿ, ನಮ್ಮ ಸಿಸ್ಟಮ್‌ನಲ್ಲಿ ಸಮಸ್ಯೆ ಇದೆ ಮತ್ತು ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಇದೀಗ ಪೂರೈಸಲು ಸಾಧ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಕೆಲವು ನಿಮಿಷಗಳ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    te_IN: 'క్షమించండి. సిస్టంలో సమస్య తలెత్తినందున మీ అభ్యర్థనను ఇప్పుడు స్వీకరించలేము. మరికొంత సమయం తర్వాత ప్రయత్నించగలరు',
  },
  [INTENTION_MORE]: {
    en_IN: 'See more ...',
    hi_IN: 'और देखें ...',
    ta_IN: 'மேலும் பார்க்க...',
    ma_IN: 'अजून पहा ...',
    kn_IN: 'ಇನ್ನಷ್ಟು ನೋಡಿ ...',
    te_IN: 'మరిన్ని వివరాలు ...',
  },
  [INTENTION_GOBACK]: { 
    en_IN: 'To go back ...',
    hi_IN: 'पीछे जाएं ...',
    ma_IN: 'परत जाण्यासाठी ...',
    ta_IN: 'திரும்பச் செல்ல ...',
    kn_IN: 'ಹಿಂತಿರುಗಿ ...',
    te_IN: 'వెనక్కు వెళ్లేందుకు ...',
  },
};

module.exports = {
  get_input, get_message, get_intention, INTENTION_UNKOWN, INTENTION_MORE, INTENTION_GOBACK, global_messages, constructListPromptAndGrammer, constructLiteralGrammer, validateInputType, sendMessage,constructContextGrammer
};
