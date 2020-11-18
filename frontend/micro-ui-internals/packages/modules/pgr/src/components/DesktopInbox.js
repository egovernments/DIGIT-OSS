import { CheckBox } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import ComplaintsLink from "./inbox/ComplaintLinks";
import ComplaintTable from "./inbox/ComplaintTable";
import Filter from "./inbox/Filter";
import SearchComplaint from "./inbox/search";

const DesktopInbox = (props) => {
  const GetCell = (value) => <span style={{ color: "#505A5F" }}>{value}</span>;

  const columns = React.useMemo(
    () => [
      {
        Header: "Complaint no",
        Cell: (row) => {
          return (
            <div>
              <a href="http://google.com">{row.row.original.service.serviceRequestId}</a>
              <br />
              <span style={{ marginTop: "4px", color: "#505A5F" }}>{row.row.original.service.serviceCode}</span>
            </div>
          );
        },
      },
      {
        Header: "Locality",
        Cell: (row) => {
          return GetCell(row.row.original.service.address.locality.code);
        },
      },
      {
        Header: "Status",
        Cell: (row) => {
          return GetCell(row.row.original.service.applicationStatus);
        },
      },
      {
        Header: "Task Owner",
        Cell: (row) => {
          return GetCell(row.row.original.service.citizen.userName);
        },
      },
      {
        Header: "SLA Remaining",
        Cell: (row) => {
          return GetCell(row.row.original.service.tenantId);
        },
      },
    ],
    []
  );

  return (
    <div
      // style={{
      //   display: "flex",
      //   justifyContent: "center",
      //   border: "1px solid black",
      // }}
      className="inbox-container"
    >
      <div style={{ width: "270px" }}>
        <ComplaintsLink />
        <div style={{ marginTop: "16px" }}>
          <Filter onFilterChange={(filters) => props.onFilterChange(filters)} />
        </div>
      </div>
      <div style={{ marginLeft: "24px", width: "874px" }}>
        <SearchComplaint />
        <div style={{ marginTop: "24px" }}>
          <ComplaintTable
            data={props.data}
            columns={columns}
            getCellProps={(cellInfo) => {
              return {
                style: {
                  padding: "20px 18px",
                  fontSize: "16px",
                  borderTop: "1px solid grey",
                  textAlign: "left",
                  verticalAlign: "middle",
                },
              };
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DesktopInbox;
