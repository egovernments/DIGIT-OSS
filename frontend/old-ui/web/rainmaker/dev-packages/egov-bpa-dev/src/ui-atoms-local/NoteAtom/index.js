import React from "react";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import {
  getTranslatedLabel,
  transformById
} from "../../ui-config/screens/specs/utils";
import { getLocalization } from "egov-ui-kit/utils/localStorageUtils";


const localizationLabels = JSON.parse(getLocalization("localization_en_IN"));

const getLocaleLabelsforTL = (label, labelKey, localizationLabels) => {
  let translatedLabel = "", keyValues;
  if(labelKey && Array.isArray(labelKey) && labelKey.length > 0) {
      labelKey.forEach(key => {
        if(typeof key == "number"){
          keyValues = key
        } else {
          keyValues = getTranslatedLabel(key, localizationLabels);
        }
        translatedLabel += keyValues + " ";
      })
  } else {
    translatedLabel = getTranslatedLabel(labelKey, localizationLabels);
  }
  return translatedLabel;
};

function NoteAtom(props) {
  let { labelKey, labelName, dynamicArray } = props;
  let transfomedKeys = transformById(localizationLabels, "code");
  let translatedLabel = getLocaleLabelsforTL(
    labelName,
    labelKey,
    transfomedKeys
  );
  return <div>{translatedLabel} </div>
}
export default NoteAtom;