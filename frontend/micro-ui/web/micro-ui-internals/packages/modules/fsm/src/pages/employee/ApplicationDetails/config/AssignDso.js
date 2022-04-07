import React from "react";
import { DatePicker, Dropdown, CardLabelError } from "@egovernments/digit-ui-react-components";

function todayDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  return yyyy + "-" + mm + "-" + dd;
}

function getFilteredDsoData(dsoData, vehicle, vehicleCapacity) {
  return dsoData?.filter((e) => e.vehicles?.find((veh) => veh?.capacity == vehicleCapacity));
}

export const configAssignDso = ({ t, dsoData, dso, selectDSO, vehicleMenu, vehicle, vehicleCapacity, selectVehicle, action }) => {
  return {
    label: {
      heading: `ES_FSM_ACTION_TITLE_${action}`,
      submit: `CS_COMMON_${action}`,
      cancel: "CS_COMMON_CLOSE",
    },
    form: [
      {
        body: [
          // vehicle ? {
          //   label: t("ES_FSM_ACTION_VEHICLE_TYPE"),
          //   isMandatory: true,
          //   type: "dropdown",
          //   populators: (
          //     <Dropdown
          //       option={vehicleMenu}
          //       autoComplete="off"
          //       optionKey="i18nKey"
          //       id="vehicle"
          //       selected={vehicle}
          //       select={selectVehicle}
          //       disable={vehicle ? true : false}
          //       t={t}
          //     />
          //   ),
          // }: {},
          {
            label: t("ES_FSM_ACTION_DSO_NAME"),
            isMandatory: true,
            type: "dropdown",
            populators: (
              <React.Fragment>
                {getFilteredDsoData(dsoData, vehicle, vehicleCapacity) && !getFilteredDsoData(dsoData, vehicle, vehicleCapacity).length ? (
                  <CardLabelError>{t("ES_COMMON_NO_DSO_AVAILABLE_WITH_SUCH_VEHICLE")}</CardLabelError>
                ) : null}
                <Dropdown
                  option={getFilteredDsoData(dsoData, vehicle, vehicleCapacity)}
                  autoComplete="off"
                  optionKey="displayName"
                  id="dso"
                  selected={dso}
                  select={selectDSO}
                  disable={getFilteredDsoData(dsoData, vehicle, vehicleCapacity) && !getFilteredDsoData(dsoData, vehicle, vehicleCapacity).length ? true : false}
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
          // {
          //   label: t("ES_FSM_ACTION_SERVICE_DATE"),
          //   isMandatory: true,
          //   type: "date",
          //   populators: {
          //     name: "date",
          //     validation: {
          //       required: true,
          //     },
          //     min: Digit.Utils.date.getDate(),
          //     defaultValue: Digit.Utils.date.getDate(),
          //   },
          // },
          {
            label: t("ES_FSM_ACTION_SERVICE_DATE"),
            isMandatory: true,
            type: "custom",
            populators: {
              name: "date",
              validation: {
                required: true,
              },
              customProps: { min: Digit.Utils.date.getDate() },
              defaultValue: Digit.Utils.date.getDate(),
              component: (props, customProps) => <DatePicker onChange={props.onChange} date={props.value} {...customProps} />,
            },
          },
        ],
      },
    ],
  };
};
