import { CheckBox } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useRouteMatch } from "react-router-dom";
import FSMLink from "./inbox/FSMLink";
import ApplicationTable from "./inbox/ApplicationTable";
import Filter from "./inbox/Filter";
import SearchApplication from "./inbox/search";
import { useHistory } from "react-router-dom";

const DesktopInbox = (props) => {
  const { t } = useTranslation();
  let { match } = useRouteMatch();
  const GetCell = (value) => <span style={{ color: "#505A5F" }}>{value}</span>;
  const GetSlaCell = (value) => {
    return value < 0 ? (
      <span style={{ color: "#D4351C", backgroundColor: "rgba(212, 53, 28, 0.12)", padding: "0 24px", borderRadius: "11px" }}>{value}</span>
    ) : (
      <span style={{ color: "#00703C", backgroundColor: "rgba(0, 112, 60, 0.12)", padding: "0 24px", borderRadius: "11px" }}>{value}</span>
    );
  };
  const history = useHistory();

  function goTo(id) {
    // console.log("id", id);
    // history.push("/digit-ui/employee/fsm/complaint/details/" + id);
  }

  const columns = React.useMemo(
    () => [
      {
        Header: t("ES_APPLICATION_NO"),
        accessor: "applicationNo",
        // Cell: (row) => {
        //   return (
        //     <div>
        //       <span className="link">
        //         <Link to={"/digit-ui/employee/fsm/complaint/details/" + row.row.original["serviceRequestId"]}>
        //           {row.row.original["serviceRequestId"]}
        //         </Link>
        //       </span>
        //       {/* <a onClick={() => goTo(row.row.original["serviceRequestId"])}>{row.row.original["serviceRequestId"]}</a> */}
        //       <br />
        //       <span style={{ marginTop: "4px", color: "#505A5F" }}>{t(`SERVICEDEFS.${row.row.original["complaintSubType"].toUpperCase()}`)}</span>
        //     </div>
        //   );
        // },
      },
      {
        Header: t("ES_APPLICATION_DATE"),
        accessor: "applicationDate",
        // Cell: (row) => {
        //   return GetCell(
        //     t(row.row.original["locality"].includes("_") ? row.row.original["locality"] : `PB_AMRITSAR_ADMIN_${row.row.original["locality"]}`)
        //   );
        // },
      },
      {
        Header: t("ES_LOCALITY"),
        accessor: "locality",
        // Cell: (row) => {
        //   return GetCell(t(`CS_COMMON_${row.row.original["status"]}`));
        // },
      },
      {
        Header: t("ES_STATUS"),
        accessor: "status",
        // Cell: (row) => {
        //   return GetCell(row.row.original["taskOwner"]);
        // },
      },
      {
        Header: t("ES_INBOX_SLA_DAYS_REMAINING"),
        accessor: "slaDaysRemaining",
        // Cell: (row) => {
        //   return GetSlaCell(row.row.original["sla"]);
        // },
      },
    ],
    []
  );

  return (
    <div className="inbox-container">
      <div className="filters-container">
        <FSMLink />
        <div>
          <Filter applications={props.data} onFilterChange={props.onFilterChange} type="desktop" />
        </div>
      </div>
      <div>
        <SearchApplication onSearch={props.onSearch} type="desktop" />
        <div style={{ marginTop: "24px", marginTop: "24px", width: "874px", marginLeft: "24px" }}>
          <ApplicationTable
            data={props.data}
            columns={columns}
            getCellProps={(cellInfo) => {
              return {
                style: {
                  minWidth: cellInfo.column.Header === t("ES_APPLICATION_NO") ? "240px" : "",
                  padding: "20px 18px",
                  fontSize: "16px",
                  // borderTop: "1px solid grey",
                  // textAlign: "left",
                  // verticalAlign: "middle",
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
