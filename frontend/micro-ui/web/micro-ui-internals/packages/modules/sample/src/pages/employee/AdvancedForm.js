import { Loader, FormComposerV2 } from "@egovernments/digit-ui-react-components";
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import _ from "lodash";
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
        populators: { name: "salutation", error: "Required", validation: { pattern: /^[A-Za-z]+$/i, maxlength: 5 } },
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
        type: "dropdown",
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
        populators: { name: "dob", error: "Required", validation: { required: true } },
      },
      {
        label: "Phone number",
        isMandatory: true,
        type: "mobileNumber",
        disable: false,
        populators: { name: "phNumber", error: "sample error message", validation: { min: 5999999999, max: 9999999999 } },
      },

      {
        label: "COMMON_WARD",
        type: "locationdropdown",
        isMandatory: false,
        disable: false,
        populators: {
          name: "ward",
          type: "ward",
          optionsKey: "i18nKey",
          defaultText: "COMMON_SELECT_WARD",
          selectedText: "COMMON_SELECTED",
          allowMultiSelect: false,
        },
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
        isMandatory: true,
        key: "referenceOfficer",
        type: "radioordropdown",
        label: "Reference Officer",
        disable: false,
        preProcess: {
          updateDependent: ["populators.options"],
        },
        populators: {
          name: "referenceOfficer",
          optionsKey: "name",
          error: "WORKS_REQUIRED_ERR",
          required: false,
          optionsCustomStyle: {
            top: "2.5rem",
          },
          options: [],
        },
      },
      {
        inline: true,
        label: "Enter Random Amount",
        isMandatory: false,
        key: "amountInRs",
        type: "amount",
        disable: false,
        preProcess: {
          convertStringToRegEx: ["populators.validation.pattern"],
        },
        populators: {
          prefix: "₹ ",
          name: "amountInRs",
          error: "PROJECT_PATTERN_ERR_MSG_PROJECT_ESTIMATED_COST",
          validation: {
            pattern: "^[1-9]\\d*(\\.\\d+)?$",
            maxlength: 16,
            step: "0.01",
            min: 0,
            max: 5000000,
          },
        },
      },
    ],
  },
  {
    head: "Application Subheading",
    body: [
      {
        isMandatory: true,
        type: "dropdown",
        key: "department",
        label: "department",
        disable: false,
        populators: {
          name: "department",
          optionsKey: "name",
          error: "sample required message",
          required: true,
          mdmsConfig: {
            masterName: "Department",
            moduleName: "common-masters",
            localePrefix: "COMMON_DEPARTMENT",
          },
        },
      },
      {
        isMandatory: true,
        key: "nameOfOfficerInCharge",
        type: "radioordropdown",
        label: "Name of the officer in selected department",
        disable: false,
        preProcess: {
          updateDependent: ["populators.options"],
        },
        populators: {
          name: "nameOfOfficerInCharge",
          optionsKey: "name",
          error: "WORKS_REQUIRED_ERR",
          required: false,
          optionsCustomStyle: {
            top: "2.5rem",
          },
          options: [],
        },
      },
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
        type: "component",
        component: "SampleComponent",
        withoutLabel: true,
        key: "comments",
      },
    ],
  },
];

const convertToDependenyConfig = (config = []) => {
  const newConfig = {
    form: [...config],
  };
  return newConfig;
};

const AdvancedCreate = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const reqCriteriaCreate = {
    url: `/contract/v1/_create`,
    params: {},
    body: {},
    config: {
      enabled: true,
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaCreate);
  const history = useHistory();
  const [dept, setDept] = useState("");
  const requestCriteria = {
    url: "/egov-hrms/employees/_search",
    body: {},
    params: {
      // tenantId:tenantId,
      tenantId: "pg.citya",
      limit: 10,
      offset: 0,
      sortOrder: "ASC",
      // departments: ADM
      // roles: SYSTEM,EMPLOYEE
    },
    config: {
      select: (data) => data?.Employees?.map((e) => ({ code: e?.code, name: e?.user?.name })),
    },
  };
  const requestCriteria1 = {
    url: "/egov-hrms/employees/_search",
    body: {},
    changeQueryName: `custom-${dept}`,
    params: {
      // tenantId:tenantId,
      tenantId: "pg.citya",
      limit: 10,
      offset: 0,
      sortOrder: "ASC",
      departments: dept,
      // roles: SYSTEM,EMPLOYEE
    },
    config: {
      enabled: dept?.length > 0,
      cacheTime: 0,
      select: (data) => data?.Employees?.map((e) => ({ code: e?.code, name: e?.user?.name })),
    },
  };
  const { isLoading, data: empData = [] } = Digit.Hooks.useCustomAPIHook(requestCriteria);
  const { isLoading: isLoadingEmpData, data: filteredEmpData = [], revalidate } = Digit.Hooks.useCustomAPIHook(requestCriteria1);

  console.log(empData, "empData", filteredEmpData);
  const onSubmit = (data) => {
    ///
    console.log(data, "data");
    const onError = (resp) => {
      history.push(`/${window.contextPath}/employee/sample/response?isSuccess=${false}`, { message: "TE_CREATION_FAILED" });
    };

    const onSuccess = (resp) => {
      history.push(`/${window.contextPath}/employee/sample/response?appNo=${resp.contracts[0].supplementNumber}&isSuccess=${true}`, {
        message: isEdit ? "TE_EDIT_SUCCESS" : "TE_CREATION_SUCCESS",
        showID: true,
        label: "REVISED_WO_NUMBER",
      });
    };

    mutation.mutate(
      {
        params: {},
        body: {
          contract: {
            ...data,
          },
          workflow: {
            action: "CREATE",

            comment: null,
          },
        },
      },
      {
        onError,
        onSuccess,
      }
    );
  };

  /* use newConfig instead of commonFields for local development in case needed */

  const configs = newConfig ? newConfig : newConfig;
  const updatedConfig = useMemo(() => {
    const processedConfig = Digit.Utils.preProcessMDMSConfig(t, convertToDependenyConfig(configs), {
      updateDependent: [
        {
          key: "nameOfOfficerInCharge",
          value: [filteredEmpData],
        },
        {
          key: "referenceOfficer",
          value: [empData],
        },
      ],
    });
    console.log(processedConfig, "processedConfig");
    return processedConfig?.form;
  }, [empData, filteredEmpData]);

  const onFormValueChange = (setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
    if (dept == "" && formData?.department?.code) {
      setDept(formData?.department?.code);
      revalidate();
    }
    console.log(formData, "formData");
  };
  return (
    <FormComposerV2
      heading={t("Application Heading")}
      label={t("Submit Bar")}
      description={"Description"}
      text={"Sample Text if required"}
      config={updatedConfig.map((config) => {
        return {
          ...config,
          body: config.body.filter((a) => !a.hideInEmployee),
        };
      })}
      defaultValues={{}}
      onFormValueChange={onFormValueChange}
      onSubmit={onSubmit}
      fieldStyle={{ marginRight: 0 }}
    />
  );
};

export default AdvancedCreate;
