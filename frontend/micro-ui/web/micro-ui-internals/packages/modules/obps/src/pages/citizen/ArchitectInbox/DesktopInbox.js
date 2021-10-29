import { Card, Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ApplicationTable from "./ApplicationTable";
import SearchApplication from './Search';

const DesktopInbox = (props) => {
  const { t } = useTranslation();
  const GetCell = (row) => <span className="cell-text">
    <Link to={`/digit-ui/citizen/obps/${["BPA_LOW", "BPA", "BPA_OC"].includes(row?.businessService) ? "bpa" : "stakeholder"}/${encodeURIComponent(row.applicationId)}`}>{row?.applicationId}</Link>
  </span>;
  const GetSlaCell = (value) => {
    if (isNaN(value)) return <span className="sla-cell-success">0</span>;
    return value < 0 ? <span className="sla-cell-error">{value}</span> : <span className="sla-cell-success">{value}</span>;
  };

  const columns = React.useMemo(() => {
    return [
      {
        Header: t('BPA_COMMON_APP_NO'),
        accessor: (row) => GetCell(row)
      },
      {
        Header: t('BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL'),
        accessor: (row) => t(row?.applicationType || "NA")
      },
      {
        Header: t('BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL'),
        accessor: row => t(row?.serviceType || "NA")
      },
      {
        Header: t('BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL'),
        accessor: 'owner'
      },
      {
        Header: t('TL_COMMON_TABLE_COL_STATUS'),
        accessor: row => t(`WF_BPA_${row?.status}`||"NA")
      },
      {
        Header: t('BPA_COMMON_SLA'),
        accessor: 'sla'
      }
    ]
  })

  let result;
  if (props.isLoading) {
    result = <Loader />;
  } else if (props?.data?.table?.length === 0) {
    result = (
      <Card style={{ marginTop: 20 }}>
        {
          t("CS_MYAPPLICATIONS_NO_APPLICATION")
            .split("\\n")
            .map((text, index) => (
              <p key={index} style={{ textAlign: "center" }}>
                {text}
              </p>
            ))
        }
      </Card>
    );
  } else if (props?.data?.table?.length > 0) {
    result = (
      <ApplicationTable
        t={t}
        data={props.data.table}
        columns={columns}
        getCellProps={(cellInfo) => {
          return {
            style: {
              minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
              padding: "20px 18px",
              fontSize: "16px",
            },
          };
        }}
        onPageSizeChange={props.onPageSizeChange}
        currentPage={props.currentPage}
        onNextPage={props.onNextPage}
        onPrevPage={props.onPrevPage}
        pageSizeLimit={props.pageSizeLimit}
        onSort={props.onSort}
        disableSort={props.disableSort}
        sortParams={props.sortParams}
        totalRecords={props.totalRecords}
      />
    );
  }
  return (
    <div className="inbox-container">
      {/* <div className="filters-container">
          <div>
            <Filter searchParams={props.searchParams} paginationParms={props.paginationParms} applications={props.data} onFilterChange={props.onFilterChange} type="desktop" />
          </div>
        </div> */}
      <div style={{ flex: 1 }}>
        <SearchApplication
          t={t}
          onSearch={props.onSearch}
          type="desktop"
          searchFields={props.searchFields}
          isInboxPage={!props?.isSearch}
          searchParams={props.searchParams}
        />
        <div className="result" style={{ marginLeft: "24px", flex: 1 }}>
          {result}
        </div>
      </div>
    </div>
  )
}

export default DesktopInbox;