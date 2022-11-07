import { format } from "date-fns";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MultiLink } from "@egovernments/digit-ui-react-components";

const Download = ({ dowloadOptions }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div>
      <MultiLink
        className="multilinkWrapper"
        onHeadClick={() => setShowOptions(!showOptions)}
        displayOptions={showOptions}
        // showOptions={setShowOptions}
        options={dowloadOptions}
        style={{ right: "0", position: "unset", top: "0px", margin: "0px" }}
        optionsStyle={{ right: "10px", top: "unset", margin: "0px", position: "absolute" }}
      />
    </div>
  );
};

const useInboxTableConfig = ({ onPageSizeChange, formState, totalCount, table, dispatch, onSortingByData }) => {
  const GetCell = (value) => <span className="cell-text styled-cell">{value}</span>;
  const GetStatusCell = (value) =>  value === "Accepted" ? <span className="sla-cell-success " style={{background:"none",padding:"unset"}}>{value}</span> : <span className="sla-cell-error" style={{background:"none",padding:"unset"}}>{value}</span>;
  const { t } = useTranslation();

  const tableColumnConfig = useMemo(() => {
    return [
      {
        Header: t("EDCR_COMMON_TABLE_APPL_NO"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <div>
              <span className="">{row.original["applicationId"]}</span>
            </div>
          );
        },
      },
      {
        Header: t("CS_APPLICATION_DETAILS_APPLICATION_DATE"),
        accessor: "createdDate",
        Cell: ({ row }) => (row.original?.["date"] ? GetCell(format(new Date(row.original?.["date"]), "dd/MM/yyyy")) : ""),
      },

      {
        Header: t("EDCR_COMMON_TABLE_CITY_LABEL"),
        accessor: (row) => t(row?.locality),
        disableSortBy: true,
      },
      {
        Header: t("EDCR_COMMON_TABLE_APPL_NAME"),
        accessor: (row) => row?.owner,
        disableSortBy: true,
      },
      {
        Header: t("EDCR_COMMON_TABLE_SCRUTINY_NO"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return <div>{row.original?.edcrNumber !== "null" ? <span className="">{row.original["edcrNumber"]}</span> : "NA"}</div>;
        },
      },
      {
        Header: t("EDCR_COMMON_TABLE_COL_STATUS"),
        accessor: (row) => GetStatusCell(row?.status),
        disableSortBy: true,
      },
      {
        Header: t("PT_COMMON_TABLE_COL_ACTION_LABEL"),
        Cell: ({ row }) => {
          return (
            <Download
              dowloadOptions={[
                {
                  label: t("BPA_UPLOADED_PLAN_DXF"),
                  onClick: () => window.open(`${row.original["dxfFileurl"]}`),
                },
                {
                  label: t("EDCR_SCUTINY_REPORT"),
                  onClick: () => window.open(`${row.original["planReportUrl"]}`),
                },
              ]}
            />
          );
        },
        disableSortBy: true,
      },
    ];
  });

  return {
    getCellProps: (cellInfo) => {
      return {
        style: {
          padding: "20px 18px",
          fontSize: "16px",
        },
      };
    },
    className: "table edcr-citizen-inbox",
    disableSort: false,
    autoSort: false,
    manualPagination: true,
    initSortId: "createdDate",
    onPageSizeChange: onPageSizeChange,
    currentPage: formState.tableForm?.offset / formState.tableForm?.limit,
    onNextPage: () =>
      dispatch({
        action: "mutateTableForm",
        data: { ...formState.tableForm, offset: parseInt(formState.tableForm?.offset) + parseInt(formState.tableForm?.limit) },
      }),
    onPrevPage: () =>
      dispatch({
        action: "mutateTableForm",
        data: { ...formState.tableForm, offset: parseInt(formState.tableForm?.offset) - parseInt(formState.tableForm?.limit) },
      }),
    pageSizeLimit: formState.tableForm?.limit,
    onSort: onSortingByData,
    totalRecords: totalCount,
    onSearch: formState?.searchForm?.message,
    onLastPage: () =>
      dispatch({
        action: "mutateTableForm",
        data: { ...formState.tableForm, offset: Math.ceil(totalCount / 10) * 10 - parseInt(formState.tableForm?.limit) },
      }),
    onFirstPage: () => dispatch({ action: "mutateTableForm", data: { ...formState.tableForm, offset: 0 } }),
    data: table,
    columns: tableColumnConfig,
  };
};

export default useInboxTableConfig;
