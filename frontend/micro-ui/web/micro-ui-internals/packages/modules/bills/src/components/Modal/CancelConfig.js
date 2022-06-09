import { Dropdown } from "@egovernments/digit-ui-react-components";
import React from "react";

export const configCancelConfig = ({ t, selectedReason, Reasons, selectReason }) => {
  return {
    label: {
      heading: `CR_COMMON_HEADER`,
      submit: `CR_CANCEL_RECEIPT_BUTTON`,
    },
    form: [
      {
        body: [
          {
            label: t("CR_RECEIPT_CANCELLATION_REASON_LABEL"),
            type: "dropdown",
            isMandatory: true,
            name: "reason",
            populators: <Dropdown isMandatory selected={selectedReason} optionKey="name" option={Reasons} select={selectReason} t={t} />,
          },
          {
            label: t("CR_MORE_DETAILS_LABEL"),
            type: "text",
            populators: {
              name: "otherDetails",
            },
            // isMandatory:selectedReason?.code=="OTHER"?true:false,
            disable: selectedReason?.code == "OTHER" ? false : true,
          },
          {
            label: t("CR_ADDITIONAL_PENALTY"),
            type: "text",
            populators: {
              name: "penalty",
              disable: true,
            },
            disable: true,
          },
        ],
      },
    ],
  };
};
