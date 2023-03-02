import React from "react";
import { CardLabelError, Dropdown } from "@egovernments/digit-ui-react-components";

export const configAcceptDso = ({ t, dsoData, dso, selectVehicleNo, vehicleNoList, vehicleNo, vehicle, noOfTrips, action }) => {
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
        ],
      },
    ],
  };
};
