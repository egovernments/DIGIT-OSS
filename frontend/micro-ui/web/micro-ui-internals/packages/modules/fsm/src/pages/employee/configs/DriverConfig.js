import React from "react";
const { DatePicker } = require("@egovernments/digit-ui-react-components");
import { convertEpochToDate } from "../../../utils";

const DriverConfig = (t, disabled = false) => {
  return [
    {
      head: "ES_FSM_REGISTRY_DRIVER_DETAILS",
      body: [
        {
          label: "ES_FSM_REGISTRY_DRIVER_NAME",
          isMandatory: true,
          type: "text",
          disable: disabled,
          populators: {
            name: "driverName",
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
          label: "ES_FSM_REGISTRY_DRIVER_LICENSE",
          isMandatory: true,
          type: "text",
          key: "license",
          populators: {
            name: "license",
            validation: {
              required: true,
              pattern: /^[a-zA-Z-]{0,}[- ]{0,1}[ 0-9]{1,}/,
            },
            error: t("FSM_REGISTRY_INVALID_DRIVER_LICENSE"),
            required: false,
            defaultValue: "",
            className: "payment-form-text-input-correction",
          },
        },
      ],
    },
    {
      head: "ES_FSM_REGISTRY_PERSONAL_DETAILS",
      body: [
        {
          label: "ES_FSM_REGISTRY_NEW_GENDER",
          isMandatory: true,
          type: "component",
          route: "select-gender",
          hideInEmployee: false,
          key: "selectGender",
          component: "SelectGender",
          texts: {
            headerCaption: "",
            header: "CS_COMMON_CHOOSE_GENDER",
            cardText: "CS_COMMON_SELECT_GENDER",
            submitBarLabel: "CS_COMMON_NEXT",
            skipText: "CORE_COMMON_SKIP_CONTINUE",
          },
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
          label: "ES_FSM_REGISTRY_DRIVER_PHONE",
          isMandatory: true,
          type: "mobileNumber",
          key: "phone",
          disable: disabled,
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
      ],
    },
  ];
};

export default DriverConfig;
