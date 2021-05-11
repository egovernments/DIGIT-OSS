import { getCommonCard, getPattern, getCommonSubHeader, getTextField, getSelectField, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";

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
    required: true,
    disabled: false
  },
  type: "array",
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
      required: true,
      jsonPath: "applyScreen.proposedTaps",
      pattern: /^[0-9]*$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    }),
    pipeSize: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "AutosuggestContainer",
      jsonPath: "applyScreen.proposedPipeSize",
      props: {
        className:"applicant-details-error autocomplete-dropdown",
        label: { labelKey: "WS_CONN_DETAIL_PIPE_SIZE", labelName: "Pipe Size" },
        placeholder: { labelKey: "WS_SERV_DETAIL_PIPE_SIZE_PLACEHOLDER", labelName: "Select Pipe Size" },
        required: true,
        isClearable: true,
        labelsFromLocalisation: true,
        jsonPath: "applyScreen.proposedPipeSize",
        sourceJsonPath: "applyScreenMdmsData.ws-services-calculation.pipeSize",
        inputLabelProps: {
          shrink: true
        },
        suggestions: [],
        fullwidth: true,
      },
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
    },
    numberOfWaterClosets: getTextField({
      label: { labelKey: "WS_CONN_DETAIL_NO_OF_WATER_CLOSETS" },
      placeholder: { labelKey: "WS_CONN_DETAIL_NO_OF_WATER_CLOSETS_PLACEHOLDER" },
      gridDefination: { xs: 12, sm: 6 },
      required: true,
      jsonPath: "applyScreen.proposedWaterClosets",
      pattern: /^[0-9]*$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    }),

    numberOfToilets: getTextField({
      label: { labelKey: "WS_ADDN_DETAILS_NO_OF_TOILETS" },
      placeholder: { labelKey: "WS_ADDN_DETAILS_NO_OF_TOILETS_PLACEHOLDER" },
      required: true,
      gridDefination: { xs: 12, sm: 6 },
      jsonPath: "applyScreen.proposedToilets",
      pattern: /^[0-9]*$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    })
  })
});