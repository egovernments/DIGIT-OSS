import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonParagraph,
  getPattern,
  getDateField,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { searchApiCall } from "./functions";
import { resetFieldsForApplication } from '../../utils';
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from 'lodash/get';

export const searchApplications = getCommonCard({
  subHeader: getCommonTitle({
    labelKey: "WS_SEARCH_APPLICATION_SUB_HEADER"
  }),
  subParagraph: getCommonParagraph({
    labelKey: "WS_HOME_SEARCH_RESULTS_DESC"
  }),
  wnsApplicationSearch: getCommonContainer({
    consumerNo: getTextField({
      label: {
        labelKey: "WS_HOME_SEARCH_RESULTS_CONSUMER_NO_LABEL"
      },
      placeholder: {
        labelKey: "WS_HOME_SEARCH_RESULTS_CONSUMER_NO_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: getPattern("consumerNo"),
      errorMessage: "ERR_INVALID_CONSUMER_NO",
      jsonPath: "searchScreen.connectionNumber"
    }),
    applicationNo: getTextField({
      label: {
        labelKey: "WS_ACK_COMMON_APP_NO_LABEL"
      },
      placeholder: {
        labelKey: "WS_HOME_SEARCH_RESULTS_APP_NO_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: /^[a-zA-Z0-9-_/]*$/i,
      errorMessage: "ERR_INVALID_APPLICATION_NO",
      jsonPath: "searchScreen.applicationNumber"
    }),

    ownerMobNo: getTextField({
      label: {
        labelKey: "WS_HOME_SEARCH_RESULTS_OWN_MOB_LABEL"
      },
      placeholder: {
        labelKey: "WS_HOME_SEARCH_RESULTS_OWN_MOB_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      iconObj: {
        label: "+91 |",
        position: "start"
      },
      required: false,
      pattern: getPattern("MobileNo"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "searchScreen.mobileNumber"
    }),
    applicationType: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "AutosuggestContainer",
      jsonPath: "searchScreen.applicationType",
      localePrefix: {
        moduleName: "WS",
        masterName: "APPLICATION_TYPE"
      },
      props: {
        className: "autocomplete-dropdown",
        style: {
          width: "100%",
          cursor: "pointer",
          zIndex: 2000
        },
        label: { labelName: "To Date", labelKey: "WS_APPLICATION_TYPE_LABEL" },
        placeholder: { labelName: "Select to Date", labelKey: "WS_COMMON_APPLICATION_TYPE_PLACEHOLDER" },
        sourceJsonPath: "applyScreenMdmsData.searchScreen.applicationType",
        jsonPath: "searchScreen.applicationType",
        required: false,
        isClearable: true,
        labelsFromLocalisation: true,
        suggestions: [],
        fullwidth: true,
        inputLabelProps: {
          shrink: true
        },
        localePrefix: {
          moduleName: "WS",
          masterName: "APPLICATION_TYPE"
        },
      },
      required: false,
      gridDefination: { xs: 12, sm: 4 },
      beforeFieldChange: async (action, state, dispatch) => {
        if (action.value === "NEW WATER CONNECTION" || action.value ==="NEW SEWERAGE CONNECTION") {
          dispatch(
            prepareFinalObject(
              "appTypewithAppStatus",
              get(
                state.screenConfiguration.preparedFinalObject,
                "applyScreenMdmsData.searchScreen.applicationStatusNew"
              )
            )
          )
        } else if (action.value === "MODIFY WATER CONNECTION" || action.value ==="MODIFY SEWERAGE CONNECTION") {
          dispatch(
            prepareFinalObject(
              "appTypewithAppStatus",
              get(
                state.screenConfiguration.preparedFinalObject,
                "applyScreenMdmsData.searchScreen.applicationStatusModify"
              )
            )
          )
        }
      }
    },
    applicationstatus: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "AutosuggestContainer",
      jsonPath: "searchScreen.applicationStatus",
      props: {
        className: "autocomplete-dropdown",
        label: {
          labelKey: "WS_HOME_SEARCH_RESULTS_APP_STATUS_LABEL",
          labelName: "Status"
        },
        placeholder: {
          labelKey: "WS_HOME_SEARCH_RESULTS_APP_STATUS_PLACEHOLDER",
          labelName: "Select Placeholder"
        },
        required: false,
        isClearable: true,
        labelsFromLocalisation: true,
        jsonPath: "searchScreen.applicationStatus",
        sourceJsonPath: "appTypewithAppStatus",
      },
      required: false,
      gridDefination: { xs: 12, sm: 4 },
    },

    fromDate: getDateField({
      label: { labelName: "From Date", labelKey: "WS_COMMON_FROM_DATE_LABEL" },
      placeholder: {
        labelName: "Select From Date",
        labelKey: "WS_FROM_DATE_PLACEHOLDER"
      },
      jsonPath: "searchScreen.fromDate",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: getPattern("Date"),
      errorMessage: "ERR_INVALID_DATE"
    }),

    toDate: getDateField({
      label: { labelName: "To Date", labelKey: "WS_COMMON_TO_DATE_LABEL" },
      placeholder: {
        labelName: "Select to Date",
        labelKey: "WS_COMMON_TO_DATE_PLACEHOLDER"
      },
      jsonPath: "searchScreen.toDate",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_INVALID_DATE",
      required: false
    })
  }),

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      resetButton: {
        componentPath: "Button",
        gridDefination: { xs: 12, sm: 6 },
        props: {
          variant: "outlined",
          style: {
            color: "rgba(0, 0, 0, 0.6000000238418579)",
            borderColor: "rgba(0, 0, 0, 0.6000000238418579)",
            width: "220px",
            height: "48px",
            margin: "8px",
            float: "right"
          }
        },
        children: { buttonLabel: getLabel({ labelKey: "WS_SEARCH_CONNECTION_RESET_BUTTON" }) },
        onClickDefination: {
          action: "condition",
          callBack: resetFieldsForApplication
        }
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: { xs: 12, sm: 6 },
        props: {
          variant: "contained",
          style: {
            color: "white",
            margin: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "220px",
            height: "48px"
          }
        },
        children: { buttonLabel: getLabel({ labelKey: "WS_SEARCH_CONNECTION_SEARCH_BUTTON" }) },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall
        }
      },
    })
  })
});
