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

  export const transferorDetails = getCommonCard(
    {
      header: getCommonTitle(
        {
          labelName: "Transferor Details",
          labelKey: "PT_MUTATION_TRANSFEROR_DETAILS"
        },
        {
          style: {
            marginBottom: 18
          }
        }
      ),
      body: getCommonContainer({
        transferorName: getLabelWithValue(
          {
            labelName: "Name",
            labelKey: "PT_MUTATION_TRANSFEROR_NAME"
          },
          {
            jsonPath: "FireNOCs[0].fireNOCDetails.fireNOCType"
            // callBack: value => {
            //   return value.split(".")[0];
            // }
          }
        ),
        guardianName: getLabelWithValue(
          {
            labelName: "Guardian's Name",
            labelKey: "PT_MUTATION_TRANSFEROR_GUARDIAN_NAME"
          },
          {
            jsonPath: "FireNOCs[0].provisionFireNOCNumber"
            // callBack: value => {
            //   return value.split(".")[1];
            // }
          }
        ),
        transferorGender: getLabelWithValue(
          {
            labelName: "Gender",
            labelKey: "PT_MUTATION_TRANSFEROR_GENDER"
          },
          {
            jsonPath: "FireNOCs[0].provisionFireNOCNumber"
            // callBack: value => {
            //   return value.split(".")[1];
            // }
          }
        ),
        transferorDOB: getLabelWithValue(
          {
            labelName: "Date Of Birth",
            labelKey: "PT_MUTATION_TRANSFEROR_DOB"
          },
          {
            jsonPath: "FireNOCs[0].provisionFireNOCNumber"
            // callBack: value => {
            //   return value.split(".")[1];
            // }
          }
        ),
        transferorMobile: getLabelWithValue(
          {
            labelName: "Mobile No.",
            labelKey: "PT_MUTATION_TRANSFEROR_MOBILE"
          },
          {
            jsonPath: "FireNOCs[0].provisionFireNOCNumber"
            // callBack: value => {
            //   return value.split(".")[1];
            // }
          }
        ),
        transferorEmail: getLabelWithValue(
          {
            labelName: "Email",
            labelKey: "PT_MUTATION_TRANSFEROR_EMAIL"
          },
          {
            jsonPath: "FireNOCs[0].provisionFireNOCNumber"
            // callBack: value => {
            //   return value.split(".")[1];
            // }
          }
        ),
        transferorSpecialCategory: getLabelWithValue(
          {
            labelName: "Special Category",
            labelKey: "PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY"
          },
          {
            jsonPath: "FireNOCs[0].provisionFireNOCNumber"
            // callBack: value => {
            //   return value.split(".")[1];
            // }
          }
        ),
        transferorCorrespondenceAddress: getLabelWithValue(
          {
            labelName: "Correspondence Address",
            labelKey: "PT_MUTATION_TRANSFEROR_CORRESPONDENCE_ADDRESS"
          },
          {
            jsonPath: "FireNOCs[0].provisionFireNOCNumber"
            // callBack: value => {
            //   return value.split(".")[1];
            // }
          }
        )
      })
    });

    






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
              transferReason: getSelectField({
                label: {
                  labelName: "Reason For Transfer",
                  labelKey: "PT_MUTATION_TRANSFER_REASON"
                },
                placeholder: {
                  labelName: "Select Reason for Transfer",
                  labelKey: "PT_MUTATION_TRANSFER_REASON_PLACEHOLDER"
                },
                required:true,
                jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].ownerType",
                sourceJsonPath: "applyScreenMdmsData.common-masters.OwnerType",
                localePrefix: {
                  moduleName: "common-masters",
                  masterName: "OwnerType"
                }
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
          //      jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].permanentAddress"
              }),
                documentIssueDateField :getDateField({
                label: { labelName: "Document Issue Date", labelKey: "PT_MUTATION_DOCUMENT_ISSUE_DATE" },
                placeholder: {
                  labelName: "Enter Document No.",
                  labelKey: "PT_MUTATION_DOCUMENT_ISSUE_DATE_PLACEHOLDER"
                },
                required: true,
                pattern: getPattern("Date"),
                jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].dob",
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
           //     jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].permanentAddress"
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
               // jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].permanentAddress"
              }),
            })
          }) ; 


              
              


             