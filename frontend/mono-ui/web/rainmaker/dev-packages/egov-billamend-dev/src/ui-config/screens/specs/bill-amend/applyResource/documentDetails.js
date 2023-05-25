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
      labelKey: "BILL_DOCUMENT_DETAILS_HEADER"
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
    labelKey: "BILL_DOCUMENT_DETAILS_SUBTEXT"
  }),
  break: getBreak(),
  documentList: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-billamend",
    componentPath: "DocumentListContainer",
    props: {
      documents: [],
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "BILL_DOC_DET_BTN_UPLOAD_FILE"
      },
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg",
        formatProps: {
          accept: "image/*, .pdf, .png, .jpeg",
        },
        multiple: false,
        maxFileSize: 5000,
      },
      maxFileSize: 5000,
      documentTypePrefix: "BILL_",
    },
    type: "array"
  }
});
