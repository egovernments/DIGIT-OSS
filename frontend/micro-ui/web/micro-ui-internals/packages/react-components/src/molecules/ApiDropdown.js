import React, { Fragment, useState, useEffect } from "react";
import MultiSelectDropdown from "../atoms/MultiSelectDropdown";
import Dropdown from "../atoms/Dropdown";
import { Loader } from "../atoms/Loader";
import { useTranslation } from "react-i18next";
import _ from "lodash";
const ApiDropdown = ({ populators, formData, props, inputRef, errors }) => {
  //based on type (ward/locality) we will render dropdowns respectively
  //here we will render two types of dropdown based on allowMultiSelect boolean
  // for singleSelect render <Dropdown/>

  const [options, setOptions] = useState([]);

  const { t } = useTranslation();


  const reqCriteria = Digit?.Customizations?.[populators?.masterName]?.[populators?.moduleName]?.[populators?.customfn]()

  const { isLoading: isApiLoading, data: apiData, revalidate, isFetching: isApiFetching } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  useEffect(() => {
    setOptions(apiData);
  }, [apiData]);

  if (isApiLoading) return <Loader />;

  return (
    <>
      {populators.allowMultiSelect && (
        <div style={{ display: "grid", gridAutoFlow: "row" }}>
          <MultiSelectDropdown
            options={options}
            optionsKey={populators?.optionsKey}
            props={props} //these are props from Controller
            isPropsNeeded={true}
            onSelect={(e) => {
              props.onChange(
                e
                  ?.map((row) => {
                    return row?.[1] ? row[1] : null;
                  })
                  .filter((e) => e)
              );
            }}
            selected={props?.value}
            defaultLabel={t(populators?.defaultText)}
            defaultUnit={t(populators?.selectedText)}
            config={populators}
          />
        </div>
      )}
      {!populators.allowMultiSelect && (
        <Dropdown
          inputRef={inputRef}
          style={{ display: "flex", justifyContent: "space-between" }}
          option={options}
          key={populators.name}
          optionKey={populators?.optionsKey}
          value={props.value?.[0]}
          select={(e) => {
            props.onChange([e], populators.name);
          }}
          selected={props.value?.[0] || populators.defaultValue}
          defaultValue={props.value?.[0] || populators.defaultValue}
          t={t}
          errorStyle={errors?.[populators.name]}
          optionCardStyles={populators?.optionsCustomStyle}
        />
      )}
    </>
  );
};

export default ApiDropdown;
