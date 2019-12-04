import {
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getCommonSubHeader,
  getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  getApprovalTextField,
  getCheckbox,
  getContainerWithElement,
  getUploadFilesMultiple,
  getCheckBoxJsonpath,
  getCurrentFinancialYear
} from "../utils";
import { footerApprove } from "./approveResource/footer";
import { updatePFOforSearchResults } from "../../../../ui-utils/commons";
import set from "lodash/set";

const queryValueAN = getQueryArg(window.location.href, "applicationNumber");

const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Trade License Application (${getCurrentFinancialYear()})`
    // labelKey: "TL_APPROVAL_REJ_MESSAGE_HEAD"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-tradelicence",
    componentPath: "ApplicationNoContainer",
    props: {
      number: queryValueAN
    }
  }
});

const getApproveCard = queryValuePurpose => {
  return getCommonCard({
    headerOne:
      queryValuePurpose === "cancel"
        ? getCommonSubHeader({
            labelName: "Cancellation Remarks",
            labelKey: "TL_CANCEL_CHECKLIST_HEAD"
          })
        : getCommonSubHeader(
            {
              labelName: "Verification Details",
              labelKey: "TL_APPROVAL_CHECKLIST_HEAD"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          ),

    commentSection: getContainerWithElement({
      children: {
        div: getApprovalTextField(queryValuePurpose)
      },
      props: {
        style: {
          marginTop: 20
        }
      }
    }),
    commentInfo: getCommonParagraph(
      {
        labelName: "Max. Character Limit 500*"
      },
      {
        style: {
          fontSize: 12,
          marginBottom: 0,
          color: "rgba(0, 0, 0, 0.6000000238418579)"
        }
      }
    ),
    uploadFileHeader: getCommonSubHeader(
      {
        labelName: "Supporting Documents",
        labelKey: "TL_APPROVAL_UPLOAD_HEAD"
      },
      {
        style: { marginTop: 15 }
      }
    ),
    uploadFileInfo: getCommonParagraph(
      {
        labelName: "Only .jpg and .pdf files. 5MB max file size.",
        labelKey: "TL_APPROVAL_UPLOAD_SUBHEAD"
      },
      {
        style: {
          fontSize: 12,
          marginBottom: 0,
          marginTop: 5,
          color: "rgba(0, 0, 0, 0.6000000238418579)"
        }
      }
    ),
    uploadFiles: getUploadFilesMultiple(
      "Licenses[0].tradeLicenseDetail.verificationDocuments"
    ),
    checkBoxContainer: getCheckbox(
      "Self declaration provided by the applicant has been found correct and the trade running on the premises is same as given in the application form.",
      getCheckBoxJsonpath(queryValuePurpose)
    )
  });
};

const getTopChildren = (
  queryValueAN,
  queryValueTenantId,
  queryValuePurpose
) => {
  return {
    header,
    getApproveCard: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        form: getApproveCard(queryValuePurpose)
      }
    },
    footerApprove: footerApprove(
      queryValueAN,
      queryValueTenantId,
      queryValuePurpose
    )
  };
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "approve",
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css"
      }
    }
  },
  beforeInitScreen: (action, state, dispatch) => {
    const queryValuePurpose = getQueryArg(window.location.href, "purpose");
    const queryValueAN = getQueryArg(window.location.href, "applicationNumber");
    const queryValueTenantId = getQueryArg(window.location.href, "tenantId");

    if (queryValueAN) {
      updatePFOforSearchResults(
        action,
        state,
        dispatch,
        queryValueAN,
        queryValuePurpose
      );
    }
    const data = getTopChildren(
      queryValueAN,
      queryValueTenantId,
      queryValuePurpose
    );
    set(action, "screenConfig.components.div.children", data);
    set(
      action,
      "screenConfig.components.div.props.id",
      `action_${queryValuePurpose}`
    );
    return action;
  }
};

export default screenConfig;
