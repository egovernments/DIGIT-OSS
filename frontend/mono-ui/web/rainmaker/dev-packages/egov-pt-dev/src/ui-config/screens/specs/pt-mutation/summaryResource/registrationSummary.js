import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabelWithValue,
  getLabelWithValueForModifiedLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { checkValueForNA } from "../../utils";
import { convertEpochToDate } from "../../utils/index";
import { getLabelIfNotNull } from "../../utils/index";

export const registrationSummaryDetails = {
  transferReason: getLabelWithValue(
    {
      labelName: "Reason for Transfer",
      labelKey: "PT_MUTATION_TRANSFER_REASON"
    },
    {
      jsonPath:
        "Property.additionalDetails.reasonForTransfer",
      callBack: checkValueForNA
    }
  ),
  marketValue: getLabelWithValue(
    {

      labelName: "Market Value",
      labelKey: "PT_MUTATION_MARKET_VALUE"
    },
    {
      jsonPath:
        "Property.additionalDetails.marketValue",
      callBack: checkValueForNA
    }
  ),
  AuctionRegistrationnumber: getLabelWithValue(
    {

      labelName: "Auction Registration No.",
      labelKey: "PT_MUTATION_AUCTION_REGISTRATION_NO"
    },
    {
      jsonPath:
        "Property.additionalDetails.AuctionRegistrationnumber",
      callBack: checkValueForNA
    }
  ),
  documentNumber: getLabelWithValue(
    {

      labelName: "Enter Document No.",
      labelKey: "PT_MUTATION_DOCUMENT_NO_PLACEHOLDER"
    },
    {
      jsonPath:
        "Property.additionalDetails.documentNumber",
      callBack: checkValueForNA
    }
  ),
  SerialNumber: getLabelWithValue(
    {

      labelName: "Serial No.",
      labelKey: "PT_MUTATION_SERIAL_NO"
    },
    {
      jsonPath:
        "Property.additionalDetails.SerialNumber",
      callBack: checkValueForNA
    }
  ),
  powerOfAttorneyRegNo: getLabelWithValue(
    {

      labelName: "powerOfAttorneyRegNo",
      labelKey: "PT_MUTATION_ATTORNEY_REG_NO"
    },
    {
      jsonPath:
        "Property.additionalDetails.powerOfAttorneyRegNo",
      callBack: checkValueForNA
    }
  ),
  powerOfAttorneyRegDate: getLabelWithValue(
    {

      labelName: "Power Of Attorney Reg Date",
      labelKey: "PT_MUTATION_POWERATT_REG_DATE"
    },
    {
      jsonPath:
        "Property.additionalDetails.powerOfAttorneyRegDate",
      callBack: checkValueForNA
    }
  ),
  DecreeNo: getLabelWithValue(
    {
      labelName: "DecreeNo",
      labelKey: "PT_MUTATION_DECREE_NO"
    },
    {
      jsonPath:
        "Property.additionalDetails.DecreeNo",
      callBack: checkValueForNA
    }
  ),
  AuctionRegistrationDate: getLabelWithValue(
    {
      labelName: "Auction Registration Date",
      labelKey: "PT_MUTATION_AUCTION_REGISTRATION_DATE"
    },
    {
      jsonPath:
        "Property.additionalDetails.AuctionRegistrationDate",
      callBack: checkValueForNA
    }
  ),
  DecreeDate: getLabelWithValue(
    {
      labelName: "Decree Date",
      labelKey: "PT_MUTATION_DECREE_DATE"
    },
    {
      jsonPath:
        "Property.additionalDetails.DecreeDate",
      callBack: checkValueForNA
    }
  ),
  documentIssueDateField: getLabelWithValue(
    {
      labelName: "Document Issue Date",
      labelKey: "PT_MUTATION_DOCUMENT_ISSUE_DATE"
    },
    {
      jsonPath:
        "Property.additionalDetails.documentDate",
      callBack: checkValueForNA
    }
  ),
  DateOfWritingWill: getLabelWithValue(
    {
      labelName: "Date of writing will",
      labelKey: "PT_MUTATION_DATE_OF_WRITING_WILL"
    },
    {
      jsonPath:
        "Property.additionalDetails.DateOfWritingWill",
      callBack: checkValueForNA
    }
  ),
  DateOfWritingWill: getLabelWithValue(
    {
      labelName: "Auction Date",
      labelKey: "PT_MUTATION_AUCTION_DATE"
    },
    {
      jsonPath:
        "Property.additionalDetails.AuctionDate",
      callBack: checkValueForNA
    }
  ),
  IssuingDate: getLabelWithValue(
    {
      labelName: "Issuing Date",
      labelKey: "PT_MUTATION_DATE_OF_ISSUING"
    },
    {
      jsonPath:
        "Property.additionalDetails.IssuingDate",
      callBack: checkValueForNA
    }
  ),
  IsThereAnyStayOrderOnCourtDecreeByUpperCourt: getLabelWithValue(
    {
      labelName: "Is Property or Part of Property under State/Central Government Acquisition? ",
      labelKey: "PT_MUTATION_DETAILS_OF_UPPER_COURT_STAY_ORDER"
    },
    {
      jsonPath:
        "Property.additionalDetails.isPropertyUnderGovtPossession",
      callBack: checkValueForNA
    }
  ),
  DetailsOfUpperCourtStayOrder: getLabelWithValue(
    {
      labelName: "DetailsOfUpperCourtStayOrder",
      labelKey: "PT_MUTATION_DETAILS_OF_UPPER_STAY_ORDER"
    },
    {
      jsonPath:
        "Property.additionalDetails.DetailsOfUpperCourtStayOrder",
      callBack: checkValueForNA
    }
  ),
  documentValue: getLabelWithValue(
    {
      labelName: "Document Value",
      labelKey: "PT_MUTATION_DOCUMENT_VALUE"
    },
    {
      jsonPath:
        "Property.additionalDetails.documentValue",
      callBack: checkValueForNA
    }
  ),
  CourtName: getLabelWithValue(
    {
      labelName: "Court Name",
      labelKey: "PT_MUTATION_COURT_NAME"
    },
    {
      jsonPath:
        "Property.additionalDetails.CourtName",
      callBack: checkValueForNA
    }
  ),
  NameAndAddressOfWitnesses: getLabelWithValue(
    {
      labelName: "Name And Address Of Witnesses",
      labelKey: "PT_MUTATION_NAME_AND_ADDRESS_OF_WITNESS"
    },
    {
      jsonPath:
        "Property.additionalDetails.NameAndAddressOfWitnesses",
      callBack: checkValueForNA
    }
  ),
  IssuingAuthority: getLabelWithValue(
    {
      labelName: "Name Of Issuing Authority",
      labelKey: "PT_MUTATION_NAME_OF_ISSUING_AUTHORITY"
    },
    {
      jsonPath:
        "Property.additionalDetails.IssuingAuthority",
      callBack: checkValueForNA
    }
  ),
  NameOfAuctionAuthority: getLabelWithValue(
    {
      labelName: "Name Of Auction Authority",
      labelKey: "PT_MUTATION_NAME_OF_AUCTION_AUTHORITY"
    },
    {
      jsonPath:
        "Property.additionalDetails.NameOfAuctionAuthority",
      callBack: checkValueForNA
    }
  ),
  remarks: getLabelWithValue(
    {
      labelName: "Remarks",
      labelKey: "PT_MUTATION_REMARKS"
    },
    {
      jsonPath:
        "Property.additionalDetails.remarks",
      callBack: checkValueForNA
    }
  ),
};

const registrationDetails = getCommonGrayCard({
  propertyLocationContainer: getCommonContainer(registrationSummaryDetails)
});


export const registrationSummary = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "Registration Details",
          labelKey: "PT_MUTATION_REGISTRATION_DETAILS"
        })
      },
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
        gridDefination: {
          xs: 4,
          align: "right"
        },
        // children: {
        //   editIcon: {
        //     uiFramework: "custom-atoms",
        //     componentPath: "Icon",
        //     props: {
        //       iconName: "edit"
        //     }
        //   },
        // buttonLabel: getLabel({
        //   labelName: "Edit",
        //   labelKey: "PT_EDIT"
        // })
        // },
        // onClickDefination: {
        //   action: "condition",
        //   callBack: (state, dispatch) => {
        //     gotoApplyWithStep(state, dispatch, 0);
        //   }
        // }
      }
    }
  },

  cardOne: registrationDetails,
  
});
