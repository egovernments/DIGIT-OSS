import React from "react";
import { DatePicker, Dropdown, CardLabelError } from "@egovernments/digit-ui-react-components";

function getFilteredDsoData(dsoData, vehicle) {
  return dsoData?.filter((e) => e.vehicles?.find((veh) => veh?.type == vehicle?.code));
}

export const configReassignDSO = ({
  t,
  dsoData,
  dso,
  selectDSO,
  vehicleMenu,
  vehicle,
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
          label: t("ES_FSM_ACTION_VEHICLE_TYPE"),
          isMandatory: vehicle ? false : true,
          type: "dropdown",
          populators: (
            <Dropdown
              option={vehicleMenu}
              autoComplete="off"
              optionKey="i18nKey"
              id="vehicle"
              selected={vehicle}
              select={selectVehicle}
              disable={vehicle ? true : false}
              t={t}
            />
          ),
        },
        {
          label: t("ES_FSM_ACTION_DSO_NAME"),
          isMandatory: true,
          type: "dropdown",
          populators: (
            <React.Fragment>
              {/* {console.log("find get dso here",getFilteredDsoData(), getFilteredDsoData() && !getFilteredDsoData().length )} */}
              {getFilteredDsoData(dsoData, vehicle) && !getFilteredDsoData(dsoData, vehicle).length ? (
                <CardLabelError>{t("ES_COMMON_NO_DSO_AVAILABLE_WITH_SUCH_VEHICLE")}</CardLabelError>
              ) : null}
              <Dropdown
                option={getFilteredDsoData(dsoData, vehicle)}
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
