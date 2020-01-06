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
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const resetFields = (state, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.wnsApplication.children.cardContent.children.wnsApplicationContainer.children.consumerNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.wnsApplication.children.cardContent.children.wnsApplicationContainer.children.ownerMobNo",
      "props.value",
      ""
    )
  );
  // dispatch(
  //   handleField(
  //     "search",
  //     "components.div.children.wnsApplication.children.cardContent.children.wnsApplicationContainer.children.applicationstatus",
  //     "props.value",
  //     ""
  //   )
  // );
  // dispatch(
  //   handleField(
  //     "search",
  //     "components.div.children.wnsApplication.children.cardContent.children.wnsApplicationContainer.children.applicationNo",
  //     "props.value",
  //     ""
  //   )
  // );
  // dispatch(
  //   handleField(
  //     "search",
  //     "components.div.children.wnsApplication.children.cardContent.children.wnsApplicationContainer.children.fromDate",
  //     "props.value",
  //     ""
  //   )
  // );
  // dispatch(
  //   handleField(
  //     "search",
  //     "components.div.children.wnsApplication.children.cardContent.children.wnsApplicationContainer.children.toDate",
  //     "props.value",
  //     ""
  //   )
  // );
};

export const wnsApplication = getCommonCard({
  subHeader: getCommonTitle({
    labelKey: "WS_SEARCH_CONNECTION_HEADER"
  }),
  subParagraph: getCommonParagraph({
    labelKey: "WS_HOME_SEARCH_RESULTS_DESC"
  }),
  wnsApplicationContainer: getCommonContainer({
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
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "searchScreen.connectionNumber"
    }),


    // applicationNo: getTextField({
    //   label: {
    //     labelKey: "WS_HOME_SEARCH_RESULTS_APP_NO_LABEL"
    //   },
    //   placeholder: {
    //     labelKey: "WS_HOME_SEARCH_RESULTS_APP_NO_PLACEHOLDER"
    //   },
    //   gridDefination: {
    //     xs: 12,
    //     sm: 4
    //   },
    //   required: false,
    //   pattern: /^[a-zA-Z0-9-]*$/i,
    //   // errorMessage: "ERR_INVALID_CONSUMER_NO",
    //   // jsonPath: "searchScreen.applicationNumber"
    // }),

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
    // applicationstatus: getSelectField({
    //   label: {
    //     labelKey: "WS_HOME_SEARCH_RESULTS_APP_STATUS_LABEL"
    //   },
    //   placeholder: {
    //     labelKey: "WS_HOME_SEARCH_RESULTS_APP_STATUS_PLACEHOLDER"
    //   },
    //   required: false,
    //   localePrefix: {
    //     moduleName: "WF",
    //     masterName: "NEWTL"
    //   },
    //   jsonPath: "searchScreen.status",
    //   sourceJsonPath: "applyScreenMdmsData.searchScreen.status",
    //   gridDefination: {
    //     xs: 12,
    //     sm: 4
    //   },
    //   // required: true,
    //   errorMessage: "ERR_INVALID_BILLING_PERIOD",
    //   jsonPath: "searchScreen.status"
    // }),

    // fromDate: getDateField({
    //   label: { labelName: "From Date", labelKey: "WS_COMMON_FROM_DATE_LABEL" },
    //   placeholder: {
    //     labelName: "Select From Date",
    //     labelKey: "WS_FROM_DATE_PLACEHOLDER"
    //   },
    //   jsonPath: "searchScreen.fromDate",
    //   gridDefination: {
    //     xs: 12,
    //     sm: 4
    //   },
    //   // required: true,
    //   pattern: getPattern("Date"),
    //   errorMessage: "ERR_INVALID_DATE",
    //   jsonPath: "searchScreen.billingPeriodValue"
    // }),

    // toDate: getDateField({
    //   label: { labelName: "To Date", labelKey: "WS_COMMON_TO_DATE_LABEL" },
    //   placeholder: {
    //     labelName: "Select to Date",
    //     labelKey: "WS_COMMON_TO_DATE_PLACEHOLDER"
    //   },
    //   jsonPath: "searchScreen.toDate",
    //   gridDefination: {
    //     xs: 12,
    //     sm: 4
    //   },
    //   pattern: getPattern("Date"),
    //   errorMessage: "ERR_INVALID_DATE",
    //   required: false
    // })
  }),

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 6,
          sm: 6,
          align: "center"
        },
        props: {
          variant: "outlined",
          style: {
            color: "#FE7A51",
            borderColor: "#FE7A51",
            width: "85%",
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelKey: "WS_SEARCH_CONNECTION_RESET_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: resetFields
        }
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 6,
          sm: 6,
          align: "center"
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "85%",
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
