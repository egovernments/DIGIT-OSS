import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

const gotoCreatePage = (state, dispatch) => {
  const createUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/hrms/create?step=4`
      : `/hrms/create?step=4`;
  dispatch(setRoute(createUrl));
};

const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-hrms",
    componentPath: "DividerWithLabel",
    props: {
      className: "hr-generic-divider-label",
      labelProps: {},
      dividerProps: {},
      label
    },
    type: "array"
  };
};

const educationCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "review-hr",
    scheama: getCommonGrayCard({
      eduCardContainer: getCommonContainer({
        reviewDegree: getLabelWithValue(
          {
            labelName: "Degree",
            labelKey: "HR_DEGREE_LABEL"
          },
          { jsonPath: "Employee[0].education[0].qualification" }
        ),
        reviewYear: getLabelWithValue(
          {
            labelName: "Year",
            labelKey: "HR_YEAR_LABEL"
          },
          { jsonPath: "Employee[0].education[0].yearOfPassing" }
        ),
        reviewUniversity: getLabelWithValue(
          { labelName: "University", labelKey: "HR_UNIVERSITY_LABEL" },
          { jsonPath: "Employee[0].education[0].university" }
        ),
        reviewStream: getLabelWithValue(
          { labelName: "Stream", labelKey: "HR_STREAM_LABEL" },
          { jsonPath: "Employee[0].education[0].stream" }
        )
      })
    }),

    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "Employee[0].education",
    prefixSourceJsonPath:
      "children.cardContent.children.eduCardContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

const deptCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "review-hr",
    scheama: getCommonGrayCard({
      deptCardContainer: getCommonContainer({
        reviewTestName: getLabelWithValue(
          {
            labelName: "Test Name",
            labelKey: "HR_TEST_NAME_LABEL"
          },
          { jsonPath: "Employee[0].tests[0].test" }
        ),
        reviewYear: getLabelWithValue(
          {
            labelName: "Year",
            labelKey: "HR_YEAR_LABEL"
          },
          { jsonPath: "Employee[0].tests[0].yearOfPassing" }
        ),
        reviewRemarks: getLabelWithValue(
          { labelName: "Remarks", labelKey: "HR_REMARKS_LABEL" },
          { jsonPath: "Employee[0].tests[0].remarks" }
        )
        // documents: getDocuments()
      })
    }),

    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "Employee[0].tests",
    prefixSourceJsonPath:
      "children.cardContent.children.deptCardContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

const educationDetailsHeader = getHeader({
  labelName: "Education Details",
  labelKey: "HR_SUMMARY_EDUCATION_DEATILS_SUBHEADER"
});
const deptDetailsHeader = getHeader({
  labelName: "Department Test Details",
  labelKey: "HR_SUMMARY_DEPT_TEST_DEATILS_SUBHEADER"
});

export const getOtherDetailsView = (isReview = true) => {
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
            labelName: "Other Details",
            labelKey: "HR_OTHER_DET_HEADER"
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
    viewOne: educationDetailsHeader,
    viewTwo: educationCard,
    viewThree: deptDetailsHeader,
    viewFour: deptCard
  });
};
