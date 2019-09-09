import React from "react";
import TimePicker from "material-ui/TimePicker";
import PropTypes from "prop-types";
import "./index.css";
// {onChange,autoOk,floatingLabelText}
const TimePickerUi = (props) => {
  return <TimePicker {...props} />;
};

export default TimePickerUi;

TimePickerUi.propTypes = {
  props: PropTypes.object,
};
