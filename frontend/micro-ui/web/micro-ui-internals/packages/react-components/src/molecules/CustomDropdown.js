import _ from "lodash";
import React from "react";
import { Loader } from "../atoms/Loader";
import RadioButtons from "../atoms/RadioButtons";
import Dropdown from "../atoms/Dropdown";

/**
 * Custom Dropdown / Radio Button component can be used mostly via formcomposer
 *
 * @author jagankumar-egov
 *
 * @example
 * 
 * 
 * {
 * component: "CustomDropdown",
        isMandatory: false,
        key: "gender",
        type: "radio",
        label: "Enter Gender",
        disable: false,
        populators: {
          name: "gender",
          optionsKey: "name",
          error: "sample required message",
          required: false,
          options: [
            {
              code: "MALE",
              name: "MALE",
            },
            {
              code: "FEMALE",
              name: "FEMALE",
            },
            {
              code: "TRANSGENDER",
              name: "TRANSGENDER",
            },
          ],
        },
      }
or 
      {
        component: "CustomDropdown",
        isMandatory: true,
        key: "genders",
        type: "radioordropdown",
        label: "Enter Gender",
        disable: false,
        populators: {
          name: "genders",
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
 *
 */
const CustomDropdown = ({ t, config, inputRef, label, onChange, value, errorStyle, disable, type, additionalWrapperClass = "" }) => {
  const master = { name: config?.mdmsConfig?.masterName };
  if (config?.mdmsConfig?.filter) {
    master["filter"] = config?.mdmsConfig?.filter;
  }
  const { isLoading, data } = Digit.Hooks.useCustomMDMS(Digit.ULBService.getStateId(), config?.mdmsConfig?.moduleName, [master], {
    select: config?.mdmsConfig?.select
      ? Digit.Utils.createFunction(config?.mdmsConfig?.select)
      : (data) => {
          const optionsData = _.get(data, `${config?.mdmsConfig?.moduleName}.${config?.mdmsConfig?.masterName}`, []);
          return optionsData
            .filter((opt) => (opt?.hasOwnProperty("active") ? opt.active : true))
            .map((opt) => ({ ...opt, name: `${config?.mdmsConfig?.localePrefix}_${Digit.Utils.locale.getTransformedLocale(opt.code)}` }));
        },
    enabled: config?.mdmsConfig ? true : false,
  });
  if (isLoading) {
    return <Loader />;
  }

  // const getValue = () => {
  //   let selectedValue = ""
  //   if(data?.length === 1 || config?.options?.length === 1) {
  //     selectedValue = data?.[0] || config?.options?.[0]
  //   } else {
  //     selectedValue = value
  //   }
  //   return selectedValue
  // }
  return (
    <React.Fragment key={config.name}>
      {/* <LabelFieldPair>
        <CardLabel className="card-label-smaller">
          {t(label)}
          {config.required ? " * " : null}
        </CardLabel> */}
      {type === "radio" ? (
        <RadioButtons
          inputRef={inputRef}
          style={{ display: "flex", justifyContent: "flex-start", gap: "3rem", ...config.styles }}
          options={data || config?.options || []}
          key={config.name}
          optionsKey={config?.optionsKey}
          value={value}
          onSelect={(e) => {
            onChange(e, config.name);
          }}
          disable={disable}
          selectedOption={value}
          defaultValue={value}
          t={t}
          errorStyle={errorStyle}
          additionalWrapperClass={additionalWrapperClass}
          innerStyles={config?.innerStyles}
        />
      ) : (
        <Dropdown
          inputRef={inputRef}
          style={{ display: "flex", justifyContent: "space-between", ...config.styles }}
          option={data || config?.options || []}
          key={config.name}
          optionKey={config?.optionsKey}
          value={value}
          select={(e) => {
            onChange(e, config.name);
          }}
          disable={disable}
          selected={value || config.defaultValue}
          defaultValue={value || config.defaultValue}
          t={t}
          errorStyle={errorStyle}
          optionCardStyles={config?.optionsCustomStyle}
        />
      )}
      {/* </LabelFieldPair> */}
    </React.Fragment>
  );
};

export default CustomDropdown;
