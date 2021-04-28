import {
  getCommonGrayCard,
  getCommonSubHeader,
  getLabelWithValue,
  getCommonContainer,
  getCommonCaption,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { changeStep } from "./footer";

export const getApprovalDetails = (status, isEditable = false) =>
  getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader(getView(status).header)
        }
      }
    },
    viewOne: getCommonContainer({
      approvedBy: getLabelWithValue(
        getView(status).subHeader1.label,
        getView(status).subHeader1.json
      ),
      approvalComments: getLabelWithValue(
        getView(status).subHeader2.label,
        getView(status).subHeader2.json
      )
    }),
    viewTow: getCommonContainer({
      lbl: {
        gridDefination: {
          xs: 12
        },
        visible: true,
        props: {
          style: {
            padding: "12px 24px 12px 0"
          }
        },
        ...getCommonCaption({
          labelName: "Uploaded Documents",
          labelKey: "TL_EMP_APPLICATION_UP_DOC"
        })
      },

      editSection: {
        componentPath: "Button",
        props: {
          color: "primary"
        },
        gridDefination: {
          xs: 12,
          sm: 2,
          align: "right"
        },
        visible: isEditable,
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
            labelKey: "TL_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            changeStep(state, dispatch, "", 2);
          }
        }
      },
      documents: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-tradelicence",
        componentPath: "DownloadFileContainer",
        props: {
          sourceJsonPath: "LicensesTemp[0].verifyDocData"
        }
      }
    })
  });

const getView = status => {
  switch (status) {
    case "approved":
      return getDetails(
        {
          labelName: "Approval Details",
          labelKey: "TL_EMP_APPROVAL_DETAILS"
        },
        getSubHeader(
          "Approved By",
          "TL_EMP_APPLICATION_APPR_BY",
          "Licenses[0].tradeLicenseDetail.additionalDetail.approveDetail.approvedBy"
        ),
        getSubHeader(
          "Approval Comments",
          "TL_EMP_APPLICATION_APPR_COM",
          "Licenses[0].tradeLicenseDetail.additionalDetail.approveDetail.comments"
        )
      );

    case "rejected":
      return getDetails(
        {
          labelName: "Rejection Details",
          labelKey: "TL_EMP_APPLICATION_REJ_DETAILS"
        },
        getSubHeader(
          "Rejected By",
          "TL_EMP_APPLICATION_REJ_BY",
          "Licenses[0].tradeLicenseDetail.additionalDetail.rejectDetail.rejectedBy"
        ),
        getSubHeader(
          "Rejection Comments",
          "TL_EMP_APPLICATION_REJ_COM",
          "Licenses[0].tradeLicenseDetail.additionalDetail.rejectDetail.comments"
        )
      );

    case "cancelled":
      return getDetails(
        {
          labelName: "Cancellation Details",
          labelKey: "TL_EMP_APPLICATION_CANC_DET"
        },
        getSubHeader(
          "Cancelled By",
          "TL_EMP_APPLICATION_CANC_BY",
          "Licenses[0].tradeLicenseDetail.additionalDetail.cancelDetail.cancelledBy"
        ),
        getSubHeader(
          "Cancellation Comments",
          "TL_EMP_APPLICATION_CANC_COM",
          "Licenses[0].tradeLicenseDetail.additionalDetail.cancelDetail.comments"
        )
      );

    default:
      return getDetails(
        {
          labelName: "",
          labelKey: ""
        },
        getSubHeader("", "", ""),
        getSubHeader("", "", "")
      );
  }
};

const getDetails = (header, subHeader1, subHeader2) => {
  return {
    header,
    subHeader1,
    subHeader2
  };
};
const getSubHeader = (labelName, labelKey, jsonPath) => {
  return { label: { labelName, labelKey }, json: { jsonPath } };
};
