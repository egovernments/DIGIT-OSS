import React, { Fragment } from "react";
import TimePicker from "react-time-picker";

const CustomTimePicker = ({ name, value, onChange }) => {

  const onBlurHandle = () => {
    const time = value?.split(':')
    const min = time?.[1]
    onChange(value)
    let minInputs = document.getElementsByClassName('react-time-picker__inputGroup__minute');
    for (let mItem of minInputs) {
      let mValue = mItem.value;
      mItem.value = Number(mValue) < 60 ? mValue : min;
    }
  }

  return <TimePicker name={name} onChange={onChange} onBlur={onBlurHandle} value={value} locale="en-US" disableClock={false} clearIcon={null} format="h:mm a" />;
};

export default CustomTimePicker;
