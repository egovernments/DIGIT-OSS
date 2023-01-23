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
const CustomDropdown = ({ t, config, inputRef, label, onChange, value, errorStyle, disable, type, additionalWrapperClass="" }) => {
  const { isLoading, data } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getStateId(),
    config?.mdmsConfig?.moduleName,
    [{ name: config?.mdmsConfig?.masterName }],
    {
      select: (data) => {
        const optionsData = _.get(data, `${config?.mdmsConfig?.moduleName}.${config?.mdmsConfig?.masterName}`, []);
        return optionsData.filter((opt) => opt?.active).map((opt) => ({ ...opt, name: `${config?.mdmsConfig?.localePrefix}_${opt.code}` }));
      },
      enabled: config?.mdmsConfig ? true : false,
    }
  );
  if (isLoading) {
    return <Loader />;
  }
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
              style={{ display: "flex", justifyContent: "flex-start", gap: "3rem" }}
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
            />
          ) : (
            <Dropdown
              inputRef={inputRef}
              style={{ display: "flex", justifyContent: "space-between" }}
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
