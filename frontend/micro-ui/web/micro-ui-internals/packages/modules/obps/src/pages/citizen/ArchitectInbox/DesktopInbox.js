import { Card, Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ApplicationLinks from './ApplicationLinks';
import ApplicationTable from "./ApplicationTable";
import Filter from "./Filter";
import SearchApplication from './Search';

const DesktopInbox = (props) => {
  const { t } = useTranslation();
  const GetCell = (row) => <span className="link">
    <Link to={`/digit-ui/citizen/obps/bpa/${encodeURIComponent(row.applicationId)}`}>{row?.applicationId}</Link>
  </span>;
  const GetSlaCell = (value) => {
    if (isNaN(value)) return <span className="sla-cell-success">0</span>;
    return value < 0 ? <span className="sla-cell-error">{value}</span> : <span className="sla-cell-success">{value}</span>;
  };
  const GetStatusCell = (value) => value === "Active" || value>0 ? <span className="sla-cell-success">{value}</span> : <span className="sla-cell-error">{value}</span> 

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
        accessor: 'applicantName'
      },
      {
        Header: t('TL_COMMON_TABLE_COL_STATUS'),
        accessor: row => row?.state ? t(`WF_BPA_${row?.state}`) : t(`WF_BPA_${row?.status}`)
      },
      {
        Header: t('BPA_COMMON_SLA'),
        accessor: row => GetStatusCell(row?.sla || "-")
      }
    ]
  },[t])

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
        onLastPage={props.onLastPage}
        onFirstPage={props.onFirstPage}
      />
    );
  }
  return (
    
    <div className="inbox-container">
        {!props.isSearch && (
        <div className="filters-container">
            <ApplicationLinks
            parentRoute={props.parentRoute}
            allLinks={[
              {
                text: "OBPS_HOME",
                link: "/digit-ui/citizen/obps/home",   
              },
              {
                text: "ES_COMMON_SEARCH_APPLICATION",
                link: "/digit-ui/citizen/obps/search/application",
              },
            ]}
            headerText={t("ES_COMMON_OBPS_INBOX_LABEL")}
            businessService={props.businessService}
          />
          <div>
            {
             <Filter  statuses={props.statusMap} searchParams={props.searchParams} paginationParms={props.paginationParms} applications={props.data} onFilterChange={props.onFilterChange} type="desktop" />
            }
          </div>
        </div>
      )}
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