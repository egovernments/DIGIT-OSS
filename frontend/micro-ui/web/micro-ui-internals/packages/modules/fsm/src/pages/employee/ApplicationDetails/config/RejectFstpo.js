import React from "react";
import { Dropdown } from "@egovernments/digit-ui-react-components";

<<<<<<< HEAD
export const configRejectFstpo = ({ t, rejectMenu, selectReason, reason, action }) => {
=======
<<<<<<< HEAD:frontend/micro-ui/web/micro-ui-internals/packages/modules/fsm/src/pages/employee/ApplicationDetails/config/AcceptDso.js
export const configAcceptDso = ({ t, dsoData, dso, selectVehicleNo, vehicleNoList, vehicleNo, vehicle, noOfTrips, action }) => {
=======
export const configRejectFstpo = ({ t, rejectMenu, selectReason, reason, action }) => {
>>>>>>> upstream/master:frontend/micro-ui/web/micro-ui-internals/packages/modules/fsm/src/pages/employee/ApplicationDetails/config/RejectFstpo.js
>>>>>>> upstream/master
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
<<<<<<< HEAD
            }
          } : {}
=======
<<<<<<< HEAD:frontend/micro-ui/web/micro-ui-internals/packages/modules/fsm/src/pages/employee/ApplicationDetails/config/AcceptDso.js
            },
            disable: true,
          },
          {
            label: t("ES_FSM_ACTION_NUMBER_OF_TRIPS"),
            isMandatory: true,
            type: "text",
            populators: {
              name: "noOfTrips",
              validation: {
                required: true,
              },
              defaultValue: noOfTrips
            },
            disable: true,
          },
=======
            }
          } : {}
>>>>>>> upstream/master:frontend/micro-ui/web/micro-ui-internals/packages/modules/fsm/src/pages/employee/ApplicationDetails/config/RejectFstpo.js
>>>>>>> upstream/master
        ],
      },
    ],
  };
};
