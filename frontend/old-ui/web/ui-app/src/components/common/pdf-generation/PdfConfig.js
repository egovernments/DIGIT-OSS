//Refer this http://kourge.net/projects/regexp-unicode-block for particular language unicode range
const DEVANAGIRI_UNICODE_RANGE_REGEX = /[\u0900-\u097F]+/g;
const DEVANAGARI_FONT_NAME = 'Devanagari';

export const fonts = {
  Devanagari: {
    normal: 'NotoSansDevanagari-Regular.ttf',
    bold: 'NotoSansDevanagari-Bold.ttf',
    italics: 'NotoSansDevanagari-Regular.ttf',
    bolditalics: 'NotoSansDevanagari-Bold.ttf',
  },
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Bold.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-BoldItalic.ttf',
  },
};

export function writeMultiLanguageText(text, style) {
  var otherLangTexts = text.match(DEVANAGIRI_UNICODE_RANGE_REGEX);

  if (!otherLangTexts || otherLangTexts.length === 0) return [{ text: text, style: style }];

  var langArry = [];
  for (var i = 0; i < otherLangTexts.length; i++) {
    langArry[i] = {
      text: otherLangTexts[i],
      style: style ? { ...style, font: DEVANAGARI_FONT_NAME } : { font: DEVANAGARI_FONT_NAME },
    };
    text = text.replace(otherLangTexts[i], '~~{{' + i + '}}~~');
  }

  var generatedTxts = text.split(/~~/g);

  for (i = 0; i < generatedTxts.length; i++) {
    //condition it's other language
    if (generatedTxts[i].match(/{{\d+}}/g)) {
      let index = generatedTxts[i].match(/\d+/g);
      generatedTxts[i] = langArry[index];
    } else if (style) {
      //apply style from param
      generatedTxts[i] = { text: generatedTxts[i], style: style };
    }
  }

  return generatedTxts;
}

export const getBase64FromImageUrl = (url, mimeType) => {
  return new Promise(function(resolve, reject) {
    var image = new Image();
    image.setAttribute('crossOrigin', 'anonymous'); //getting images from external domain

    image.onload = function() {
      var canvas = document.createElement('canvas');
      canvas.width = this.naturalWidth;
      canvas.height = this.naturalHeight;
      //next three lines for white background in case png has a transparent background
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff'; /// set white fill style
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      canvas.getContext('2d').drawImage(this, 0, 0);
      var base64Img = canvas.toDataURL(mimeType || 'image/png');
      resolve({ image: base64Img });
    };

    image.onerror = function() {
      reject({
        message: `Oops! Something isn't right. Please try again later.`,
      });
    };

    image.src = url;
  });
};
