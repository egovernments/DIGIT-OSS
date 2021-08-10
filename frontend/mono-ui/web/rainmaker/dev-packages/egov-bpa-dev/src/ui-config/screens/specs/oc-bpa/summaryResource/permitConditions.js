import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabel,
  getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getConditionsInPermitList } from "../../utils/index";

const commonApplicantInformation = () => {
  return getCommonGrayCard({
    permitCard: getCommonContainer({
      mobileNumber: getTextField({
        placeholder: {
          labelName: "Enter question here",
          labelKey: "BPA_ENTER_QSTN_PLACEHOLDER"
        },
        required: true,
        props: {
          className: "applicant-details-error"
        },
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "BPA.tempAdded[0].conditions",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 12
        },
        afterFieldChange: (action, state, dispatch) => {
          getConditionsInPermitList(action, state, dispatch);
        }
      })
    })
  })
}

export const permitConditions = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "Permit Conditions",
          labelKey: "BPA_PERMIT_CONDITIONS"
        })
      }
    }
  },
  permitConditionsCard: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bpa",
    componentPath: "BpaConditionsContainer",
    props: {
      sourceJsonPath: "permitConditions"
    },
    type: "array"
  },
  multiCheckListContainers: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    children: {
      multipleApplicantInfo: {
        uiFramework: "custom-containers",
        componentPath: "MultiItem",
        props: {
          scheama: commonApplicantInformation(),
          items: [],
          addItemLabel: {
            labelName: "Add More",
            labelKey: "BPA_ADD_MORE"
          },
          sourceJsonPath: "BPA.tempAdded",
          prefixSourceJsonPath:
            "children.cardContent.children.permitCard.children"
        },
        type: "array"
      }
    }
  }
});
