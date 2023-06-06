import { Loader, FormComposerV2  } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const newConfig = [
  {
    head: "Sample Object Creation",
    subHead: "Supporting Details",
    body: [
      {
        inline: true,
        label: "Salutation",
        isMandatory: false,
        type: "text",
        disable: false,
        populators: { name: "salutation", error: "Required", validation: { pattern: /^[A-Za-z]+$/i , maxlength:5} },
      },
      {
        inline: true,
        label: "Name",
        isMandatory: true,
        type: "text",
        disable: false,
        populators: { name: "name", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        isMandatory: true,
        type: "radio",
                key: "genders",
        label: "Gender",
        disable: false,
        populators: {
          name: "gender",
          optionsKey: "name",
          error: "sample required message",
          required: true,
          mdmsConfig: {
            masterName: "GenderType",
            moduleName: "common-masters",
            localePrefix: "COMMON_GENDER",
          },
        },
      },
      {
        label: "Age",
        isMandatory: true,
        type: "number",
        disable: false,
        populators: { name: "age", error: "sample error message", validation: { min: 0, max: 100 } },
      },
      {
        inline: true,
        label: "DOB",
        isMandatory: true,
        description: "Please enter a valid Date of birth",
        type: "date",
        disable: false,
        populators: { name: "dob", error: "Required", validation: { required:true, } },
      },
      {
        label: "Phone number",
        isMandatory: true,
        type: "mobileNumber",
        disable: false,
        populators: { name: "phNumber", error: "sample error message", validation: { min: 5999999999, max: 9999999999 } },
      },
      
      {
        "label": "COMMON_WARD",
        "type": "locationdropdown",
        "isMandatory": false,
        "disable": false,
        "populators": {
            "name": "ward",
            "type": "ward",
            "optionsKey": "i18nKey",
            "defaultText": "COMMON_SELECT_WARD",
            "selectedText": "COMMON_SELECTED",
            "allowMultiSelect": false
        }
      },
      {
        inline: true,
        label: "Address",
        isMandatory: false,
        description: "address details",
        type: "textarea",
        disable: false,
        populators: { name: "address", error: "Required", validation: { pattern: /^[A-Za-z]+$/i } },
      },
      {
        "inline": true,
        "label": "Enter Random Amount",
        "isMandatory": false,
        "key": "amountInRs",
        "type": "amount",
        "disable": false,
        "preProcess": {
            "convertStringToRegEx": [
              "populators.validation.pattern"
            ]
        },
        "populators": {
          "prefix":"₹ ",
            "name": "amountInRs",
            "error": "PROJECT_PATTERN_ERR_MSG_PROJECT_ESTIMATED_COST",
            "validation": {
              "pattern": "^[1-9]\\d*(\\.\\d+)?$",
              "maxlength" : 16,
              "step" : "0.01",
              "min" : 0,
              "max" : 5000000
            }
          }
      }
    ],
  },
  {
    head: "Application Subheading",
    body: [
      {
        label: "Additional Details",
        isMandatory: true,
        description: "Additional Details if any",
        key: "additionalDetails",
        type: "text",
        disable: false,
        populators: { name: "additionalDetails", error: "sample error message", validation: { pattern: /^[A-Za-z]+$/i } },
      },
   
      // {
      //   isMandatory: true,
      //   key: "genders",
      //   type: "radioordropdown",
      //   label: "Enter Gender",
      //   disable: false,
      //   populators: {
      //     name: "genders",
      //     optionsKey: "name",
      //     error: "sample required message",
      //     required: true,
      //     mdmsConfig: {
      //       masterName: "GenderType",
      //       moduleName: "common-masters",
      //       localePrefix: "COMMON_GENDER",
      //     },
      //   },
      // },
      {
        isMandatory: false,
        key: "priority",
        type: "radio",
        label: "Enter Priority of Application",
        disable: false,
        populators: {
          name: "priority",
          optionsKey: "name",
          error: "sample required message",
          required: false,
          options: [
            {
              code: "1",
              name: "P1",
            },
            {
              code: "2",
              name: "P2",
            },
            {
              code: "3",
              name: "P3",
            },
          ],
        },
      },
      {
        "type": "component",
        "component": "SampleComponent",
        "withoutLabel": true,
        "key": "comments"
      },
    ],
  },
];

const Create = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();

  const onSubmit = (data) => {
    console.log(data, "data");
  };

  /* use newConfig instead of commonFields for local development in case needed */

  const configs = newConfig ? newConfig : newConfig;

  return (
    <FormComposerV2
      heading={t("Application Heading")}
      label={t("Submit Bar")}
      description={"Description"}
      text={"Sample Text if required"}
      config={configs.map((config) => {
        return {
          ...config,
          body: config.body.filter((a) => !a.hideInEmployee),
        };
      })}
      defaultValues={{}}
      onSubmit={onSubmit}
      fieldStyle={{ marginRight: 0 }}
    />
  );
};

export default Create;