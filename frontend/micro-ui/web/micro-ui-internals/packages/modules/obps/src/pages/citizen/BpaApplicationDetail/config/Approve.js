import { UploadFile } from "@egovernments/digit-ui-react-components"
import React from 'react';

export const configAcceptApplication = ({ t, action, selectFile, uploadedFile, error, isCommentRequired = true, setUploadedFile, file }) => {
  return {
    label: {
      heading: `BPA_FORWARD_APPLICATION_HEADER`,
      submit: `BPA_${action}_BUTTON`,
      cancel: "CS_COMMON_CANCEL",
    },
    form: [
      {
        body: [
          {
            label: t("ES_OBPS_ACTION_COMMENTS"),
            isMandatory: isCommentRequired,
            type: "textarea",
            populators: {
              name: "comments",
              validation: {
                required: isCommentRequired,
              }
            },
          },
          {
            label: `${t("WF_APPROVAL_UPLOAD_HEAD")}`,
            populators: (
              <UploadFile
                id={"workflow-doc"}
                onUpload={selectFile}
                onDelete={() => {
                  setUploadedFile(null);
                }}
                message={uploadedFile ? `1 ${t(`ES_PT_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)}
                accept= "image/*, .pdf, .png, .jpeg, .jpg"
                iserror={error}
              />
            ),
          },
        ],
      },
    ],
  };
}