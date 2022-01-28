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
          Header: t("NOC_APPLICATION_NUMBER_LABEL"),
          accessor: "applicationNo",
          disableSortBy: true,
          Cell: ({ row }) => {
            return (
              <div>
                <span className="link">
                  <Link to={`/digit-ui/employee/noc/inbox/application-overview/${row.original["applicationNo"] || row.original["applicationNumber"]}`}>
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
          accessor: (row) => GetCell(row?.auditDetails?.createdTime ? Digit.DateUtils.ConvertEpochToDate(row?.auditDetails?.createdTime) : ""),
        },
        // {
        //   Header: t("NOC_COMMON_TABLE_COL_OWN_NAME_LABEL"),
        //   disableSortBy: true,
        //   accessor: (row) => GetCell(t(row.additionalDetails?.serviceType || "-")),
        // },
        {
          Header: t("NOC_COMMON_TABLE_COL_APP_SOURCE_MODULE"),
          disableSortBy: true,
          accessor: (row) => GetCell(t(`MODULE_${row?.source}` || "-")),
        },
        {
          Header: t("NOC_SOURCE_APPLICATION_NUMBER_LABEL"),
          disableSortBy: true,
          accessor: (row) => GetCell(row?.sourceRefId || "-"),
        },
        // {
        //     Header: t("BPA_SEARCH_APPLICATION_TYPE_LABEL"),
        //     disableSortBy: true,
        //     accessor: "applicationType",
        //     Cell: ({ row }) => {
        //         return (
        //             <div>
        //               <span className="cell-text">
        //               {row.original?.additionalDetails?.applicationType ? t(`WF_BPA_${row.original?.additionalDetails?.applicationType}`) : "-"}
        //               </span>
        //             </div>
        //           );
        //     },
        // },
        // {
        //     Header: t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"),
        //     disableSortBy: true,
        //     accessor: (row) => GetCell(t(row.additionalDetails?.serviceType || "-")),
        // },
        {
          Header: t("NOC_CURRENT_OWNER_HEAD"),
          accessor: (row) => GetCell(row?.owners?.[0] || "-"),
          disableSortBy: true,
        },
        {
          Header: t("NOC_STATUS_LABEL"),
          accessor: (row) =>GetCell(t(row?.applicationStatus&&`WF_BPA_${row.applicationStatus}`|| "NA") ),
          disableSortBy: true,
        }
      ]), [] )
}

export default useSearchApplicationTableConfig