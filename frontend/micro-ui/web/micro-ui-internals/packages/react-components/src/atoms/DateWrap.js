import React from "react";
import PropTypes from "prop-types";
import { Calender } from "./svgindex";

const DateWrap = (props) => {
  return (
    <div className="date-wrap">
      <Calender />
      <p>{props.date}</p>
    </div>
  );
};

DateWrap.propTypes = {
  /**
   * date
   */
  date: PropTypes.any,
};

DateWrap.defaultProps = {
  date: 0,
};

export default DateWrap;
