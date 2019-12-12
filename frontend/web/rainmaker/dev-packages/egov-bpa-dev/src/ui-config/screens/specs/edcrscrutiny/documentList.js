export const documentList = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-bpa",
  componentPath: "EDCRUploadCard",
  props: {
    buttonLabel: {
      labelName: "UPLOAD FILE",
      labelKey: "EDCR_BUTTON_UPLOAD_FILE"
    },
    description: {
      labelName: "Only .dxf files. 30MB max file size.",
      labelKey: "EDCR_UPLOAD_RESTRICTIONS"
    },
    inputProps: {
      accept:
        "application/dxf,application/x-autocad,application/x-dxf,drawing/x-dxf,image/vnd.dxf,image/x-autocad,image/x-dxf,zz-application/zz-winassoc-dxf"
    },
    documents: [
      {
        jsonPath: "Scrutiny[0].buildingPlan[0]",
        name: "BUILDINGPLAN",
        required: true
      }
    ],
    documentTypePrefix: "EDCR_",
    maxFileSize: 30000
  }
};
