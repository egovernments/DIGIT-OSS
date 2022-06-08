import {
  getCommonContainer,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue,
  getCommonCard,
  getCommonGrayCard
} from "egov-ui-framework/ui-config/screens/specs/utils";

const Status = [
  "Pending for Document Verification",
  "Pending for Field Inspection",
  "Pending for Approval"
];

export const taskStatus = getCommonCard({
  header: {
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
          labelName: "Task Status",
          labelKey: "NOC_TASK_STATUS_HEADER"
        })
      },
      historySection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
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
              iconName: "history"
            }
          },
          buttonLabel: getLabel({
            labelName: "VIEW HISTORY",
            labelKey: "NOC_VIEW_HISTORY"
          })
        },
        onClickDefination: {
          action: "condition"
          //ADD THE CLICK ACTION LATER
          // callBack: (state, dispatch) => {
          //   changeStep(state, dispatch, "", 0);
          // }
        }
      }
    }
  },
  body: getCommonContainer({
    statusDate: getLabelWithValue(
      {
        labelName: "Date",
        labelKey: "NOC_STATUS_DATE_LABEL"
      },
      {
        jsonPath: "statusDate"
      }
    ),
    updaterName: getLabelWithValue(
      {
        labelName: "Updated by",
        labelKey: "NOC_UPDATER_NAME_LABEL"
      },
      {
        jsonPath: "updaterName"
      }
    ),
    currentOnwerName: getLabelWithValue(
      {
        labelName: "Current Owner",
        labelKey: "NOC_CURRENT_OWNER_LABEL"
      },
      {
        jsonPath: "currentOnwerName"
      }
    ),
    currentStatus: getLabelWithValue(
      {
        labelName: "Status",
        labelKey: "NOC_CURRENT_STATUS_LABEL"
      },
      {
        jsonPath: "currentStatus"
      }
    ),
    comments: getLabelWithValue(
      {
        labelName: "Comments",
        labelKey: "NOC_STATUS_COMMENTS"
      },
      {
        jsonPath: "comments"
      }
    ),
    children: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-noc",
      componentPath: "DownloadFileContainer",
      backgroundColor: "##F2F2F2",
      props: {
        sourceJsonPath: "documents",
        className: "noc-review-documents",
        data: []
      }
    }
  })
});
