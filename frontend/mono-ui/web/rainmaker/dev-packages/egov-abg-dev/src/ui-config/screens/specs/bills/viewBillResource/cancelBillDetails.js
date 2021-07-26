import {
  getCommonCard,
  getCommonContainer,
  getPattern, 
  getTextField,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";


export const cancelBillDetailsCard = getCommonCard(
  {
    searchContainer: getCommonContainer(
      {
        reason: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-abg",
          componentPath: "AutosuggestContainer",
          props: {
            label: {
              labelName: "Reason",
              labelKey: "BC_RECEIPT_CANCELLATION_REASON_LABEL"
            },
            localePrefix: {
              moduleName: "BC",
              masterName: "REASON"
            },
            optionLabel: "name",
            placeholder: {
              labelName: "Select Reason",
              labelKey: "BC_SELECT_RECEIPT_CANCELLATION_REASON_LABEL"
            },
            required: true,
            labelsFromLocalisation: true,
            isClearable: true,
            className: "autocomplete-dropdown",
            sourceJsonPath: "applyScreenMdmsData.reasonForBillCancel",
          },
          required: true,
          jsonPath: "UpdateBillCriteria.additionalDetails.reason",
          gridDefination: {
            xs: 12,
            sm: 8
          },
          beforeFieldChange: async (action, state, dispatch) => {
            const additionalDetailsJson = "components.div.children.cancelBillDetailsCard.children.cardContent.children.searchContainer.children.addtionalDetails";
            if (action.value == "OTHER") {
              dispatch(handleField('cancelBill', additionalDetailsJson, "props.disabled", false))
              // dispatch(handleField('cancelBill', additionalDetailsJson, "required", true))
              dispatch(handleField('cancelBill', additionalDetailsJson, "props.required", true))
            } else {
              dispatch(handleField('cancelBill', additionalDetailsJson, "props.disabled", true))
              dispatch(handleField('cancelBill', additionalDetailsJson, "required", false))
              dispatch(handleField('cancelBill', additionalDetailsJson, "props.required", false))
            }
            dispatch(handleField('cancelBill', additionalDetailsJson, "props.value", ""))
            dispatch(handleField('cancelBill', additionalDetailsJson, "props.error", false))
            return action;
          }
        },
        addtionalDetails: getTextField({
          label: {
            labelName: "Consumer Name",
            labelKey: "BC_MORE_DETAILS_LABEL"
          },
          placeholder: {
            labelName: "Enter Consumer Name",
            labelKey: "BC_SELECT_MORE_DETAILS_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 8
          },
          required: false,
          disabled: true,
          // multiline: true,
          // rows: "4",
          visible: true,
          pattern: getPattern("Address"),
          errorMessage: "Invalid Details.",
          jsonPath: "UpdateBillCriteria.additionalDetails.description"
        }),
        break1: getBreak(),
        break2: getBreak(),
        break3: getBreak(),
        break4: getBreak(),
        break5: getBreak(),
        break6: getBreak(),
        break7: getBreak(),
        break8: getBreak(),
        break9: getBreak(),
        break10: getBreak(),
      }
    )
  }
);

