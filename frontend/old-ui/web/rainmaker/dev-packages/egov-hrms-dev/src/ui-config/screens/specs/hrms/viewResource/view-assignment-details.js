import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { checkValueForNA } from "../../utils";
import { changeStep } from "../createResource/footer";


const gotoCreatePage = (state, dispatch) => {
  const createUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/hrms/create?step=2`
      : `/hrms/create?step=2`;
  dispatch(setRoute(createUrl));
};

const assignmentCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "review-hr",
    scheama: getCommonGrayCard({
      assignmentCardContainer: getCommonContainer({
        reviewAssignedFrom: getLabelWithValue(
          {
            labelName: "Assigned From Date",
            labelKey: "HR_ASMT_FROM_DATE_LABEL"
          },
          { jsonPath: "Employee[0].assignments[0].fromDate", callBack: checkValueForNA }
        ),
        reviewAssignedTo: getLabelWithValue(
          {
            labelName: "Assigned To Date",
            labelKey: "HR_ASMT_TO_DATE_LABEL"
          },
          { jsonPath: "Employee[0].assignments[0].toDate", callBack: checkValueForNA }
        ),
        reviewCurrentAssigned: getLabelWithValue(
          {
            labelName: "Currently Assigned Here",
            labelKey: "HR_CURR_ASSIGN_LABEL"
          },
          { jsonPath: "Employee[0].assignments[0].isCurrentAssignment", callBack: checkValueForNA }
        ),
        reviewDepartment: getLabelWithValue(
          { labelName: "Department", labelKey: "HR_DEPT_LABEL" },
          {
            jsonPath: "Employee[0].assignments[0].department",
            localePrefix: {
              moduleName: "common-masters",
              masterName: "Department"
            }, callBack: checkValueForNA
          }
        ),
        reviewDesignation: getLabelWithValue(
          { labelName: "Designation", labelKey: "HR_DESG_LABEL" },
          {
            jsonPath: "Employee[0].assignments[0].designation",
            localePrefix: {
              moduleName: "common-masters",
              masterName: "Designation"
            }, callBack: checkValueForNA
          }
        ),
        reviewReportTo: getLabelWithValue(
          { labelName: "Reporting To", labelKey: "HR_REP_TO_LABEL" },
          {
            jsonPath: "Employee[0].assignments[0].reportingTo"
            , callBack: checkValueForNA
          }
        ),
        reviewHOD: getLabelWithValue(
          { labelName: "Head of Department", labelKey: "HR_HOD_LABEL" },
          {
            jsonPath: "Employee[0].assignments[0].isHOD"
            , callBack: checkValueForNA
          }
        )
      })
    }),

    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "Employee[0].assignments",
    prefixSourceJsonPath:
      "children.cardContent.children.assignmentCardContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

export const getAssignmentDetailsView = (isReview = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "Assignment Details",
            labelKey: "HR_ASSIGN_DET_HEADER"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isReview,
          gridDefination: {
            xs: 12,
            sm: 2,
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
              labelKey: "HR_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              changeStep(state, dispatch, "", 1);
            }
          }
        }
      }
    },
    viewOne: assignmentCard
  });
};
