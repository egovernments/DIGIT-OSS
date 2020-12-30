import React from "react";
import { Table } from "@egovernments/digit-ui-react-components";

const ComplaintTable = ({ columns, data, getCellProps }) => {
  return <Table data={data} columns={columns} getCellProps={getCellProps} />;
};

export default ComplaintTable;
