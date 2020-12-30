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
        labelKey: "PT_MUTATION_DOCUMENTS_HEADER"
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
      labelKey: "PT_MUTATION_DOCUMENT_DETAILS_SUBTEXT"
    }),
    break: getBreak(),
    documentList: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pt",
      componentPath: "DocumentListContainer",
      props: {
        buttonLabel: {
          labelName: "UPLOAD FILE",
          labelKey: "PT_MUTATION_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
        },
        // description: "Only .jpg and .pdf files. 6MB max file size.",
        inputProps: {
          accept: "image/*, .pdf, .png, .jpeg"
        },
        maxFileSize: 5000
      },
      type: "array"
    }
  });
  