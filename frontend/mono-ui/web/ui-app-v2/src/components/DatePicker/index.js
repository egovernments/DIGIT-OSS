import React from "react";
import DatePicker from "material-ui/DatePicker";
import "./index.css";
import PropTypes from "prop-types";

const DatePickerUi = (props) => {
  return <DatePicker {...props} />;
};

export default DatePickerUi;

DatePickerUi.propTypes = {
  props: PropTypes.object,
};
