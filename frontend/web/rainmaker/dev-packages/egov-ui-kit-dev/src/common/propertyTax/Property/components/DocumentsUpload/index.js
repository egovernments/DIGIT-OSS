import React, { Component } from "react";
import { connect } from "react-redux";
import DocumentListContainer from "../../../../common/DocumentListContainer";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../../utils/api";

class DocumentsUpload extends Component {
  getMdmsData = async () => {
    const { prepareFinalObject } = this.props;
    let tenantId = getTenantId();
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [{ moduleName: "FireNoc", masterDetails: [{ name: "Documents" }] }],
      },
    };
    try {
      let payload = null;
      payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody, [], {}, true);
      prepareFinalObject("applyScreenMdmsData", payload.MdmsRes);
    } catch (e) {
      console.log(e);
    }
  };
  render() {
    const listProps = {
      documentsList: [
        {
          code: "OWNER",
          title: "Required Documents",
          cards: [
            {
              name: "OWNER.IDENTITYPROOF",
              code: "OWNER.IDENTITYPROOF",
              required: true,
              dropdown: {
                label: "PT_MUTATION_SELECT_DOC_LABEL",
                required: true,
                menu: [
                  {
                    code: "OWNER.IDENTITYPROOF.AADHAAR",
                    label: "OWNER_IDENTITYPROOF_AADHAAR",
                  },
                  {
                    code: "OWNER.IDENTITYPROOF.VOTERID",
                    label: "OWNER_IDENTITYPROOF_VOTERID",
                  },
                  {
                    code: "OWNER.IDENTITYPROOF.DRIVING",
                    label: "OWNER_IDENTITYPROOF_DRIVING",
                  },
                  {
                    code: "OWNER.IDENTITYPROOF.PAN",
                    label: "OWNER_IDENTITYPROOF_PAN",
                  },
                  {
                    code: "OWNER.IDENTITYPROOF.PASSPORT",
                    label: "OWNER_IDENTITYPROOF_PASSPORT",
                  },
                ],
              },
            },
            {
              name: "OWNER.ADDRESSPROOF",
              code: "OWNER.ADDRESSPROOF",
              required: true,
              dropdown: {
                label: "PT_MUTATION_SELECT_DOC_LABEL",
                required: true,
                menu: [
                  {
                    code: "OWNER.ADDRESSPROOF.ELECTRICITYBILL",
                    label: "OWNER_ADDRESSPROOF_ELECTRICITYBILL",
                  },
                  {
                    code: "OWNER.ADDRESSPROOF.DL",
                    label: "OWNER_ADDRESSPROOF_DL",
                  },
                  {
                    code: "OWNER.ADDRESSPROOF.VOTERID",
                    label: "OWNER_ADDRESSPROOF_VOTERID",
                  },
                  {
                    code: "OWNER.ADDRESSPROOF.AADHAAR",
                    label: "OWNER_ADDRESSPROOF_AADHAAR",
                  },
                  {
                    code: "OWNER.ADDRESSPROOF.PAN",
                    label: "OWNER_ADDRESSPROOF_PAN",
                  },
                  {
                    code: "OWNER.ADDRESSPROOF.PASSPORT",
                    label: "OWNER_ADDRESSPROOF_PASSPORT",
                  },
                ],
              },
            },
            {
              name: "OWNER.REGISTRATIONPROOF",
              code: "OWNER.REGISTRATIONPROOF",
              required: true,
              dropdown: {
                label: "PT_MUTATION_SELECT_DOC_LABEL",
                required: true,
                menu: [
                  {
                    code: "OWNER.REGISTRATIONPROOF.ELECTRICITYBILL",
                    label: "OWNER_REGISTRATIONPROOF_ELECTRICITYBILL",
                  },
                  {
                    code: "OWNER.REGISTRATIONPROOF.DL",
                    label: "OWNER_REGISTRATIONPROOF_DL",
                  },
                  {
                    code: "OWNER.REGISTRATIONPROOF.VOTERID",
                    label: "OWNER_REGISTRATIONPROOF_VOTERID",
                  },
                  {
                    code: "OWNER.REGISTRATIONPROOF.AADHAAR",
                    label: "OWNER_REGISTRATIONPROOF_AADHAAR",
                  },
                  {
                    code: "OWNER.REGISTRATIONPROOF.PAN",
                    label: "OWNER_REGISTRATIONPROOF_PAN",
                  },
                ],
              },
            },
          ],
        },
      ],
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "PT_MUTATION_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE",
      },
      // description: "Only .jpg and .pdf files. 6MB max file size.",
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg",
      },
      maxFileSize: 6000,
    };
    if (this.props.prepareFinalObject) {
      this.getMdmsData();
    }
    return <DocumentListContainer {...listProps}></DocumentListContainer>;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    prepareFinalObject: (jsonPath, value) => dispatch(prepareFinalObject(jsonPath, value)),
  };
};
export default connect(null, mapDispatchToProps)(DocumentsUpload);
