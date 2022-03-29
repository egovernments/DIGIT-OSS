import React, { Fragment } from "react";
import SearchApplication from "../../../components/SearchApplication/index.js";
import SearchWaterConnection from "../../../components/SearchWaterConnection/index.js";

const SearchWaterConnectionView = ({ data, onSubmit, count, resultOk }) => {
  return (
    <>
      <SearchWaterConnection onSubmit={onSubmit} data={data} count={count} resultOk={resultOk} />
    </>
  );
};

export default SearchWaterConnectionView;
