import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,

  getLabelWithValueForModifiedLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { checkValueForNA } from "../../utils";
import { convertEpochToDate } from "../../utils/index";
export const registrationSummaryDetails = {
  transferReason: getLabelWithValueForModifiedLabel(
    {
      labelName: "Reason for Transfer",
      labelKey: "PT_MUTATION_TRANSFER_REASON"
    },
    {
      jsonPath:
        "Property.additionalDetails.reasonForTransfer",
      callBack: checkValueForNA
    }, {
    labelKey: "PTM_OLD_LABEL_NAME"
  },
    { jsonPath: "PropertyOld.additionalDetails.reasonForTransfer", callBack: checkValueForNA },
  ),
  marketValue: getLabelWithValueForModifiedLabel(
    {

      labelName: "Market Value",
      labelKey: "PT_MUTATION_MARKET_VALUE"
    },
    {
      jsonPath:
        "Property.additionalDetails.marketValue",
      callBack: checkValueForNA
    }, {
    labelKey: "PTM_OLD_LABEL_NAME"
  },
    { jsonPath: "PropertyOld.additionalDetails.marketValue", callBack: checkValueForNA },
  ),
  documentNo: getLabelWithValueForModifiedLabel(
    {
      labelName: "Document No.",
      labelKey: "PT_MUTATION_DOCUMENT_NO"
    },
    {
      jsonPath:
        "Property.additionalDetails.documentNumber",
      callBack: checkValueForNA
    }, {
    labelKey: "PTM_OLD_LABEL_NAME"
  },
    { jsonPath: "PropertyOld.additionalDetails.documentNumber", callBack: checkValueForNA },
  ), documentDate: getLabelWithValueForModifiedLabel(
    {
      labelName: "Document Issue Date",
      labelKey: "PT_MUTATION_DOCUMENT_DATE"
    },
    {
      jsonPath:
        "Property.additionalDetails.documentDate",
      callBack: value => {
        return convertEpochToDate(value);
      }
    }, {
    labelKey: "PTM_OLD_LABEL_NAME"
  },
    {
      jsonPath: "PropertyOld.additionalDetails.documentDate", callBack: value => {
        return convertEpochToDate(value);
      }
    },
  ), documentValue: getLabelWithValueForModifiedLabel(
    {
      labelName: "Document Value",
      labelKey: "PT_MUTATION_DOCUMENT_VALUE"
    },
    {
      jsonPath:
        "Property.additionalDetails.documentValue",
      callBack: checkValueForNA
    }, {
    labelKey: "PTM_OLD_LABEL_NAME"
  },
    { jsonPath: "PropertyOld.additionalDetails.documentValue", callBack: checkValueForNA },
  ),
  remarks: getLabelWithValueForModifiedLabel(
    {
      labelName: "Remarks",
      labelKey: "PT_MUTATION_REMARKS"
    },
    {
      jsonPath:
        "Property.additionalDetails.remarks",
      callBack: checkValueForNA
    }, {
    labelKey: "PTM_OLD_LABEL_NAME"
  },
    { jsonPath: "PropertyOld.additionalDetails.remarks", callBack: checkValueForNA },
  )
}
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

  cardOne: registrationDetails
});
