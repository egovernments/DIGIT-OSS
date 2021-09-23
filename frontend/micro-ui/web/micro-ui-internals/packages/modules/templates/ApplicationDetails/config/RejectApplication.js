import React from "react";
import { Dropdown } from "@egovernments/digit-ui-react-components";

export const configRejectApplication = ({ t, rejectMenu, setReason, reason, action }) => {
  return {
    label: {
      heading: `ES_FSM_ACTION_TITLE_${action}`,
      submit: `CS_COMMON_${action}`,
      cancel: "CS_COMMON_CANCEL",
    },
    form: [
      {
        body: [
          {
            label: t(`ES_FSM_ACTION_${action.toUpperCase()}_REASON`),
            type: "dropdown",
            populators: <Dropdown t={t} option={rejectMenu} id="reason" optionKey="i18nKey" selected={reason} select={setReason} />,
            isMandatory: true,
          },
          {
            label: t("ES_FSM_ACTION_COMMENTS"),
            type: "textarea",
            populators: {
              name: "comments",
            },
          },
        ],
      },
    ],
  };
};
