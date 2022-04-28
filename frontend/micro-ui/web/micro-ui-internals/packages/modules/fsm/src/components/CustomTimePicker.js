import React, { Fragment } from "react";
import TimePicker from "react-time-picker";

const CustomTimePicker = ({ name, value, onChange }) => {
  return <TimePicker name={name} onChange={onChange} value={value} locale="en-US" disableClock={false} clearIcon={null} format="h:mm a" />;
};

export default CustomTimePicker;
