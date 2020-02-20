import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";

const registrationDetails =  getCommonGrayCard({
  propertyLocationContainer:getCommonContainer({
    transferReason: getLabelWithValue(
      {
        labelName: "Reason for Transfer",
        labelKey: "PT_MUTATION_TRANSFER_REASON"
      },
      {
        jsonPath:
          "Property.additionalDetails.reasonForTransfer"
      }
    ),
    marketValue: getLabelWithValue(
      {
       
        labelName: "Market Value",
            labelKey: "PT_MUTATION_MARKET_VALUE"
      },
      {
        jsonPath:
          "Property.additionalDetails.marketValue"
      }
    ),
     documentNo: getLabelWithValue(
      {
        labelName: "Document No.",
        labelKey: "PT_MUTATION_DOCUMENT_NO"
      },
      {
        jsonPath:
          "Property.additionalDetails.documentNumber"
      }
    ), documentDate: getLabelWithValue(
      {
        labelName: "Document Issue Date",
        labelKey: "PT_MUTATION_DOCUMENT_DATE"
      },
      {
        jsonPath:
          "Property.additionalDetails.documentDate"
      }
    ), documentValue: getLabelWithValue(
      {
        labelName: "Document Value",
        labelKey: "PT_MUTATION_DOCUMENT_VALUE"
      },
      {
        jsonPath:
          "Property.additionalDetails.documentValue"
      }
    ),
    remarks: getLabelWithValue(
      {
        labelName: "Remarks",
        labelKey: "PT_MUTATION_REMARKS"
      },
      {
        jsonPath:
          "Property.additionalDetails.remarks"
      }
    )
  })
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
        children: {
          editIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "edit"
            }
          },
          buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "PT_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 0);
          }
        }
      }
    }
  },

  cardOne: registrationDetails
});
