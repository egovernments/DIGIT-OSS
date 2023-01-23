
const configAttendanceApproveModal = ({ t, action }) => {
  if (action?.applicationStatus === "APPROVED") {
    return {
      label: {
        heading: t("ATM_PROCESSINGMODAL_HEADER"),
        submit: t("ATM_FORWARD_FOR_APPROVAL"),
        cancel: t("CS_COMMON_CANCEL"),
      },
      form: [
        {
          body: [
            {
              label: t("WF_COMMON_COMMENTS"),
              type: "textarea",
              populators: {
                name: "comments",
              },
            },
          ],
        },
      ]
    };
  }
};

export default configAttendanceApproveModal;
