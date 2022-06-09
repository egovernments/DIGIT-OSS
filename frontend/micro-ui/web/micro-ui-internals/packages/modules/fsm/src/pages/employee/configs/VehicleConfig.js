import React from "react";
const { DatePicker } = require("@egovernments/digit-ui-react-components")

const VehicleConfig = (t, disabled = false) => {
  return [
    {
      "head": "ES_FSM_REGISTRY_NEW_VEHICLE_DETAILS",
      "body": [
        {
          "label": "ES_FSM_REGISTRY_NEW_REGISTRATION_NUMBER",
          "isMandatory": true,
          "type": "text",
          "disable": disabled,
          "populators": {
            "name": "registrationNumber",
            "error": t("FSM_REGISTRY_INVALID_REGISTRATION_NUMBER"),
            "defaultValue": "",
            "className": "payment-form-text-input-correction",
          }
        },
        {
          "label": "ES_FSM_REGISTRY_NEW_VEHICLE_TYPE",
          "isMandatory": false,
          "type": "text",
          "key": "vehicleType",
          "populators": {
            "name": "vehicleType",
            "defaultValue": "",
            "className": "payment-form-text-input-correction",
          }
        },
        {
          "label": "ES_FSM_REGISTRY_NEW_VEHICLE_MODAL",
          "isMandatory": false,
          "type": "text",
          "key": "vehicleModal",
          "populators": {
            "name": "vehicleModal",
            "defaultValue": "",
            "className": "payment-form-text-input-correction",
          }
        },
        {
          "label": "ES_FSM_REGISTRY_NEW_TANK_CAPACITY",
          "isMandatory": false,
          "type": "text",
          "key": "tankCapacity",
          "populators": {
            "name": "tankCapacity",
            "defaultValue": "",
            "className": "payment-form-text-input-correction",
          }
        },
        {
          "label": "ES_FSM_REGISTRY_NEW_POLLUTION",
          "isMandatory": false,
          "type": "custom",
          "key": "pollutionCert",
          "populators": {
            "name": "dob",
            "validation": {
              "required": true,
            },
            "component": (props, customProps) => <DatePicker disabled={disabled} onChange={props.onChange} date={props.value} {...customProps} />,
          }
        },
        {
          "label": "ES_FSM_REGISTRY_NEW_INSURANCE",
          "isMandatory": false,
          "type": "custom",
          "key": "insurance",
          "populators": {
            "name": "dob",
            "validation": {
              "required": true,
            },
            "component": (props, customProps) => <DatePicker disabled={disabled} onChange={props.onChange} date={props.value} {...customProps} />,
          }
        },
        {
          "label": "ES_FSM_REGISTRY_NEW_ROAD_TAX",
          "isMandatory": false,
          "type": "custom",
          "key": "roadTax",
          "populators": {
            "name": "dob",
            "validation": {
              "required": true,
            },
            "component": (props, customProps) => <DatePicker disabled={disabled} onChange={props.onChange} date={props.value} {...customProps} />,
          }
        },
        {
          "label": "ES_FSM_REGISTRY_NEW_VENDOR_ADDITIONAL_DETAILS",
          "isMandatory": false,
          "type": "textarea",
          "key": "additionalDetails",
          "populators": {
            "name": "additionalDetails",
            "className": "payment-form-text-input-correction",
          }
        }
      ]
    }
  ]
}

export default VehicleConfig