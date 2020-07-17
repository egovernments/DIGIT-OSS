import {
  getBreak,
  getCommonCard,
  getCommonParagraph,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";

export const documentDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Required Documents",
      labelKey: "BPA_DOCUMENT_DETAILS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  subText: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "BPA_DOCUMENT_DETAILS_SUBTEXT"
  }),
  break: getBreak(),
  documentList: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bpa",
    componentPath: "BpaDocumentListContainer",
    props: {
      documents: [
        {
          name: "Identity Proof ",
          required: true,
          jsonPath: "bpa.documents.identityProof",
          selector: {
            inputLabel: "Select Document",
            menuItems: [
              { value: "AADHAAR", label: "Aadhaar Card" },
              { value: "VOTERID", label: "Voter ID Card" },
              { value: "DRIVING", label: "Driving License" }
            ]
          }
        },
        {
          name: "Address Proof ",
          required: true,
          jsonPath: "bpa.documents.addressProof",
          selector: {
            inputLabel: "Select Document",
            menuItems: [
              { value: "ELECTRICITYBILL", label: "Electricity Bill" },
              { value: "DL", label: "Driving License" },
              { value: "VOTERID", label: "Voter ID Card" }
            ]
          }
        }
      ],
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "BPA_DOC_DET_BTN_UPLOAD_FILE"
      },
      // description: "Only .jpg and .pdf files. 6MB max file size.",
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg",
        multiple: false
      },
      maxFileSize: 5000
    },
    type: "array"
  }
});
