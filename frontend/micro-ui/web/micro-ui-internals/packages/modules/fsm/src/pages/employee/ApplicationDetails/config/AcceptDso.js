import React from "react";
<<<<<<< HEAD
import { Dropdown } from "@egovernments/digit-ui-react-components";

<<<<<<< HEAD:frontend/micro-ui/web/micro-ui-internals/packages/modules/fsm/src/pages/employee/ApplicationDetails/config/AcceptDso.js
export const configAcceptDso = ({ t, dsoData, dso, selectVehicleNo, vehicleNoList, vehicleNo, vehicle, noOfTrips, action }) => {
=======
export const configRejectFstpo = ({ t, rejectMenu, selectReason, reason, action }) => {
>>>>>>> upstream/master:frontend/micro-ui/web/micro-ui-internals/packages/modules/fsm/src/pages/employee/ApplicationDetails/config/RejectFstpo.js
=======
import { CardLabelError, Dropdown } from "@egovernments/digit-ui-react-components";

export const configAcceptDso = ({ t, dsoData, dso, selectVehicleNo, vehicleNoList, vehicleNo, vehicle, noOfTrips, action }) => {
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
<<<<<<< HEAD
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
<<<<<<< HEAD:frontend/micro-ui/web/micro-ui-internals/packages/modules/fsm/src/pages/employee/ApplicationDetails/config/AcceptDso.js
=======
            label: t("ES_FSM_ACTION_VEHICLE_REGISTRATION_NO"),
            isMandatory: true,
            type: "dropdown",
            populators: (
              <React.Fragment>
                {!vehicleNoList?.length ? (
                  <CardLabelError>{t("ES_FSM_NO_VEHICLE_AVAILABLE")}</CardLabelError>
                ) : null}
                <Dropdown
                  option={vehicleNoList}
                  autoComplete="off"
                  optionKey="registrationNumber"
                  id="vehicle"
                  select={selectVehicleNo}
                  selected={vehicleNo}
                  disable={vehicleNoList?.length > 0 ? false : true}
                />
              </React.Fragment>
            ),
          },
          {
            label: t("ES_FSM_ACTION_VEHICLE_CAPACITY_IN_LTRS"),
            isMandatory: true,
            type: "text",
            populators: {
              name: "capacity",
              validation: {
                required: true,
              },
>>>>>>> upstream/master
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
<<<<<<< HEAD
=======
            }
          } : {}
>>>>>>> upstream/master:frontend/micro-ui/web/micro-ui-internals/packages/modules/fsm/src/pages/employee/ApplicationDetails/config/RejectFstpo.js
=======
>>>>>>> upstream/master
        ],
      },
    ],
  };
};
