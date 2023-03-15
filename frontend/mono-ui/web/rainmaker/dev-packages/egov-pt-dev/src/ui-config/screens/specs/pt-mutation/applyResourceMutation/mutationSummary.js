import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,

  getLabelWithValueForModifiedLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { checkValueForNA } from "../../utils";

export const mutationSummaryDetails = {
  transferReason: getLabelWithValueForModifiedLabel(
    {
      labelName: "Reason for Transfer",
      labelKey: "PT_MUTATION_COURT_PENDING_OR_NOT"
    },
    {
      jsonPath:
        "Property.additionalDetails.isMutationInCourt",
      callBack: checkValueForNA
    }, {
    labelKey: "PTM_OLD_LABEL_NAME"
  },
    { jsonPath: "PropertyOld.additionalDetails.isMutationInCourt", callBack: checkValueForNA },
  ), documentNo: getLabelWithValueForModifiedLabel(
    {
      labelName: "Document No.",
      labelKey: "PT_MUTATION_COURT_CASE_DETAILS"
    },
    {
      jsonPath:
        "Property.additionalDetails.caseDetails",
      callBack: checkValueForNA
    }, {
    labelKey: "PTM_OLD_LABEL_NAME"
  },
    { jsonPath: "PropertyOld.additionalDetails.caseDetails", callBack: checkValueForNA },
  ), documentDate: getLabelWithValueForModifiedLabel(
    {
      labelName: "Document Issue Date",
      labelKey: "PT_MUTATION_STATE_ACQUISITION"
    },
    {
      jsonPath:
        "Property.additionalDetails.isPropertyUnderGovtPossession",
      callBack: checkValueForNA
    }, {
    labelKey: "PTM_OLD_LABEL_NAME"
  },
    { jsonPath: "PropertyOld.additionalDetails.isPropertyUnderGovtPossession", callBack: checkValueForNA },
  ), documentValue: getLabelWithValueForModifiedLabel(
    {
      labelName: "Document Value",
      labelKey: "PT_MUTATION_GOVT_ACQUISITION_DETAILS"
    },
    {
      jsonPath:
        "Property.additionalDetails.govtAcquisitionDetails",
      callBack: checkValueForNA
    }, {
    labelKey: "PTM_OLD_LABEL_NAME"
  },
    { jsonPath: "PropertyOld.additionalDetails.govtAcquisitionDetails", callBack: checkValueForNA },
  )
}

const mutationDetails = getCommonGrayCard({
  mutationDetailsContainer: getCommonContainer(mutationSummaryDetails)
});


export const mutationSummary = getCommonGrayCard({
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
          labelName: "Mutation Details",
          labelKey: "PT_MUTATION_DETAILS"
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

  cardOne: mutationDetails
});
