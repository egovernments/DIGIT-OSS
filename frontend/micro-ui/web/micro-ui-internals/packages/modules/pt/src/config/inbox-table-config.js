import React from "react";
import { Link } from "react-router-dom";

const GetCell = (value) => <span className="cell-text">{value}</span>;

const GetSlaCell = (value) => {
  if (isNaN(value)) return <span className="sla-cell-success">0</span>;
  return value < 0 ? <span className="sla-cell-error">{value}</span> : <span className="sla-cell-success">{value}</span>;
};

const GetMobCell = (value) => <span className="sla-cell">{value}</span>;

export const TableConfig = (t) => ({
  PT: {
    searchColumns: (props) => [
      {
        Header: t("ES_INBOX_UNIQUE_PROPERTY_ID"),
        // accessor: "searchData.propertyId",
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <div>
              <span className="link">
                <Link to={`${props.parentRoute}/property-details/` + row.original?.searchData?.["propertyId"]}>
                  {row.original?.searchData?.["propertyId"]}
                </Link>
              </span>
            </div>
          );
        },
        mobileCell: (original) => GetMobCell(original?.searchData?.["propertyId"]),
      },
      {
        Header: t("ES_INBOX_OWNER_NAME"),
        disableSortBy: true,
        Cell: ({ row }) => {
          const owners = row.original?.searchData["owners"] || [];
          const status = row.original?.searchData.status;
          const creationReason = row.original?.searchData.creationReason;
          const sortedOwners = [...owners.filter((a, b) => a.status === "ACTIVE"), ...owners.filter((a, b) => a.status !== "ACTIVE")];
          const _owner = status === "INWORKFLOW" && creationReason === "MUTATION" ? sortedOwners.reverse() : sortedOwners;

          return GetCell(`${_owner?.[0].name}`);
        },
        mobileCell: (original) => GetMobCell(original?.searchData?.["owners"]?.[0].name),
      },
      {
        Header: t("ES_INBOX_LOCALITY"),
        Cell: ({ row }) => {
          const tenantId = row.original?.searchData?.tenantId;
          return GetCell(t(`${tenantId.replace(".", "_").toUpperCase()}_REVENUE_${row.original?.searchData?.address?.locality?.code}`));
        },
        disableSortBy: true,
        mobileCell: (original) => GetMobCell(original?.searchData?.address?.locality?.name),
      },
      {
        Header: t("ES_SEARCH_PROPERTY_STATUS"),
        Cell: ({ row }) => {
          return GetCell(t(row.original?.searchData?.status));
        },
        disableSortBy: true,
        mobileCell: (original) => GetMobCell(original?.searchData?.status),
      },
      {
        Header: t("ES_SEARCH_TAX_DUE"),
        Cell: ({ row }) => {
          return GetCell("₹ " + row.original?.searchData?.due_tax);
        },
        disableSortBy: true,
        mobileCell: (original) => GetMobCell("₹ " + original?.searchData?.due_tax),
      },
      {
        Header: t("ES_SEARCH_ACTION"),
        Cell: ({ row }) => {
          return (
            <div>
              {row.original?.searchData?.due_tax > 0 && Digit.Utils.didEmployeeHasRole("PT_CEMP") ? (
                <span className="link">
                  <Link to={`/digit-ui/employee/payment/collect/PT/` + row.original?.searchData?.["propertyId"]}>{t("ES_PT_COLLECT_TAX")}</Link>
                </span>
              ) : null}
            </div>
          );
        },
        disableSortBy: true,
        // mobileCell: (original) => GetMobCell(original?.searchData?.["propertyId"]),
      },
    ],
    inboxColumns: (props) => [
      {
        Header: t("ES_INBOX_UNIQUE_PROPERTY_ID"),
        Cell: ({ row }) => {
          return (
            <div>
              <span className="link">
                <Link to={`${props.parentRoute}/application-details/` + row.original?.searchData?.["propertyId"]}>
                  {row.original?.searchData?.["propertyId"]}
                </Link>
              </span>
            </div>
          );
        },
        mobileCell: (original) => GetMobCell(original?.searchData?.["propertyId"]),
      },
      {
        Header: t("ES_INBOX_OWNER"),
        Cell: ({ row }) => {
          return GetCell(`${row.original?.searchData?.["owners"]?.[0].name}`);
        },
        mobileCell: (original) => GetMobCell(original?.searchData?.["owners"]?.[0].name),
      },
      {
        Header: t("ES_INBOX_APPLICATION_TYPE"),
        Cell: ({ row }) => {
          const map = {
            "PT.CREATE": "ES_PT_NEW_PROPERTY",
            "PT.MUTATION": "ES_PT_TRANSFER_OWNERSHIP",
            "PT.UPDATE": "ES_PT_UPDATE_PROPERTY",
          };
          return GetCell(t(`${map[row.original?.workflowData?.businessService]}`));
        },
        mobileCell: (original) => {
          const map = {
            "PT.CREATE": "ES_PT_NEW_PROPERTY",
            "PT.MUTATION": "ES_PT_TRANSFER_OWNERSHIP",
            "PT.UPDATE": "ES_PT_UPDATE_PROPERTY",
          };

          return GetMobCell(t(map[original?.workflowData?.businessService]));
        },
      },
      {
        Header: t("ES_INBOX_STATUS"),
        Cell: ({ row }) => {
          const wf = row.original?.workflowData;
          return GetCell(t(`ES_PT_COMMON_STATUS_${wf?.state?.["state"]}`));
        },
        mobileCell: (original) => GetMobCell(t(`ES_PT_COMMON_STATUS_${original?.workflowData?.state?.["state"]}`)),
      },
      {
        Header: t("ES_INBOX_SLA_DAYS_REMAINING"),
        accessor: "createdTime",
        Cell: ({ row }) => {
          const wf = row.original.workflowData;
          const math = Math.round((wf?.businesssServiceSla || 0) / (24 * 60 * 60 * 1000)) || "-";
          return GetSlaCell(math);
        },
        mobileCell: (original) => GetSlaCell(Math.round((original?.workflowData?.["businesssServiceSla"] || 0) / (24 * 60 * 60 * 1000))),
      },
    ],
    serviceRequestIdKey: (original) => original?.[t("ES_INBOX_UNIQUE_PROPERTY_ID")]?.props?.children,
  },
});
