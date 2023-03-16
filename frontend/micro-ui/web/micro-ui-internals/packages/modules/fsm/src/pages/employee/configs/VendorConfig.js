import React from "react";
import { convertEpochToDate } from "../../../utils";
const { DatePicker, Dropdown } = require("@egovernments/digit-ui-react-components");

const VendorConfig = (t, disabled = false) => {
  return [
    {
      head: "ES_FSM_REGISTRY_NEW_VENDOR_DETAILS",
      body: [
        {
          label: "ES_FSM_REGISTRY_NEW_VENDOR_NAME",
          isMandatory: true,
          type: "text",
          disable: disabled,
          populators: {
            name: "vendorName",
            validation: {
              required: true,
              pattern: /^[A-Za-z]/,
            },
            error: t("FSM_REGISTRY_INVALID_NAME"),
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
          disable: disabled,
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
          label: "ES_FSM_REGISTRY_NEW_VENDOR_PHONE",
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
            labelStyle: { border: "1px solid black", borderRight: "none" },
            error: t("FSM_REGISTRY_INVALID_PHONE"),
            defaultValue: "",
            className: "payment-form-text-input-correction",
          },
        },
      ],
    },
    {
      head: "ES_FSM_REGISTRY_NEW_ADDRESS_DETAILS",
      body: [
        {
          label: "ES_FSM_REGISTRY_NEW_DOOR",
          isMandatory: false,
          type: "text",
          key: "doorNo",
          populators: {
            name: "doorNo",
            defaultValue: "",
            className: "payment-form-text-input-correction",
          },
        },
        {
          label: "ES_FSM_REGISTRY_NEW_PLOT",
          isMandatory: false,
          type: "text",
          key: "plotNo",
          populators: {
            name: "plotNo",
            defaultValue: "",
            className: "payment-form-text-input-correction",
          },
        },
        {
          label: "ES_FSM_REGISTRY_NEW_BUILDING_NAME",
          isMandatory: false,
          type: "text",
          key: "buildingName",
          populators: {
            name: "buildingName",
            defaultValue: "",
            className: "payment-form-text-input-correction",
          },
        },
        {
          label: "ES_FSM_REGISTRY_NEW_STREET",
          isMandatory: false,
          type: "text",
          key: "street",
          populators: {
            name: "street",
            defaultValue: "",
            className: "payment-form-text-input-correction",
          },
        },
        {
          label: "ES_FSM_REGISTRY_NEW_PINCODE",
          isMandatory: false,
          type: "text",
          key: "pincode",
          populators: {
            name: "pincode",
            validation: {
              required: false,
              pattern: /^[1-9][0-9]{5}$/,
            },
            error: t("FSM_REGISTRY_INVALID_PINCODE"),
            defaultValue: "",
            className: "payment-form-text-input-correction",
          },
        },
        {
          route: "address",
          component: "SelectAddress",
          withoutLabel: true,
          texts: {
            headerCaption: "CS_FILE_APPLICATION_PROPERTY_LOCATION_LABEL",
            header: "CS_FILE_APPLICATION_PROPERTY_LOCATION_ADDRESS_TEXT",
            cardText: "CS_FILE_APPLICATION_PROPERTY_LOCATION_CITY_MOHALLA_TEXT",
            submitBarLabel: "CS_COMMON_NEXT",
          },
          key: "address",
          isMandatory: true,
          type: "component",
        },
        {
          label: "ES_FSM_REGISTRY_NEW_LANDMARK",
          isMandatory: false,
          type: "text",
          key: "landmark",
          populators: {
            name: "landmark",
            defaultValue: "",
            className: "payment-form-text-input-correction",
          },
        },
      ],
    },
    {
      head: "",
      body: [
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

export default VendorConfig;
