import { transformLocalizationLabels } from "egov-ui-kit/utils/commons";
import { getLocalization } from "egov-ui-kit/utils/localStorageUtils";

export const initLocalizationLabels = (locale) => {
  let localizationLabels;
  try {
    localizationLabels = getLocalization(`localization_${locale}`);
    localizationLabels = JSON.parse(localizationLabels);
    localizationLabels = transformLocalizationLabels(localizationLabels);
  } catch (error) {
    localizationLabels = {};
  }

  return localizationLabels;
};
