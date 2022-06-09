import React from "react";
import { Dropdown } from "@egovernments/digit-ui-react-components";

export const configRejectFstpo = ({ t, rejectMenu, selectReason, reason, action }) => {
  return {
    label: {
      heading: `ES_FSM_ACTION_TITLE_${action}`,
      submit: `CS_COMMON_${action}`,
      cancel: "CS_COMMON_CLOSE",
    },
    form: [
      {
        body: [
          {
            label: t("ES_FSM_ACTION_DECLINE_REASON"),
            isMandatory: true,
            type: "dropdown",
            populators: (
              <Dropdown
                option={rejectMenu}
                autoComplete="off"
                optionKey="i18nKey"
                id="Reason"
                select={selectReason}
                selected={reason}
                t={t}
              />
            ),
          },
          reason?.code === "OTHERS" ? {
            label: t("Comments"),
            isMandatory: true,
            type: "text",
            populators: {
              name: "comments",
              validation: {
                required: true,
              },
            }
          } : {}
        ],
      },
    ],
  };
};
