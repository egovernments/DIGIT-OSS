import {
  getCommonCard,
  getCommonContainer,
  getCommonTitle,
  getPattern,
  getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";


export const mutationDetails = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Mutation Details",
        labelKey: "PT_MUTATION_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    mutationDetailsContainer: getCommonContainer({
      getMutationPendingRadioButton: {
        uiFramework: "custom-containers",
        componentPath: "RadioGroupContainer",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        jsonPath: "Property.additionalDetails.isMutationInCourt",
        props: {
          label: {
            name: "Is Mutation Pending in Court?",
            key: "PT_MUTATION_COURT_PENDING_OR_NOT"
          },
          buttons: [
            {
              labelName: "Yes",
              labelKey: "PT_MUTATION_PENDING_YES",
              value: "YES"
            },
            {
              label: "No",
              labelKey: "PT_MUTATION_PENDING_NO",
              value: "NO"
            }
          ],
          // jsonPath:"Property.additionalDetails.isMutationInCourt",
          required: true
        },
        required: true,
        type: "array",
        beforeFieldChange: (action, state, dispatch) => {
          const courtCaseJsonPath = "components.div.children.formwizardFirstStep.children.mutationDetails.children.cardContent.children.mutationDetailsContainer.children.courtCaseDetails";
          if (action.value === "NO") {
            dispatch(handleField("apply", courtCaseJsonPath, "props.disabled", true));
            dispatch(handleField("apply", courtCaseJsonPath, "props.value", ""));
            dispatch(handleField("apply", courtCaseJsonPath, "props.helperText", ""));
            dispatch(handleField("apply", courtCaseJsonPath, "props.error", false));
          } else {
            dispatch(handleField("apply", courtCaseJsonPath, "props.disabled", false));
          }
        }
      },
      courtCaseDetails: getTextField({
        label: {
          labelName: "Details of Court Case",
          labelKey: "PT_MUTATION_COURT_CASE_DETAILS"
        },
        props: {
          className: "applicant-details-error",
        },
        placeholder: {
          labelName: "Enter Details of Court Case",
          labelKey: "PT_MUTATION_COURT_CASE_DETAILS_PLACEHOLDER"
        },
        pattern: getPattern("Address"),
        jsonPath: "Property.additionalDetails.caseDetails"
      }),
      getMutationStateAcquisitionRadioButton: {
        uiFramework: "custom-containers",
        componentPath: "RadioGroupContainer",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        jsonPath: "Property.additionalDetails.isPropertyUnderGovtPossession",
        props: {
          label: {
            name: "Is Property or Part of Property under State/Central Government Acquisition? ",
            key: "PT_MUTATION_STATE_ACQUISITION"
          },
          buttons: [
            {
              labelName: "Yes",
              labelKey: "PT_MUTATION_STATE_ACQUISITION_YES",
              value: "YES"
            },
            {
              label: "No",
              labelKey: "PT_MUTATION_STATE_ACQUISITION_NO",
              value: "NO"
            }
          ],
          // jsonPath:"Property.additionalDetails.isPropertyUnderGovtPossession",
          required: true
        },
        required: true,
        type: "array",
        beforeFieldChange: (action, state, dispatch) => {
          const courtCaseJsonPath = "components.div.children.formwizardFirstStep.children.mutationDetails.children.cardContent.children.mutationDetailsContainer.children.govtAcquisitionDetails";
          if (action.value === "NO") {
            dispatch(handleField("apply", courtCaseJsonPath, "props.disabled", true));
            dispatch(handleField("apply", courtCaseJsonPath, "props.value", ""));
            dispatch(handleField("apply", courtCaseJsonPath, "props.helperText", ""));
            dispatch(handleField("apply", courtCaseJsonPath, "props.error", false));
          } else {
            dispatch(handleField("apply", courtCaseJsonPath, "props.disabled", false));
          }
        }
      },
      govtAcquisitionDetails: getTextField({
        label: {
          labelName: "Details of Government Acquisition",
          labelKey: "PT_MUTATION_GOVT_ACQUISITION_DETAILS"
        },
        props: {
          className: "applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Details of Govt Acquisition",
          labelKey: "PT_MUTATION_GOVT_ACQUISITION_DETAILS_PLACEHOLDER"
        },
        pattern: getPattern("Address"),
        jsonPath: "Property.additionalDetails.govtAcquisitionDetails"
      }),

    })
  });
