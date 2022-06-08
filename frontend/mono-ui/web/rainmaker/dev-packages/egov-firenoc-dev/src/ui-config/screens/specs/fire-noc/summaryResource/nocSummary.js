import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep, checkValueForNA } from "../../utils/index";

export const nocSummaryDetail={
  nocType: getLabelWithValue(
    {
      labelName: "NOC Type",
      labelKey: "NOC_TYPE_LABEL"
    },
    {
      jsonPath: "FireNOCs[0].fireNOCDetails.fireNOCType",
      callBack: checkValueForNA
    }
  ),
  fireNocNumber: getLabelWithValue(
    {
      labelName: "Provisional fire NoC number",
      labelKey: "NOC_PROVISIONAL_FIRE_NOC_NO_LABEL"
    },
    {
      jsonPath: "FireNOCs[0].fireNOCNumber", //"FireNOCs[0].provisionFireNOCNumber"
      callBack: checkValueForNA
    }
  )
}

export const nocSummary = getCommonGrayCard({
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
          labelName: "NOC Details",
          labelKey: "NOC_NOC_DETAILS_HEADER"
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
            labelKey: "NOC_SUMMARY_EDIT"
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
  body: getCommonContainer(nocSummaryDetail)
});
