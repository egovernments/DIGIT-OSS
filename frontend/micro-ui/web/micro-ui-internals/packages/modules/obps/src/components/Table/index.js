import React from "react";
import { Table } from "antd";

// rowSelection object indicates the need for row selection
const rowSelection = {
  getCheckboxProps: (record) => ({
    disabled: record.name === "Disabled User", // Column configuration not to be checked
    name: record.name,
  }),
};

const WorkingTable = ({ columns, data }) => {
  return (
    <div>
      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </div>
  );
};

export default WorkingTable;
