import React from "react";
import { SearchIconSvg } from "../atoms/svgindex";

const SearchAction = ({ text, handleActionClick }) => (
  <div className="searchAction" onClick={handleActionClick}>
    <SearchIconSvg /> <span className="searchText">{text}</span>
  </div>
);

export default SearchAction;
