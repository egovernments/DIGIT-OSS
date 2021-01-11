export const documentList = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-bpa",
  componentPath: "DocumentListContainer",
  props: {
    buttonLabel: {
      labelName: "UPLOAD FILE",
      labelKey: "BPA_BUTTON_UPLOAD FILE"
    },
    description: {
      labelName: "Only .jpg and .pdf files. 6MB max file size.",
      labelKey: "BPA_UPLOAD_FILE_RESTRICTIONS"
    },
    inputProps: {
      accept: "image/*, .pdf, .png, .jpeg"
    },
    documentTypePrefix: "BPA_",
    maxFileSize: 5000
  }
};
