import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";

const mutationDetails =  getCommonGrayCard({
  mutationDetailsContainer:getCommonContainer({
    transferReason: getLabelWithValue(
      {
        labelName: "Reason for Transfer",
        labelKey: "PT_MUTATION_COURT_PENDING_OR_NOT"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].name"
      }
    ), documentNo: getLabelWithValue(
      {
        labelName: "Document No.",
        labelKey: "PT_MUTATION_COURT_CASE_DETAILS"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].fatherOrHusbandName"
      }
    ), documentDate: getLabelWithValue(
      {
        labelName: "Document Issue Date",
        labelKey: "PT_MUTATION_STATE_ACQUISITION"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].gender"
      }
    ), documentValue: getLabelWithValue(
      {
        labelName: "Document Value",
        labelKey: "PT_MUTATION_GOVT_ACQUISITION_DETAILS"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.applicantDetails.owners[0].pan"
      }
    )
  })
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

  cardOne: mutationDetails
});
