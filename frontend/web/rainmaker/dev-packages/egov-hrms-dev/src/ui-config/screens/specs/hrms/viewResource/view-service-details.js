import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { checkValueForNA } from "../../utils";

const gotoCreatePage = (state, dispatch) => {
  const createUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/hrms/create?step=3`
      : `/hrms/create?step=3`;
  dispatch(setRoute(createUrl));
};

const assignmentCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "review-hr",
    scheama: getCommonGrayCard({
      serviceCardContainer: getCommonContainer({
        reviewStatus: getLabelWithValue(
          {
            labelName: "Status",
            labelKey: "HR_STATUS_LABEL"
          },
          {
            jsonPath: "Employee[0].serviceHistory[0].serviceStatus",
            localePrefix: {
              moduleName: "egov-hrms",
              masterName: "EmployeeStatus"
            }, callBack: checkValueForNA
          }
        ),
        reviewServiceFrom: getLabelWithValue(
          {
            labelName: "Service From Date",
            labelKey: "HR_SER_FROM_DATE_LABEL"
          },
          {
            jsonPath: "Employee[0].serviceHistory[0].serviceFrom"
            , callBack: checkValueForNA
          }

        ),
        reviewServiceTo: getLabelWithValue(
          {
            labelName: "Service To Date",
            labelKey: "HR_SER_TO_DATE_LABEL"
          },
          { jsonPath: "Employee[0].serviceHistory[0].serviceTo", callBack: checkValueForNA }
        ),
        reviewLocation: getLabelWithValue(
          {
            labelName: "Location",
            labelKey: "HR_LOCATION_LABEL"
          },
          { jsonPath: "Employee[0].serviceHistory[0].location", callBack: checkValueForNA }
        ),
        reviewOrderNo: getLabelWithValue(
          { labelName: "Order No", labelKey: "HR_ORDER_NO_LABEL" },
          {
            jsonPath: "Employee[0].serviceHistory[0].orderNo", callBack: checkValueForNA
          }
        ),
        reviewCurrentWorking: getLabelWithValue(
          {
            labelName: "Currently Working Here",
            labelKey: "HR_CURR_WORKING_LABEL"
          },
          {
            jsonPath: "Employee[0].serviceHistory[0].isCurrentPosition", callBack: checkValueForNA
          }
        )
      })
    }),

    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "Employee[0].serviceHistory",
    prefixSourceJsonPath:
      "children.cardContent.children.serviceCardContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

export const getServiceDetailsView = (isReview = true) => {
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
            labelName: "Service Details",
            labelKey: "HR_SER_DET_HEADER"
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
            callBack: gotoCreatePage
          }
        }
      }
    },
    viewOne: assignmentCard
  });
};
