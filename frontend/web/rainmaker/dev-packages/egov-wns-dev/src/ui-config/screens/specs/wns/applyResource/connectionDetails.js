import { getCommonCard, getCommonSubHeader, getTextField, getSelectField, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";

export const getGenderRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: { xs: 12, sm: 12, md: 6 },
  jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].gender",
  props: {
    label: { key: "WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC" },
    buttons: [
      { labelName: "Yes", value: "MALE" },
      { labelName: "No", value: "FEMALE" },
    ],
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].gender",
    required: true
  },
  type: "array"
};

export const getCheckboxContainer = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-wns",
  componentPath: "CheckboxContainer",
  gridDefination: { xs: 12, sm: 12, md: 12 },
  props: {
    label: { key: "WS_APPLY_FOR" },
    buttons: [
      { labelName: "Water", labelKey: "WS_APPLY_WATER", value: "WS" },
      { labelName: "Sewerage", labelKey: "WS_APPLY_SEWERAGE", value: "SW" },
    ],
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].gender",
    required: true
  },
  type: "array"
};

export const OwnerInfoCard = getCommonCard({
  
  header: getCommonSubHeader(
    { labelName: "Connection Details", labelKey: "WS_COMMON_CONNECTION_DETAILS" },
    { style: { marginBottom: 18 } }
  ),

  tradeUnitCardContainer: getCommonContainer({
    getCheckboxContainer,
    oldConsumerNo: getTextField({
      label: { labelKey: "WS_SEARCH_CONNNECTION_OLD_CONSUMER_LABEL" },
      placeholder: { labelKey: "WS_SEARCH_CONNNECTION_OLD_CONSUMER_PLACEHOLDER" },
      gridDefination: { xs: 12, sm: 6 },
      required: false,
      pattern: /^[a-zA-Z0-9-]*$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "searchScreen.oldConnectionNumber"
    }),

    numberOfTaps: getTextField({
      label: { labelKey: "WS_SERV_DETAIL_NO_OF_TAPS" },
      placeholder: { labelName: "Number of taps" },
      gridDefination: { xs: 12, sm: 6 },
      jsonPath: "WaterConnection[0].noOfTaps"
    }),

    pipeSize: getSelectField({
      label: { labelKey: "WS_SERV_DETAIL_PIPE_SIZE" },
      placeholder: { labelName: "select size" },
      gridDefination: { xs: 12, sm: 6 },
      jsonPath: "WaterConnection[0].pipeSize"
    }),

    getGenderRadioButton
  })
});