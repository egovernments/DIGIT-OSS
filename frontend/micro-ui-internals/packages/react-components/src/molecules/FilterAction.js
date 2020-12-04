import React from "react";
import { FilterSvg } from "../atoms/svgindex";

const FilterAction = ({ text, handleActionClick }) => (
  <div class="searchAction" onClick={handleActionClick}>
    <FilterSvg /> <span class="searchText">{text}</span>
  </div>
);

export default FilterAction;
