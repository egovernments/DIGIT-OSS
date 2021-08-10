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
      ? `/egov-ui-framework/hrms/create?step=1`
      : `/hrms/create?step=1`;
  dispatch(setRoute(createUrl));
};

const jurisdictionCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  // beforeInitScreen: (action, state, dispatch) => {
  //   // COMMA SEPARATED ROLES IN REVIEW SCREEN
  //   setRolesList(state, dispatch);
  //   return action;
  // },
  props: {
    className: "review-hr",
    scheama: getCommonGrayCard({
      jurisCardContainer: getCommonContainer({
        reviewHierarchy: getLabelWithValue(
          {
            labelName: "Hierarchy",
            labelKey: "HR_HIERARCHY_LABEL"
          },
          {
            jsonPath: "Employee[0].jurisdictions[0].hierarchy",
            localePrefix: {
              moduleName: "EGOV_LOCATION",
              masterName: "TENANTBOUNDARY"
            }, callBack: checkValueForNA
          }
        ),
        reviewBoundaryType: getLabelWithValue(
          {
            labelName: "Boundary Type",
            labelKey: "HR_BOUNDARY_TYPE_LABEL"
          },
          {
            jsonPath: "Employee[0].jurisdictions[0].boundaryType",
            localePrefix: {
              moduleName: "EGOV_LOCATION",
              masterName: "BOUNDARYTYPE"
            }, callBack: checkValueForNA
          }
        ),
        reviewBoundary: getLabelWithValue(
          { labelName: "Boundary", labelKey: "HR_BOUNDARY_LABEL" },
          {
            jsonPath: "Employee[0].jurisdictions[0].boundary",
            localePrefix: {
              moduleName: "TENANT",
              masterName: "TENANTS"
            }, callBack: checkValueForNA
          }
        ),
        reviewRole: getLabelWithValue(
          { labelName: "Role", labelKey: "HR_ROLE_LABEL" },
          {
            jsonPath: "Employee[0].jurisdictions[0].furnishedRolesList",
          }
        ),

      })
    }),

    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "Employee[0].jurisdictions",
    prefixSourceJsonPath:
      "children.cardContent.children.jurisCardContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

export const getJurisdictionDetailsView = (isReview = true) => {
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
            labelName: "Jurisdiction Details",
            labelKey: "HR_JURIS_DET_HEADER"
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
    viewOne: jurisdictionCard
  });
};
