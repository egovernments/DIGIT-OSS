import { UploadFile } from "@egovernments/digit-ui-react-components"
import React from 'react';

export const configAcceptApplication = ({ t, action, selectFile, uploadedFile, error, isCommentRequired = true }) => {
  return {
    label: {
      heading: `ES_BPA_ACTION_TITLE_${action}`,
      submit: `CS_COMMON_${action}`,
      cancel: "CS_COMMON_CLOSE",
    },
    form: [
      {
        body: [
          {
            label: t("ES_OBPS_ACTION_COMMENTS"),
            isMandatory: isCommentRequired,
            type: "text",
            populators: {
              name: "comments",
              validation: {
                required: isCommentRequired,
              }
            },
          },
          {
            label: t("ES_OBPS_ACTION_FILE_UPLOAD"),
            type: "custom",
            populators: {
              name: "file",
              component: () => (
                <UploadFile
                  id={"obps-doc"}
                  extraStyleName={"propertyCreate"}
                  accept=".jpg,.png,.pdf"
                  onUpload={selectFile}
                  message={uploadedFile ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`ES_NO_FILE_SELECTED_LABEL`)}
                  error={error}
                />
              ),
            },
          },
        ],
      },
    ],
  };
}