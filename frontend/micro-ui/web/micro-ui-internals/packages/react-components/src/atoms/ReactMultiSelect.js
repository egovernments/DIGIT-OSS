import React from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";

const MultiSelectField = (props) => {
  return (
    <div className="app-input-text">
      {/* <Controller render={<Select options={props?.data} />} name={props?.name} control={props?.control} defaultValue={null} /> */}

      <Controller
        {...props}
        render={({ field }) => (
          <Select
            isMulti={props.multiSelect}
            placeholder={props?.placeholder}
            // styles={style}
            {...field}
            options={props?.data}
            isDisabled={props?.isDisabled}
            value={props?.value}
            onChange={props?.onChange}
          />
        )}
      />
    </div>
  );
};
export default MultiSelectField;
