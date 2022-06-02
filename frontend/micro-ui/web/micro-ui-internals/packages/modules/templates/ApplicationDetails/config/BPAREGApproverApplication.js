import { Dropdown, UploadFile } from "@egovernments/digit-ui-react-components";
import React from "react";

export const configBPAREGApproverApplication = ({
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
    let checkCondtions = true;
    if (action?.action == "SENDBACKTOCITIZEN") checkCondtions = false;
    if (action.isTerminateState) checkCondtions = false;

    return {
        label: {
            heading: `WF_${action?.action}_APPLICATION`,
            submit: `WF_${businessService?.toUpperCase()}_${action?.action}`,
            cancel: "WF_EMPLOYEE_BPAREG_CANCEL",
        },
        form: [
            {
                body: [
                    {
                        label: !checkCondtions ? null : t("WF_ASSIGNEE_NAME_LABEL"),
                        placeholder: !checkCondtions ? null : t("WF_ASSIGNEE_NAME_PLACEHOLDER"),
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
                    {
                        label: t("WF_COMMON_COMMENTS"),
                        type: "textarea",
                        populators: {
                            name: "comments",
                        },
                    },
                    {
                        label: t("BPA_APPROVAL_CHECKLIST_BUTTON_UP_FILE"),
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
                        )
                    },
                ],
            },
        ],
    };
};
