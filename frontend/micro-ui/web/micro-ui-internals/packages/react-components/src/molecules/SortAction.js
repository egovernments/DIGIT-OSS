import React from "react";
import { SortSvg } from "../atoms/svgindex";
import RoundedLabel from "../atoms/RoundedLabel";

const SortAction = ({ text, handleActionClick, ...props }) => (
  <div className="searchAction svgPrimaryH16px" onClick={handleActionClick}>
    <RoundedLabel count={props.filterCount}></RoundedLabel>
    <SortSvg /> <span className="searchText">{text}</span>
  </div>
);

export default SortAction;
