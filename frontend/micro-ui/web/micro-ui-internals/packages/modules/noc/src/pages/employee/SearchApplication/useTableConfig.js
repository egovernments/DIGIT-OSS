import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const useSearchApplicationTableConfig = () => {
    const {t} = useTranslation()
    const getRedirectionLink = (bService) => {
        let redirectBS = bService === "BPAREG"?"search/application/stakeholder":"search/application/bpa";
        return redirectBS;
    }
    const GetCell = (value) => <span className="cell-text">{value}</span>;
    
    return useMemo( () => ([
        {
          Header: t("NOC_APP_NO_LABEL"),
          accessor: "applicationNo",
          disableSortBy: true,
          Cell: ({ row }) => {
            return (
              <div>
                <span className="link">
                  <Link to={`/digit-ui/employee/noc/search/application-overview/${row.original["applicationNo"] || row.original["applicationNumber"]}`}>
                    {row.original["applicationNo"] || row.original["applicationNumber"]}
                  </Link>
                </span>
              </div>
            );
          },
        },
        {
          Header: t("NOC_COMMON_TABLE_COL_APP_DATE_LABEL"),
          disableSortBy: true,
          accessor: (row) => GetCell(row?.auditDetails?.createdTime ? Digit.DateUtils.ConvertEpochToDate(row?.auditDetails?.createdTime) : "-"),
        },
        {
          Header: t("NOC_APPLICANTS_NAME_LABEL"),
          disableSortBy: true,
          accessor: (row) => {
            return GetCell(row?.additionalDetails?.applicantName ? row?.additionalDetails?.applicantName : "-")
          },
        },
        {
          Header: t("NOC_SOURCE_MODULE_LABEL"),
          disableSortBy: true,
          accessor: (row) => GetCell(t(`MODULE_${row?.source}` || "-")),
        },
        {
          Header: t("NOC_SOURCE_MODULE_NUMBER"),
          disableSortBy: true,
          accessor: (row) => GetCell(row?.sourceRefId || "-"),
        },
        {
          Header: t("NOC_STATUS_LABEL"),
          accessor: (row) =>GetCell(t(row?.applicationStatus && `${row.applicationStatus}`|| "-") ),
          disableSortBy: true,
        },
        {
          Header: t("WF_INBOX_HEADER_CURRENT_OWNER"),
          accessor: (row) =>GetCell(t(row?.additionalDetails?.currentOwner && `${row?.additionalDetails?.currentOwner}`|| "-") ),
          disableSortBy: true,
        }
      ]), [] )
}

export default useSearchApplicationTableConfig