import React from "react";
import { DatePicker, Dropdown, CardLabelError } from "@egovernments/digit-ui-react-components";

function getFilteredDsoData(dsoData, vehicle, vehicleCapacity) {
  return dsoData?.filter((e) => e.vehicles?.find((veh) => veh?.capacity == vehicleCapacity));
}

export const configReassignDSO = ({
  t,
  dsoData,
  dso,
  selectDSO,
  vehicleMenu,
  vehicle,
  vehicleCapacity,
  selectVehicle,
  reassignReasonMenu,
  reassignReason,
  selectReassignReason,
  action,
  showReassignReason,
}) => ({
  label: {
    heading: `ES_FSM_ACTION_TITLE_${action}`,
    submit: `CS_COMMON_${action}`,
    cancel: "CS_COMMON_CLOSE",
  },
  form: [
    {
      body: [
        ...(showReassignReason
          ? [
              {
                label: t("ES_FSM_ACTION_REASSIGN_REASON"),
                type: "dropdown",
                isMandatory: true,
                populators: (
                  <Dropdown
                    option={reassignReasonMenu}
                    optionKey="i18nKey"
                    id="reassign-reason"
                    selected={reassignReason}
                    select={selectReassignReason}
                    t={t}
                  />
                ),
              },
            ]
          : []),
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
              />
            </React.Fragment>
          ),
        },
        {
          label: t("ES_FSM_ACTION_VEHICLE_CAPACITY_IN_LTRS"),
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
});
