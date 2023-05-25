import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonParagraph,
  getPattern,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { searchApiCall } from "./functions";
import { resetFieldsForConnection } from '../../utils';

export const wnsApplication = getCommonCard({
  subHeader: getCommonTitle({
    labelKey: "WS_SEARCH_CONNECTION_SUB_HEADER"
  }),
  subParagraph: getCommonParagraph({
    labelKey: "WS_HOME_SEARCH_CONN_RESULTS_DESC"
  }),
  wnsApplicationContainer: getCommonContainer({
    city: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-hrms",
      componentPath: "AutosuggestContainer",
      jsonPath: "searchConnection.tenantId",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      props: {
        optionLabel: "name",
        optionValue: "code",
        label: {
          labelName: "ULB",
          labelKey: "WS_PROP_DETAIL_CITY"
        },
        placeholder: {
          labelName: "Select ULB",
          labelKey: "WS_PROP_DETAIL_CITY_PLACEHOLDER"
        },
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS"
        },
        className: "autocomplete-dropdown",
        sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
        jsonPath: "searchConnection.tenantId",
        labelsFromLocalisation: true,
        required: true,
        disabled: true,
        isDisabled:true,
      },
      required: true,
      disabled: true,
      isDisabled:true,
    },
    propertyid: getTextField({
        label: {
            labelKey: "WS_PROPERTY_ID_LABEL"
        },
        placeholder: {
            labelKey: "WS_PROPERTY_ID_PLACEHOLDER"
        },
        gridDefination: {
            xs: 12,
            sm: 4
        },
        required: false,
        pattern: /^[a-zA-Z0-9-]*$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "searchConnection.propertyId"
    }),
    ownerMobNo: getTextField({
        label: {
            labelKey: "WS_HOME_SEARCH_RESULTS_OWN_MOB_LABEL"
        },
        placeholder: {
            labelKey: "WS_OWN_DETAIL_MOBILE_NO_PLACEHOLDER"
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
        jsonPath: "searchConnection.mobileNumber",
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
    }),
    consumerid: getTextField({
        label: {
            labelKey: "WS_MYCONNECTIONS_CONSUMER_NO"
        },
        placeholder: {
            labelKey: "WS_SEARCH_CONNNECTION_CONSUMER_PLACEHOLDER"
        },
        gridDefination: {
            xs: 12,
            sm: 4
        },
        required: false,
        pattern: getPattern("consumerNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "searchConnection.connectionNumber"
    }),
    oldConsumerid: getTextField({
        label: {
            labelKey: "WS_SEARCH_CONNNECTION_OLD_CONSUMER_LABEL"
        },
        placeholder: {
            labelKey: "WS_SEARCH_CONNNECTION_OLD_CONSUMER_PLACEHOLDER"
        },
        gridDefination: {
            xs: 12,
            sm: 4
        },
        required: false,
        pattern: /^[a-zA-Z0-9-]*$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "searchConnection.oldConnectionNumber"
    })
  }),

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6
          // align: "center"
        },
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
        children: {
          buttonLabel: getLabel({
            labelKey: "WS_SEARCH_CONNECTION_RESET_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: resetFieldsForConnection
        }
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6,
          // align: "center"
        },
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
        children: {
          buttonLabel: getLabel({
            labelKey: "WS_SEARCH_CONNECTION_SEARCH_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall
        }
      },
    })
  })
});