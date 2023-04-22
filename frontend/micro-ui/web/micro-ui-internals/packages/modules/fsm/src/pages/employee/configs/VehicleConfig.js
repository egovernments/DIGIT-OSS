import React from "react";
const { DatePicker, Dropdown } = require("@egovernments/digit-ui-react-components");
import { convertEpochToDate } from "../../../utils";

const VehicleConfig = (t, disabled = false) => {
  return [
    {
      head: "ES_FSM_REGISTRY_VEHICLE_DETAILS",
      body: [
        {
          label: "ES_FSM_REGISTRY_VEHICLE_NUMBER",
          isMandatory: true,
          type: "text",
          disable: disabled,
          populators: {
            name: "registrationNumber",
            ValidationRequired: true,
            validation: {
              pattern: `[A-Z]{2}\\s{1}[0-9]{2}\\s{0,1}[A-Z]{1,2}\\s{1}[0-9]{4}`,
              title: t("ES_FSM_VEHICLE_FORMAT_TIP"),
            },
            error: t("FSM_REGISTRY_INVALID_REGISTRATION_NUMBER"),
            defaultValue: "",
            className: "payment-form-text-input-correction",
          },
        },
        {
          route: "vehicle",
          component: "SelectVehicle",
          withoutLabel: true,
          key: "vehicle",
          isMandatory: true,
          type: "component",
        },
        {
          label: "ES_FSM_REGISTRY_VEHICLE_POLLUTION_CERT",
          isMandatory: false,
          type: "custom",
          key: "pollutionCert",
          populators: {
            name: "pollutionCert",
            validation: {
              required: true,
            },
            component: (props, customProps) => <DatePicker onChange={props.onChange} date={props.value} {...customProps} />,
          },
        },
        {
          label: "ES_FSM_REGISTRY_VEHICLE_INSURANCE",
          isMandatory: false,
          type: "custom",
          key: "insurance",
          populators: {
            name: "insurance",
            validation: {
              required: true,
            },
            component: (props, customProps) => <DatePicker onChange={props.onChange} date={props.value} {...customProps} />,
          },
        },
        {
          label: "ES_FSM_REGISTRY_VEHICLE_ROAD_TAX",
          isMandatory: false,
          type: "custom",
          key: "roadTax",
          populators: {
            name: "roadTax",
            validation: {
              required: true,
            },
            component: (props, customProps) => <DatePicker onChange={props.onChange} date={props.value} {...customProps} />,
          },
        },
        {
          label: "ES_FSM_REGISTRY_NEW_FITNESS",
          isMandatory: false,
          type: "custom",
          key: "fitnessValidity",
          populators: {
            name: "fitnessValidity",
            validation: {
              required: true,
            },
            component: (props, customProps) => <DatePicker onChange={props.onChange} date={props.value} {...customProps} />,
          },
        },
        {
          label: "ES_FSM_REGISTRY_NEW_VEHICLE_OWNER_NAME",
          isMandatory: true,
          type: "text",
          // disable: disabled,
          populators: {
            name: "ownerName",
            validation: {
              required: true,
              pattern: /^[A-Za-z]/,
            },
            error: t("FSM_REGISTRY_INVALID_NAME"),
            defaultValue: "",
            className: "payment-form-text-input-correction",
          },
        },
        {
          label: "ES_FSM_REGISTRY_NEW_VEHICLE_OWNER_PHONE",
          isMandatory: true,
          type: "mobileNumber",
          key: "phone",
          // disable: disabled,
          populators: {
            name: "phone",
            validation: {
              required: true,
              pattern: /^[6-9]\d{9}$/,
            },
            error: t("FSM_REGISTRY_INVALID_PHONE"),
            defaultValue: "",
            className: "payment-form-text-input-correction",
            labelStyle: { border: "1px solid black", borderRight: "none" },
          },
        },
        {
          label: "ES_FSM_REGISTRY_NEW_GENDER",
          isMandatory: true,
          type: "component",
          route: "select-gender",
          hideInEmployee: false,
          key: "selectGender",
          component: "SelectGender",
          // disable: disabled,
        },
        {
          label: t("ES_FSM_REGISTRY_NEW_DOB"),
          isMandatory: false,
          type: "custom",
          key: "dob",
          populators: {
            name: "dob",
            validation: {
              required: true,
            },
            component: (props, customProps) => (
              <DatePicker
                onChange={props.onChange}
                date={props.value}
                {...customProps}
                max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear()))}
              />
            ),
          },
        },
        {
          label: "ES_FSM_REGISTRY_NEW_EMAIL",
          isMandatory: false,
          type: "text",
          key: "emailId",
          populators: {
            name: "emailId",
            validation: {
              required: false,
              pattern: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]+$/,
            },
            error: t("FSM_REGISTRY_INVALID_EMAIL"),
            defaultValue: "",
            className: "payment-form-text-input-correction",
          },
        },
        {
          label: "ES_FSM_REGISTRY_NEW_VENDOR_ADDITIONAL_DETAILS",
          isMandatory: false,
          type: "textarea",
          key: "additionalDetails",
          populators: {
            name: "additionalDetails",
            className: "payment-form-text-input-correction",
          },
        },
      ],
    },
  ];
};

export default VehicleConfig;
