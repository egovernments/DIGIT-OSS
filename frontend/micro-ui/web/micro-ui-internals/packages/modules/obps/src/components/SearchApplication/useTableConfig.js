import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { convertEpochToDateDMY } from "../../utils";

const useSearchApplicationTableConfig = ({t}) => {

    const getRedirectionLink = (bService) => {
        let redirectBS = bService === "BPAREG"?"search/application/stakeholder":"search/application/bpa";
        if (window.location.href.includes("/citizen")) {
          redirectBS = bService === "BPAREG"?"stakeholder":"bpa";
        }
        return redirectBS;
    }
    const GetCell = (value) => <span className="cell-text">{value}</span>;
    
    return useMemo( () => ([
        {
          Header: t("BPA_APPLICATION_NUMBER_LABEL"),
          accessor: "applicationNo",
          disableSortBy: true,
          Cell: ({ row }) => {
            return (
              <div>
                <span className="link">
                  <Link to={window.location.href.includes("/citizen")  ? `/digit-ui/citizen/obps/${getRedirectionLink(row.original["businessService"]) || "--"}/${row.original["applicationNo"] || row.original["applicationNumber"]}` : `/digit-ui/employee/obps/${getRedirectionLink(row.original["businessService"]) || "--"}/${row.original["applicationNo"] || row.original["applicationNumber"]}`}>
                    {row.original["applicationNo"] || row.original["applicationNumber"]}
                  </Link>
                </span>
              </div>
            );
          },
        },
        {
            Header: t("BPA_COMMON_TABLE_COL_APP_DATE_LABEL"),
            disableSortBy: true,
            accessor: (row) => GetCell(row?.auditDetails?.createdTime ? convertEpochToDateDMY(row?.auditDetails?.createdTime) : ""),
        },
        {
            Header: t("BPA_SEARCH_APPLICATION_TYPE_LABEL"),
            disableSortBy: true,
            accessor: "applicationType",
            Cell: ({ row }) => {
                return (
                    <div>
                      <span className="cell-text">
                      {row.original?.additionalDetails?.applicationType ? t(`WF_BPA_${row.original?.additionalDetails?.applicationType}`) : row.original?.businessService ? t(`BPA_APPLICATIONTYPE_${row?.original?.businessService}`) : "-"}
                      </span>
                    </div>
                  );
            },
        },
        {
            Header: t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"),
            disableSortBy: true,
            accessor: (row) => GetCell(t(row.additionalDetails?.serviceType || t(`TRADELICENSE_TRADETYPE_${row?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType?.split(".")[0]}`) || "-")),
        },
        {
          Header: t("BPA_CURRENT_OWNER_HEAD"),
          accessor: (row) => GetCell(row?.assignee || "-"),
          // accessor: (row) => GetCell(row.businessService === "BPAREG"?row?.tradeLicenseDetail?.owners.map( o => o.name ). join(",") || "-" : row?.landInfo?.owners.map( o => o.name ). join(",") || "-"),
          disableSortBy: true,
        },
        {
          Header: t("BPA_STATUS_LABEL"),
          accessor: (row) =>GetCell(t(row?.state&&`WF_BPA_${row.state}` || row?.state&&`WF_BPA_${row.status}`|| "NA") ),
          disableSortBy: true,
        }
      ]), [] )
}

export default useSearchApplicationTableConfig