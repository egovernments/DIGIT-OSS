import {
  getCommonHeader,
  getCommonContainer,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { employeeReviewDetails } from "./viewResource/employee-review";
import { setRolesList } from "./viewResource/functions";

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: "Employee - Summary",
    labelKey: "HR_SUMMARY_HEADER"
  })
});

export const subHeader = getCommonContainer({
  subHeader: getCommonSubHeader({
    labelName:
      "Verify entered details before submission. Details cannot be edited once submitted.",
    labelKey: "HR_SER_DET_SUB_HEADER"
  })
});

const tradeReview = employeeReviewDetails(true);

const screenConfig = {
  uiFramework: "material-ui",
  name: "review",
  beforeInitScreen: (action, state, dispatch) => {
    // COMMA SEPARATED ROLES IN REVIEW SCREEN
    setRolesList(state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        // headerDiv: {
        //   uiFramework: "custom-atoms",
        //   componentPath: "Container",
        //   children: {
        //     header: {
        //       gridDefination: {
        //         xs: 12,
        //         sm: 10
        //       },
        //       ...header
        //     },
        //     subHeader: {
        //       gridDefination: {
        //         xs: 12,
        //         sm: 10
        //       },
        //       ...subHeader
        //     }
        //   }
        // },
        tradeReview
      }
    }
  }
};

export default screenConfig;
