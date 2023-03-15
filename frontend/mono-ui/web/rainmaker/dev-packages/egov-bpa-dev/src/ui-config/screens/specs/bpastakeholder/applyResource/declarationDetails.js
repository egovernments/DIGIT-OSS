import { getBreak, getCommonTitle, getCommonContainer, getCommonGrayCard, getCommonSubHeader, getLabel, getLabelWithValue } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getLocaleLabels, getTransformedLocalStorgaeLabels } from "egov-ui-framework/ui-utils/commons";

const declarationDetails = getCommonContainer({
  checkbox: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bpa",
    componentPath: "BpaCheckboxContainer",
    jsonPath: "LicensesTemp.isDeclared",
    props: {
      label: {
        labelName: "I hereby Solemnly affirm and declare that the information as furnished is true and correct to the best of my knowledge and belief. I/ We have not been barred for building construction activities by any competent authority and further undertake that if any information at any stage shall be found to be false, my registration shall be liable to be canceled without any prior notice in that regard and I shall not claim any compensation etc. for such a default on my part. In case of any discrepancies found later, I shall be liable for punishment under the relevant provisions of Law as also under Municipal Act and the Act.",
        labelKey: ["BPAREG_BUILDER_1_DECLARAION_LABEL", "BPAREG_BUILDER_2_DECLARAION_LABEL"]
      },
      jsonPath: "LicensesTemp.isDeclared",
    },
    visible: process.env.REACT_APP_NAME === "Citizen" ? true : false,
    type: "array"
  },
  checkbox2: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bpa",
    componentPath: "BpaCheckboxContainer",
    jsonPath: "LicensesTemp.isDeclared",
    props: {
      label: {
        labelName: "I hereby Solemnly affirm and declare that the information as furnished is true and correct to the best of my knowledge and belief. I further undertake that if any information at any stage shall be found to be false, my registration shall be liable to be canceled without any prior notice in that regard and I shall not claim any compensation etc. for such default on my part. In case of any discrepancies found later, I shall be liable for punishment under the relevant provisions of Law as also under Municipal Act and the Act.",
        labelKey: ["BPAREG_TECHNICAL_1_DECLARAION_LABEL", "BPAREG_TECHNICAL_2_DECLARAION_LABEL"]
      },
      jsonPath: "LicensesTemp.isDeclared",
    },
    visible: process.env.REACT_APP_NAME === "Citizen" ? true : false,
    type: "array"
  }
});

export const declarationSummary = getCommonContainer({
  headers: getCommonTitle(
    {
      labelName: "Declaration",
      labelKey: "BPA_DECLARATION_TITLE"
    },
    {
      style: {
        marginBottom: 10,
        marginTop: 18
      }
    }
  ),
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        margin: "10px"
      }
    },
    children: {
      body: declarationDetails
    }
  },

});
