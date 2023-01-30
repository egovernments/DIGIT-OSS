import React from "react";
import NumberFormat from "react-number-format";
// import { NumericFormat } from "react-number-format";
import { Controller } from "react-hook-form";

const NumberInput = (props) => {
  return (
    <div className="app-input-text">
      <Controller
        render={({ field: { onChange, value } }) => (
          <NumberFormat
            onChange={(e) => {
              onChange(e?.target?.value);
              if (props?.onChangeHandler) props?.onChangeHandler(props?.name, e?.target?.value);
              if (props?.onChange) props?.onChange(e);
            }}
            onBlur={(e) => {
              if (props?.onBlur) props?.onBlur(e?.target?.value);
            }}
            thousandSeparator={props.thousandSeparator}
            format={props?.format}
            allowNegative={false}
            value={props?.value ? props?.value : value}
            customInput={props?.customInput}
            decimalScale={props.decimalScale}
            disabled={props.disabled}
            className={props.className}
            label={props.label}
            fullWidth
            helperText={props.helperText}
            id={props?.id}
            placeholder={props.placeholder}
            name={props?.name}
            inputProps={props.inputProps}
            allowLeadingZeros={true}
          />
        )}
        name={props?.name}
        control={props.control}
      />
    </div>
  );
};
export default NumberInput;
