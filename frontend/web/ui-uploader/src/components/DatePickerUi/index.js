import React from "react";
import DatePicker from "material-ui/DatePicker";
import "./style.css";

const DatePickerUi = ({ value, startDate, onChange, label, maxDate }) => {
  return (
    <DatePicker
      value={value}
      className="custom-form-control-for-datepicker"
      onChange={onChange}
      floatingLabelText={label}
      fullWidth={true}
      maxDate={maxDate}
    />
  );
};

export default DatePickerUi;
