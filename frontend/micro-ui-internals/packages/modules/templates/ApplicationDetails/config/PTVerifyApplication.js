import React from "react";
import { Dropdown, UploadFile } from "@egovernments/digit-ui-react-components";

export const configPTVerifyApplication = ({
  t,
  action,
  fieldInspectors,
  selectedFieldInspector,
  setSelectedFieldInspector,
  selectFile,
  uploadedFile,
  setUploadedFile,
}) => {
  console.log("%c 🏌️‍♂️: uploadedFile ", "font-size:16px;background-color:#befb98;color:black;", uploadedFile);
  return {
    label: {
      heading: `ES_PT_ACTION_TITLE_${action}`,
      submit: `ES_PT_COMMON_${action}`,
      cancel: "ES_PT_COMMON_CANCEL",
    },
    form: [
      {
        body: [
          {
            label: t("ES_PT_FIELD_INSPECTORS"),
            isMandatory: true,
            type: "dropdown",
            populators: (
              <Dropdown
                option={fieldInspectors}
                autoComplete="off"
                optionKey="name"
                id="fieldInspector"
                select={setSelectedFieldInspector}
                selected={selectedFieldInspector}
              />
            ),
          },
          {
            label: t("ES_PT_ACTION_COMMENTS"),
            type: "textarea",
            populators: {
              name: "comments",
            },
          },
          {
            label: t("ES_PT_UPLOAD_FILE"),
            populators: (
              <UploadFile
                // accept=".jpg"
                onUpload={selectFile}
                onDelete={() => {
                  setUploadedFile(null);
                }}
                message={uploadedFile ? `1 ${t(`ES_PT_ACTION_FILEUPLOADED`)}` : t(`ES_PT_ACTION_NO_FILEUPLOADED`)}
              />
            ),
          },
        ],
      },
    ],
  };
};
