import { Dropdown, UploadFile } from "@egovernments/digit-ui-react-components";
import React from "react";

export const configBPAApproverApplication = ({
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
  return {
    label: {
      heading: `WF_${action?.action}_APPLICATION`,
      submit: `WF_${businessService}_${action?.action}`,
      cancel: "WF_EMPLOYEE_BPA_CANCEL",
    },
    form: [
      {
        body: [
          {
            label: action.isTerminateState ? null : t(assigneeLabel || `WF_ROLE_${action.assigneeRoles?.[0]}`),
            // isMandatory: !action.isTerminateState,
            type: "dropdown",
            populators: action.isTerminateState ? null : (
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
            label: t("ES_PT_ACTION_COMMENTS"),
            type: "textarea",
            populators: {
              name: "comments",
            },
          },
          {
            label: `${t("BPA_APPROVAL_CHECKLIST_BUTTON_UP_FILE")}`,
            populators: (
              <UploadFile
                id={"workflow-doc"}
                onUpload={selectFile}
                onDelete={() => {
                  setUploadedFile(null);
                }}
                showHint={true}
                hintText={t("BPA_ATTACH_RESTRICTIONS_SIZE")}
                message={uploadedFile ? `1 ${t(`ES_PT_ACTION_FILEUPLOADED`)}` : t(`ES_PT_ACTION_NO_FILEUPLOADED`)}
              />
            ),
          },
        ],
      },
    ],
  };
};
