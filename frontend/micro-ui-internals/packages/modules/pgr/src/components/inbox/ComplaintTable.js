import React from "react";
import { Loader, Table } from "@egovernments/digit-ui-react-components";

const ComplaintTable = ({ columns, data, getCellProps }) => {
  return <React.Fragment>{data.length > 0 ? <Table data={data} columns={columns} getCellProps={getCellProps} /> : <Loader />}</React.Fragment>;
};

export default ComplaintTable;
