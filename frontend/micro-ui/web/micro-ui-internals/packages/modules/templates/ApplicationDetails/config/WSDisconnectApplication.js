import { Dropdown, UploadFile, DatePicker } from "@egovernments/digit-ui-react-components";
import React from "react";

export const configWSDisConnectApplication = ({
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
  error
}) => {
  let checkCondtions = true, isDatePickerDisplay = false;
  if (action?.action?.includes("SEND_BACK") || action?.action == "APPROVE_FOR_DISCONNECTION" || action?.action == "RESUBMIT_APPLICATION") checkCondtions = false;
  if (action.isTerminateState) checkCondtions = false;
  if (action?.action == "EXECUTE_DISCONNECTION" || action?.action == "DISCONNECTION_EXECUTED") isDatePickerDisplay = true;


  return {
    label: {
      heading: `WF_${action?.action}_APPLICATION`,
      submit: `WF_${businessService?.toUpperCase()}_${action?.action}`,
      cancel: "CS_COMMON_CANCEL",
    },
    form: [
      {
        body: [
          {
            label: !checkCondtions ? null : t("WF_ASSIGNEE_NAME_LABEL"),
            placeholder: !checkCondtions ? null : t("WF_ASSIGNEE_NAME_PLACEHOLDER"),
            // isMandatory: false,
            type: "dropdown",
            populators: !checkCondtions ? null : (
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
          isDatePickerDisplay && {
            label: t("ES_FSM_ACTION_SERVICE_DATE"),
            isMandatory: isDatePickerDisplay ? true : false,
            type: "custom",
            populators: isDatePickerDisplay ? {
              name: "date",
              validation: {
                required: true,
              },
              // customProps: { max: Digit.Utils.date.getDate() },
              defaultValue: Digit.Utils.date.getDate(),
              component: (props, customProps) => <DatePicker onChange={props.onChange} date={props.value} {...customProps} />,
            } : null,
          },
          {
            label: t("WF_COMMON_COMMENTS"),
            type: "textarea",
            populators: {
              name: "comments",
            },
          },
          {
            label: t("WS_APPROVAL_CHECKLIST_BUTTON_UP_FILE"),
            populators: (
              <UploadFile
                id={"workflow-doc"}
                accept=".jpg,.pdf,.png,.jpeg"
                onUpload={selectFile}
                onDelete={() => {
                  setUploadedFile(null);
                }}
                message={uploadedFile ? `1 ${t(`ES_PT_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)}
                error={error}
                iserror={error}
              />
            )
          },
        ],
      },
    ],
  };
};