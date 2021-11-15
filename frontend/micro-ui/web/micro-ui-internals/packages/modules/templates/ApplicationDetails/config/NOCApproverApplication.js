import { Dropdown, UploadFile } from "@egovernments/digit-ui-react-components";
import React from "react";

export const configNOCApproverApplication = ({
  t,
  action,
  approvers,
  selectedApprover,
  setSelectedApprover,
  selectFile,
  uploadedFile,
  setUploadedFile,
  assigneeLabel,
  businessService,
}) => {

  let isCommentRequired = false;
  if(action?.action == "REVOCATE" || action?.action == "REJECT") {
    isCommentRequired = true;
  }

  let isRejectOrRevocate = false;
  if(action?.action == "APPROVE" || action?.action == "REJECT" || action.action == "AUTO_APPROVE" || action.action == "AUTO_REJECT") {
    isRejectOrRevocate = true;
  }

  return {
    label: {
      heading: `WF_FORWARD_APPLICATION`,
      submit: `WF_${businessService}_${action?.action}`,
      cancel: "CORE_LOGOUTPOPUP_CANCEL",
    },
    form: [
      {
        body: [
          {
            label: action.isTerminateState || isRejectOrRevocate ? null : t(assigneeLabel || `WF_ROLE_${action.assigneeRoles?.[0]}`),
            // isMandatory: !action.isTerminateState,
            type: "dropdown",
            populators: action.isTerminateState || isRejectOrRevocate ? null : (
              <Dropdown
                option={approvers}
                autoComplete="off"
                optionKey="name"
                id="fieldInspector"
                select={setSelectedApprover}
                selected={selectedApprover}
              />
            ),
          },
          {
            label: t("WF_COMMON_COMMENTS"),
            type: "textarea",
            isMandatory: isCommentRequired,
            populators: {
              name: "comments",
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
                showHint={true}
                // hintText={t("BPA_ATTACH_RESTRICTIONS_SIZE")}
                message={uploadedFile ? `1 ${t(`ES_PT_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)}
              />
            ),
          },
        ],
      },
    ],
  };
};