
import {
  localStorageSet,
  localStorageGet,
  getLocalization,
  getLocale
} from "egov-ui-kit/utils/localStorageUtils";

export const transformById = (payload, id) => {
    return (
      payload &&
      payload.reduce((result, item) => {
        result[item[id]] = {
          ...item
        };
  
        return result;
      }, {})
    );
  };
export const getTranslatedLabel = (labelKey, localizationLabels) => {
  let translatedLabel = null;
  if (localizationLabels && localizationLabels.hasOwnProperty(labelKey)) {
    translatedLabel = localizationLabels[labelKey];
    if (
      translatedLabel &&
      typeof translatedLabel === "object" &&
      translatedLabel.hasOwnProperty("message")
    )
      translatedLabel = translatedLabel.message;
  }
  return translatedLabel || labelKey;
};

export const getLocaleLabels = (labelKey,  localizationLabels) => {
  if (!localizationLabels)
    localizationLabels = transformById(
      JSON.parse(getLocalization(`localization_${getLocale()}`)),
      "code"
    );
  if (labelKey) {
    let translatedLabel = getTranslatedLabel(labelKey, localizationLabels);
    if (!translatedLabel || labelKey === translatedLabel) {
      return translatedLabel;
    } else {
      return translatedLabel;
    }
  } else {
    return labelKey;
  }
};
//localizations
export const getTransformedLocale = label => {
  return label&&label.toUpperCase().replace(/[.:-\s\/]/g, "_");
};