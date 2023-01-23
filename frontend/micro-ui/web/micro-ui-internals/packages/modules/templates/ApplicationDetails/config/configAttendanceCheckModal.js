const configAttendanceCheckModal = ({
  t,
  action,
  businessService,
  approvers,
  selectedApprover,
  setSelectedApprover,
  designation,
  selectedDesignation,
  setSelectedDesignation,
  department,
  selectedDept,
  setSelectedDept,
  approverLoading = false,
}) => {
  let checkConditions = true;
  if (action.isTerminateState) checkConditions = false;

  if (designation?.length === 0 || department?.length === 0) return {};

  if (action?.applicationStatus === "ATTENDANCE_CHECKED") {
    return {
      label: {
        heading: t("ATM_PROCESSINGMODAL_HEADER"),
        submit: t("ATM_FORWARD_FOR_CHECK"),
        cancel: t("WORKS_CANCEL"),
      },
      form: [
        {
          body: [
            {
              isMandatory: true,
              key: "department",
              type: "radioordropdown",
              label: !checkConditions ? null : t("ATM_APPROVER_DEPT"),
              disable: false,
              populators: {
                name: "department",
                optionsKey: "i18nKey",
                error: "Department is required",
                required: true,
                options: department,
              },
            },
            {
              isMandatory: true,
              key: "designation",
              type: "radioordropdown",
              label: !checkConditions ? null : t("ATM_APPROVER_DESIGNATION"),
              disable: false,
              populators: {
                name: "designation",
                optionsKey: "i18nKey",
                error: "Designation is required",
                required: true,
                options: designation,
              },
            },
            {
              isMandatory: true,
              key: "approvers",
              type: "radioordropdown",
              label: !checkConditions ? null : t("WORKS_APPROVER"),
              disable: false,
              populators: {
                name: "approvers",
                optionsKey: "nameOfEmp",
                error: "Designation is required",
                required: true,
                options: approvers,
              },
            },
            {
              label: t("WF_COMMON_COMMENTS"),
              type: "textarea",
              populators: {
                name: "comments",
              },
            },
          ],
        },
      ],
      defaultValues: {
        department: "",
        designation: "",
        approvers: "",
        comments: "",
      },
    };
  }
};

export default configAttendanceCheckModal;
