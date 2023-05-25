import {
  getCommonCard,
  getCommonContainer,
  getCommonTitle,
  getDateField, getPattern,
  getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getTodaysDateInYMD
} from "../../utils";






export const registrationDetails = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Registration Details",
        labelKey: "PT_MUTATION_REGISTRATION_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    registrationDetailsContainer: getCommonContainer({
      transferReason: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-pt",
        componentPath: "AutosuggestContainer",
        props: {
          className: "autocomplete-dropdown",
          label: {
            labelName: "Reason for Transfer",
            labelKey: "PT_MUTATION_TRANSFER_REASON"
          },
          placeholder: {
            labelName: "Select Reason for Transfer",
            labelKey: "PT_MUTATION_TRANSFER_REASON_PLACEHOLDER"
          },
          required: true,
          isClearable: true,
          labelsFromLocalisation: true,
          localePrefix: {
            moduleName: "PropertyTax",
            masterName: "ReasonForTransfer"
          },
          sourceJsonPath: "ReasonForTransfer.PropertyTax.ReasonForTransfer",
          inputLabelProps: {
            shrink: true
          }
        },
        required: true,
        jsonPath:
          "Property.additionalDetails.reasonForTransfer",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      },

      marketValue: getTextField({
        label: {
          labelName: "Market Value",
          labelKey: "PT_MUTATION_MARKET_VALUE"
        },
        props: {
          className: "applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Market Value",
          labelKey: "PT_MUTATION_MARKET_VALUE_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("DocumentNo"),
        jsonPath: "Property.additionalDetails.marketValue"
      }),
      documentNumber: getTextField({
        label: {
          labelName: "Document No.",
          labelKey: "PT_MUTATION_DOCUMENT_NO"
        },
        props: {
          className: "applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Document No.",
          labelKey: "PT_MUTATION_DOCUMENT_NO_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("DocumentNo"),
        jsonPath: "Property.additionalDetails.documentNumber"
      }),
      documentIssueDateField: {
        ...getDateField({
          label: { labelName: "Document Issue Date", labelKey: "PT_MUTATION_DOCUMENT_ISSUE_DATE" },
          placeholder: {
            labelName: "Enter Document No.",
            labelKey: "PT_MUTATION_DOCUMENT_ISSUE_DATE_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Date"),
          isDOB: true,
          errorMessage: "PT_DOCUMENT_DATE_ERROR_MESSAGE",
          jsonPath: "Property.additionalDetails.documentDate",
          props: {
            inputProps: {
              max: getTodaysDateInYMD()
            }
          }
        })
      },

      documentValue: getTextField({
        label: {
          labelName: "Document Value",
          labelKey: "PT_MUTATION_DOCUMENT_VALUE"
        },
        props: {
          className: "applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Document Value",
          labelKey: "PT_MUTATION_DOCUMENT_VALUE_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("DocumentNo"),
        jsonPath: "Property.additionalDetails.documentValue",
      }),
      remarks: getTextField({
        label: {
          labelName: "Remarks",
          labelKey: "PT_MUTATION_REMARKS"
        },
        props: {
          className: "applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Remarks if any",
          labelKey: "PT_MUTATION_REMARKS"
        },
        //pattern: getPattern("Address"),
        jsonPath: "Property.additionalDetails.remarks",
      }),
    })
  });
