import React from "react";
import { Calender } from "./svgindex";

const DateWrap = (props) => {
  return (
    <div className="date-wrap">
      <Calender />
      <p>{props.date}</p>
    </div>
  );
};

export default DateWrap;
