import {
    getBreak,
      getCommonCard,
      getCommonGrayCard,
      getCommonContainer,
      getCommonTitle,
      getCommonSubHeader,
      getLabel,
    getLabelWithValue,
      getPattern,
      getSelectField,
      getTextField,
      getDateField    
    } from "egov-ui-framework/ui-config/screens/specs/utils";
    import { prepareFinalObject as pFO } from "egov-ui-framework/ui-redux/screen-configuration/actions";
    import {
      getDetailsForOwner,
      getTodaysDateInYMD,
    } from "../../utils";
    import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
    import get from "lodash/get";
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
        // transferReason: getSelectField({
        //   label: {
        //     labelName: "Reason For Transfer",
        //     labelKey: "PT_MUTATION_TRANSFER_REASON"
        //   },
        //   placeholder: {
        //     labelName: "Select Reason for Transfer",
        //     labelKey: "PT_MUTATION_TRANSFER_REASON_PLACEHOLDER"
        //   },
        //   required:true,
        //   jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].ownerType",
        //   sourceJsonPath: "applyScreenMdmsData.common-masters.OwnerType",
        //   localePrefix: {
        //     moduleName: "common-masters",
        //     masterName: "OwnerType"
        //   }
        // }),
        transferReason: getTextField({
          label: {
            labelName: "Reason for Transfer",
            labelKey: "PT_MUTATION_TRANSFER_REASON"
          },
          props:{
            className:"applicant-details-error"
          },
          placeholder: {
            labelName: "Select Reason for Transfer",
            labelKey: "PT_MUTATION_TRANSFER_REASON_PLACEHOLDER"
          },
          required:true,
          pattern: getPattern("Address"),
          jsonPath: "Property.additionalDetails.reasonForTransfer"
        }),

        marketValue: getTextField({
          label: {
            labelName: "Market Value",
            labelKey: "PT_MUTATION_MARKET_VALUE"
          },
          props:{
            className:"applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Market Value",
            labelKey: "PT_MUTATION_MARKET_VALUE_PLACEHOLDER"
          },
          required:true,
          pattern: getPattern("Address"),
        jsonPath: "Property.additionalDetails.marketValue"
        }),
        documentNumber: getTextField({
          label: {
            labelName: "Document No.",
            labelKey: "PT_MUTATION_DOCUMENT_NO"
          },
          props:{
            className:"applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Document No.",
            labelKey: "PT_MUTATION_DOCUMENT_NO_PLACEHOLDER"
          },
          required:true,
          pattern: getPattern("Address"),
          jsonPath: "Property.additionalDetails.documentNumber"
        }),
          documentIssueDateField :getDateField({
          label: { labelName: "Document Issue Date", labelKey: "PT_MUTATION_DOCUMENT_ISSUE_DATE" },
          placeholder: {
            labelName: "Enter Document No.",
            labelKey: "PT_MUTATION_DOCUMENT_ISSUE_DATE_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Date"),
          jsonPath: "Property.additionalDetails.documentDate",
          // props: {
          //   inputProps: {
          //     max: getTodaysDateInYMD()
          //   }
          // }
        }),
        documentValue: getTextField({
          label: {
            labelName: "Document Value",
            labelKey: "PT_MUTATION_DOCUMENT_VALUE"
          },
          props:{
            className:"applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Document Value",
            labelKey: "PT_MUTATION_DOCUMENT_VALUE_PLACEHOLDER"
          },
          required:true,
          pattern: getPattern("Address"),
        jsonPath: "Property.additionalDetails.documentValue",
        }),
        remarks: getTextField({
          label: {
            labelName: "Remarks",
            labelKey: "PT_MUTATION_REMARKS"
          },
          props:{
            className:"applicant-details-error"
          },
          placeholder: {
            labelName: "Enter Remarks if any",
            labelKey: "PT_MUTATION_REMARKS"
          },
          pattern: getPattern("Address"),
          jsonPath: "Property.additionalDetails.remarks",
        }),
      })
    }) ; 
