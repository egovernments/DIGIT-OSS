import React from "react";
import { SearchIconSvg } from "../atoms/svgindex";

const SearchAction = ({ text, handleActionClick }) => (
  <div class="searchAction" onClick={handleActionClick}>
    <SearchIconSvg /> <span class="searchText">{text}</span>
  </div>
);

export default SearchAction;
