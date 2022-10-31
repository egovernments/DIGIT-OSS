import React from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";

const MultiSelectField = (props) => {
  return (
    <div className="app-input-text">
      {/* <Controller render={<Select options={props?.data} />} name={props?.name} control={props?.control} defaultValue={null} /> */}

      <Controller
        // {...props}
        name={props?.name}
        control={props?.control}
       
          render={({ field: { onChange, value } }) => (
          <Select
            isMulti={props.multiSelect}
            placeholder={props?.placeholder}
            // styles={style}
            // {...field}
            value={props?.value ? props?.data?.filter((option) => option?.value === props?.value) : value}
            onChange={(e) => {
              // console.log("eee", e);
              onChange(e);
              // selected.current = e;
              if (props?.onChange) props?.onChange(e);
            }}
            options={props?.data}
            isDisabled={props?.isDisabled}
            // value={props?.value}
            // onChange={props?.onChange}
          />
        )}
      />
    </div>
  );
};
export default MultiSelectField;
