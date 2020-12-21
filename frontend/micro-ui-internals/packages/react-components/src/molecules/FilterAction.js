import React from "react";
import { FilterSvg } from "../atoms/svgindex";

const FilterAction = ({ text, handleActionClick }) => (
  <div className="searchAction" onClick={handleActionClick}>
    <FilterSvg /> <span className="searchText">{text}</span>
  </div>
);

export default FilterAction;
