import React from "react";

export const configMCollectRejectApplication = ({ t, action }) => {
  return {
    label: {
      heading: `CANCEL_CHALLAN_HEADER`,
      submit: `CANCEL_YES`,
      cancel: "CANCEL_NO",
    },
    form: [
      {
        body: [
          {
            label: t("CANCEL_COMMENT_LABEL"),
            type: "textarea",
            populators: {
              name: "comments",
            },
          }
        ],
      },
    ],
  };
};
