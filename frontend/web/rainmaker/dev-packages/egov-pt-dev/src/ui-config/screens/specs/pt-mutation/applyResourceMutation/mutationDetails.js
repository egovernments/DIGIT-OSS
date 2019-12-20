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
            getMutationPendingRadioButton : {
              uiFramework: "custom-containers",
              componentPath: "RadioGroupContainer",
              gridDefination: {
                xs: 12,
                sm: 12,
                md: 6
              },
              jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].relationship",
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
               // jsonPath:"Licenses[0].tradeLicenseDetail.owners[0].relationship",
                required: true
              },
              required: true,
              type: "array"
            },

            getMutationStateAcquisitionRadioButton : {
              uiFramework: "custom-containers",
              componentPath: "RadioGroupContainer",
              gridDefination: {
                xs: 12,
                sm: 12,
                md: 6
              },
              jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].relationship",
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
                //jsonPath:"Licenses[0].tradeLicenseDetail.owners[0].relationship",
                required: true
              },
              required: true,
              type: "array"
            },

            courtCaseDetails: getTextField({
              label: {
                labelName: "Details of Court Case",
                labelKey: "PT_MUTATION_COURT_CASE_DETAILS"
              },
              props:{
                className:"applicant-details-error"
              },
              placeholder: {
                labelName: "Enter Details of Court Case",
                labelKey: "PT_MUTATION_COURT_CASE_DETAILS_PLACEHOLDER"
              },
              pattern: getPattern("Address"),
      //        jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].permanentAddress"
            }),
            govtAcquisitionDetails: getTextField({
              label: {
                labelName: "Details of Government Acquisition",
                labelKey: "PT_MUTATION_GOVT_ACQUISITION_DETAILS"
              },
              props:{
                className:"applicant-details-error"
              },
              placeholder: {
                labelName: "Enter Details of Govt Acquisition",
                labelKey: "PT_MUTATION_GOVT_ACQUISITION_DETAILS_PLACEHOLDER"
              },
              pattern: getPattern("Address"),
           //   jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].permanentAddress"
            }),

          })
        });

        

              
              


             