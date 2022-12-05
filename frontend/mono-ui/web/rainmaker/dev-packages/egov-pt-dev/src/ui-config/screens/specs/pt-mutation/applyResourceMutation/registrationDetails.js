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
import mutationReasonData from "./registrationDetails.json";

  
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
            required:true,
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
          required:true,
          jsonPath:
          "Property.additionalDetails.reasonForTransfer",
          gridDefination: {
            xs: 12,
            sm: 12,
            md: 6
          },
          afterFieldChange: async (action, state, dispatch) => {
            let fields = ["marketValue","powerOfAttorneyRegNo","powerOfAttorneyRegDate","documentNumber","documentIssueDateField",
            "documentValue","remarks","NameAndAddressOfWitnesses","DateOfWritingWill","NameOfAuctionAuthority","AuctionDate",
            "AuctionRegistrationnumber",
            "AuctionRegistrationDate","SerialNumber",
            "IssuingAuthority",
            "IssuingDate", "CourtName",
            "DecreeNo",
            "DecreeDate",
            "IsThereAnyStayOrderOnCourtDecreeByUpperCourt",
            "DetailsOfUpperCourtStayOrder"];
            fields && fields.map((item)=>{
              dispatch(
                handleField(
                    "apply",
                    `components.div.children.formwizardFirstStep.children.registrationDetails.children.cardContent.children.registrationDetailsContainer.children.${item}`,
                    "visible",
                    false
                )
            );
            })
            let mutationReason = mutationReasonData[action.value];
            mutationReason && mutationReason.map((item, index) => {
              fields && fields.includes(item) && dispatch(
                handleField(
                  "apply",
                  `components.div.children.formwizardFirstStep.children.registrationDetails.children.cardContent.children.registrationDetailsContainer.children.${item}`,
                  "visible",
                  true
                )
              );
            })
            mutationReason && mutationReason.map((item, index) => {
              fields && fields.includes(item) && dispatch(
                handleField(
                  "apply",
                  `components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.registrationSummary.children.cardContent.children.cardOne.children.cardContent.children.propertyLocationContainer.children.${item}.visible`,
                  "visible",
                  true
                )
              );
            })
            
          }
        },

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
        pattern: getPattern("Amount"),
      jsonPath: "Property.additionalDetails.marketValue",
      visible: false,
      }),
      AuctionRegistrationnumber: getTextField({
        label: {
          labelName: "Auction Registration No.",
          labelKey: "PT_MUTATION_AUCTION_REGISTRATION_NO"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Auction Registration No.",
          labelKey: "PT_MUTATION_AUCTION_REGISTRATION_NO_PLACEHOLDER"
        },
        required:true,
        pattern: getPattern("RegNo"),
        jsonPath: "Property.additionalDetails.AuctionRegistrationnumber",
        visible: false,
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
        pattern: getPattern("RegNo"),
        jsonPath: "Property.additionalDetails.documentNumber",
        visible: false,
      }),
      SerialNumber: getTextField({
        label: {
          labelName: "Serial No.",
          labelKey: "PT_MUTATION_SERIAL_NO"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Serial No.",
          labelKey: "PT_MUTATION_SERIAL_NO_PLACEHOLDER"
        },
        required:true,
        pattern: getPattern("RegNo"),
        jsonPath: "Property.additionalDetails.SerialNumber",
        visible: false,
      }),
      powerOfAttorneyRegNo: getTextField({
        label: {
          labelName: "powerOfAttorneyRegNo",
          labelKey: "PT_MUTATION_ATTORNEY_REG_NO"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Attorney Registration Number",
          labelKey: "PT_MUTATION_ATTORNEY_REG_NO_PLACEHOLDER"
        },
        required:true,
        pattern: getPattern("RegNo"),
        jsonPath: "Property.additionalDetails.powerOfAttorneyRegNo",
        visible: false,
      }),
       powerOfAttorneyRegDate: {
        ...getDateField({
          label: { labelName: "Power Of Attorney Reg Date", labelKey: "PT_MUTATION_POWERATT_REG_DATE" },
          placeholder: {
            labelName: "Enter Power Of Attorney Reg Date",
            labelKey: "PT_MUTATION_POWERATT_REG_DATE_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Date"),
          isDOB: true,
          errorMessage: "PT_DOCUMENT_DATE_ERROR_MESSAGE",
          jsonPath: "Property.additionalDetails.powerOfAttorneyRegDate",
          visible: false,
          props: {
            inputProps: {
              max: getTodaysDateInYMD()
            }
          }
        })
      },
      DecreeNo: getTextField({
        label: {
          labelName: "DecreeNo",
          labelKey: "PT_MUTATION_DECREE_NO"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Decree No",
          labelKey: "PT_MUTATION_DECREE_NO_PLACEHOLDER"
        },
        required:true,
        pattern: getPattern("RegNo"),
        jsonPath: "Property.additionalDetails.DecreeNo",
        visible: false,
      }),
      AuctionRegistrationDate: {
        ...getDateField({
          label: { labelName: "Auction Registration Date", labelKey: "PT_MUTATION_AUCTION_REGISTRATION_DATE" },
          placeholder: {
            labelName: "Enter Auction Registration Date",
            labelKey: "PT_MUTATION_AUCTION_REGISTRATION_DATE_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Date"),
          isDOB: true,
          errorMessage: "PT_DOCUMENT_DATE_ERROR_MESSAGE",
          jsonPath: "Property.additionalDetails.AuctionRegistrationDate",
          visible: false,
          props: {
            inputProps: {
              max: getTodaysDateInYMD()
            }
          }
        })
      },
      DecreeDate: {
        ...getDateField({
          label: { labelName: "Decree Date", labelKey: "PT_MUTATION_DECREE_DATE" },
          placeholder: {
            labelName: "Enter Decree Date",
            labelKey: "PT_MUTATION_DECREE_DATE_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Date"),
          isDOB: true,
          errorMessage: "PT_DOCUMENT_DATE_ERROR_MESSAGE",
          jsonPath: "Property.additionalDetails.DecreeDate",
          visible: false,
          props: {
            inputProps: {
              max: getTodaysDateInYMD()
            }
          }
        })
      },
            documentIssueDateField: {
        ...getDateField({
          label: { labelName: "Document Issue Date", labelKey: "PT_MUTATION_DOCUMENT_ISSUE_DATE" },
          placeholder: {
            labelName: "Enter Document Issue Date",
            labelKey: "PT_MUTATION_DOCUMENT_ISSUE_DATE_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Date"),
          isDOB: true,
          errorMessage: "PT_DOCUMENT_DATE_ERROR_MESSAGE",
          jsonPath: "Property.additionalDetails.documentDate",
          visible: false,
          props: {
            inputProps: {
              max: getTodaysDateInYMD()
            }
          }
        })
      },
      DateOfWritingWill:{
      ...getDateField({
        label: { labelName: "Date of writing will", labelKey: "PT_MUTATION_DATE_OF_WRITING_WILL" },
        placeholder: {
          labelName: "Enter Date",
          labelKey: "PT_MUTATION_DATE_OF_WRITING_WILL_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Date"),
        isDOB: true,
        errorMessage: "PT_DOCUMENT_DATE_ERROR_MESSAGE",
        jsonPath: "Property.additionalDetails.DateOfWritingWill",
        visible: false,
        props: {
          inputProps: {
            max: getTodaysDateInYMD()
          }
        }
      })
    },
    AuctionDate:{
      ...getDateField({
        label: { labelName: "Auction Date", labelKey: "PT_MUTATION_AUCTION_DATE" },
        placeholder: {
          labelName: "Enter Date",
          labelKey: "PT_MUTATION_AUCTION_DATE_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Date"),
        isDOB: true,
        errorMessage: "PT_DOCUMENT_DATE_ERROR_MESSAGE",
        jsonPath: "Property.additionalDetails.AuctionDate",
        visible: false,
        props: {
          inputProps: {
            max: getTodaysDateInYMD()
          }
        }
      })
    },
    IssuingDate:{
      ...getDateField({
        label: { labelName: "Issuing Date", labelKey: "PT_MUTATION_DATE_OF_ISSUING" },
        placeholder: {
          labelName: "Enter Date of Issuing",
          labelKey: "PT_MUTATION_DATE_OF_ISSUING_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Date"),
        isDOB: true,
        errorMessage: "PT_DOCUMENT_DATE_ERROR_MESSAGE",
        jsonPath: "Property.additionalDetails.IssuingDate",
        visible: false,
        props: {
          inputProps: {
            max: getTodaysDateInYMD()
          }
        }
      })
    },
    IsThereAnyStayOrderOnCourtDecreeByUpperCourt : {
      uiFramework: "custom-containers",
      componentPath: "RadioGroupContainer",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      jsonPath:"Property.additionalDetails.IsThereAnyStayOrderOnCourtDecreeByUpperCourt",
      visible: false,
      props: {
        label: {
          name: "Is Property or Part of Property under State/Central Government Acquisition? ",
          key: "PT_MUTATION_DETAILS_OF_UPPER_COURT_STAY_ORDER"
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
      beforeFieldChange:(action, state, dispatch) => {
      /*   const courtCaseJsonPath = "components.div.children.formwizardFirstStep.children.mutationDetails.children.cardContent.children.mutationDetailsContainer.children.govtAcquisitionDetails";
        if(action.value === "NO"){
          dispatch(handleField("apply", courtCaseJsonPath, "props.disabled", true));
          dispatch(handleField("apply", courtCaseJsonPath, "props.value", ""));
          dispatch(handleField("apply", courtCaseJsonPath, "props.helperText", ""));
          dispatch(handleField("apply", courtCaseJsonPath, "props.error", false));
        }else{
          dispatch(handleField("apply", courtCaseJsonPath, "props.disabled", false));
        } */
      }
    },

    DetailsOfUpperCourtStayOrder: getTextField({
      label: {
        labelName: "DetailsOfUpperCourtStayOrder",
        labelKey: "PT_MUTATION_DETAILS_OF_UPPER_STAY_ORDER"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "Enter Remarks if any",
        labelKey: "PT_MUTATION_DETAILS_OF_UPPER_STAY_ORDER"
      },
      //pattern: getPattern("Address"),
      jsonPath: "Property.additionalDetails.DetailsOfUpperCourtStayOrder",
      visible: false,
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
        pattern: getPattern("DocumentNo"),
      jsonPath: "Property.additionalDetails.documentValue",
      visible: false,
      }),
      CourtName:getTextField({
        label: {
          labelName: "Court Name",
          labelKey: "PT_MUTATION_COURT_NAME"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Court Name",
          labelKey: "PT_MUTATION_COURT_NAME_PLACEHOLDER"
        },
        pattern: getPattern("Address"),
        jsonPath: "Property.additionalDetails.CourtName",
        visible: false,
      }),
   
      NameAndAddressOfWitnesses: getTextField({
        label: {
          labelName: "Name And Address Of Witnesses",
          labelKey: "PT_MUTATION_NAME_AND_ADDRESS_OF_WITNESS"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Name And Address Of Witnesses",
          labelKey: "PT_MUTATION_NAME_AND_ADDRESS_OF_WITNESS_PLACEHOLDER"
        },
        pattern: getPattern("Address"),
        jsonPath: "Property.additionalDetails.NameAndAddressOfWitnesses",
        visible: false,
      }),
    
    IssuingAuthority: getTextField({
      label: {
        labelName: "Name Of Issuing Authority",
        labelKey: "PT_MUTATION_NAME_OF_ISSUING_AUTHORITY"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "Enter Name Of Issuing Authority",
        labelKey: "PT_MUTATION_NAME_OF_ISSUING_AUTHORITY_PLACEHOLDER"
      },
    pattern: getPattern("Address"),
      jsonPath: "Property.additionalDetails.IssuingAuthority",
      visible: false,
    }),
  
    NameOfAuctionAuthority: getTextField({
      label: {
        labelName: "Name Of Auction Authority",
        labelKey: "PT_MUTATION_NAME_OF_AUCTION_AUTHORITY"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "Enter Name Of Auction Authority",
        labelKey: "PT_MUTATION_NAME_OF_AUCTION_AUTHORITY_PLACEHOLDER"
      },
      pattern: getPattern("NameOfAuctionAuthority"),
      jsonPath: "Property.additionalDetails.NameOfAuctionAuthority",
      visible: false,
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
        //pattern: getPattern("Address"),
        jsonPath: "Property.additionalDetails.remarks",
        visible: false,
      }),
    })
  }) ; 
