import React from "react";
import { useQuery } from "react-query";
import DsoDetails from "../../services/molecules/FSM/DsoDetails";

const useDsoSearch = (tenantId, filters, config = {}) => {
  return useQuery(["DSO_SEARCH", filters], () => DsoDetails(tenantId, filters), config);
};

export default useDsoSearch;
