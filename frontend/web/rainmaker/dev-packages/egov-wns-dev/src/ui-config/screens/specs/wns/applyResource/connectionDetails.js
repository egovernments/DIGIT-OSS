import { getCommonCard, getCommonSubHeader, getTextField, getSelectField, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";

// export const getGenderRadioButton = {
//   uiFramework: "custom-containers",
//   componentPath: "RadioGroupContainer",
//   gridDefination: { xs: 12, sm: 12, md: 6 },
//   jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].gender",
//   props: {
//     label: { key: "WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC" },
//     buttons: [
//       { labelKey:"HARVESTING_SCORE_YES", value: "Yes" },
//       { labelKey:"HARVESTING_SCORE_NO", value: "No" },
//     ],
//     jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].gender",
//     required: true
//   },
//   type: "array"
// };

export const getCheckboxContainer = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-wns",
  componentPath: "CheckboxContainer",
  gridDefination: { xs: 12, sm: 12, md: 12 },
  props: {
    jsonPathSewerage: "applyScreen.sewerage",
    jsonPathWater: "applyScreen.water",
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

    numberOfTaps: getTextField({
      label: { labelKey: "WS_CONN_DETAIL_NO_OF_TAPS" },
      placeholder: { labelKey: "WS_SERV_DETAIL_NO_OF_TAPS_PLACEHOLDER" },
      gridDefination: { xs: 12, sm: 6 },
      jsonPath: "applyScreen.noOfTaps"
    }),

    pipeSize: getSelectField({
      label: { labelKey: "WS_CONN_DETAIL_PIPE_SIZE" },
      placeholder: { labelKey: "WS_SERV_DETAIL_PIPE_SIZE_PLACEHOLDER" },
      gridDefination: { xs: 12, sm: 6 },
      jsonPath: "applyScreen.pipeSize"
    }),

    numberOfWaterClosets: getTextField({
      label: { labelKey: "WS_CONN_DETAIL_NO_OF_WATER_CLOSETS" },
      placeholder: { labelKey: "WS_CONN_DETAIL_NO_OF_WATER_CLOSETS_PLACEHOLDER" },
      gridDefination: { xs: 12, sm: 6 },
      jsonPath: "applyScreen.numberOfWaterClosets"
    }),

    numberOfToilets: getTextField({
      label: { labelKey: "WS_ADDN_DETAILS_NO_OF_TOILETS" },
      placeholder: { labelKey: "WS_ADDN_DETAILS_NO_OF_TOILETS_PLACEHOLDER" },
      gridDefination: { xs: 12, sm: 6 },
      jsonPath: "applyScreen.numberOfToilets"
    }),

    // getGenderRadioButton
  })
});