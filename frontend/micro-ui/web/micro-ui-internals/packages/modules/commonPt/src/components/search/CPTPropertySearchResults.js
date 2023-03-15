import { DetailsCard, Loader, Table } from "@egovernments/digit-ui-react-components";
import React, { memo, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation, useHistory } from "react-router-dom";

const GetCell = (value) => <span className="cell-text">{value}</span>;

const SearchPTID = ({ tenantId, t, payload, showToast, setShowToast, ptSearchConfig, redirectToUrl }) => {
  const history = useHistory();
  const { state } = useLocation();
  const search = useLocation().search;
  const urlPropertyId = new URLSearchParams(search).get("propertyId");
  let urlParams = window.location.href.includes("&")? window.location.href.substring(window.location.href.indexOf("&")+1,window.location.href.length) : "";
  
  const [searchQuery, setSearchQuery] = useState({
    /* ...defaultValues,   to enable pagination */
    ...payload,
  });

  const { data, isLoading, error, isSuccess, billData } = Digit.Hooks.pt.usePropertySearchWithDue({
    tenantId,
    filters: searchQuery,
    configs: { enabled: Object.keys(payload).length > 0 ? true : false, retry: false, retryOnMount: false, staleTime: Infinity },
  });

  const columns = useMemo(
    () => [
      {
        Header: t("PT_COMMON_TABLE_COL_PT_ID"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <div>
              <span className="link">
                <span
                  onClick={() => {
                    //sessionStorage.setItem("propertyDetailsBC",JSON.stringify({...state}))
                    history.push(
                      `/digit-ui/employee/commonpt/view-property?propertyId=${row.original["propertyId"]}&tenantId=${tenantId}&redirectToUrl=${redirectToUrl}`,
                      { ...state }
                    );
                  }}
                >
                  {row.original["propertyId"]}
                </span>
              </span>
            </div>
          );
        },
      },
      {
        Header: t("PT_COMMON_TABLE_COL_OWNER_NAME"),
        disableSortBy: true,
        Cell: ({ row }) => GetCell(row.original.ownerNames || ""),
      },

      {
        Header: t("ES_INBOX_LOCALITY"),
        disableSortBy: true,
        Cell: ({ row }) => GetCell(t(row.original.locality) || ""),
      },
      {
        Header: t("PT_COMMON_TABLE_COL_STATUS_LABEL"),
        Cell: ({ row }) => GetCell(t(row?.original?.status || "NA")),
        disableSortBy: true,
      },
      {
        Header: t("PT_AMOUNT_DUE"),
        Cell: ({ row }) => GetCell(row?.original?.due ? `₹ ${row?.original?.due}` : t("PT_NA")),
        disableSortBy: true,
      },
      {
        Header: t("ES_SEARCH_ACTION"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <div>
              {row?.original?.status !== "INACTIVE" ? (
                <span className="link">
                  {redirectToUrl ? (
                    <span
                      onClick={() => {
                        //sessionStorage.setItem("propertyDetailsBC",JSON.stringify({...state}))
                        history.push(urlParams ? `${redirectToUrl}?${urlParams?.replace(urlPropertyId,row.original["propertyId"])}` : `${redirectToUrl}?propertyId=${row.original["propertyId"]}&tenantId=${tenantId}`, { ...state });
                        const scrollConst = redirectToUrl?.includes("employee/tl") ? 1600 : 300;
                        setTimeout(() => window.scrollTo(0, scrollConst), 400);
                      }}
                    >
                      {t("CPT_SELECT_PROPERTY")}
                    </span>
                  ) : null}
                </span>
              ) : (
                t("PT_NA")
              )}
            </div>
          );
        },
      },
    ],
    []
  );
  let isMobile = window.Digit.Utils.browser.isMobile();

  if (isLoading) {
    showToast && setShowToast(null);
    return <Loader />;
  }
  if (error) {
    !showToast && setShowToast({ error: true, label: error?.response?.data?.Errors?.[0]?.code || error });
    return null;
  }
  const PTEmptyResultInbox = memo(Digit.ComponentRegistryService.getComponent("PTEmptyResultInbox"));
  const getData = (tableData = []) => {
    return tableData?.map((dataObj) => {
      const obj = {};
      columns.forEach((el) => {
        if (el.Cell) obj[el.Header] = el.Cell({ row: { original: dataObj } });
      });
      return obj;
    });
  };

  const tableData = Object.values(data?.FormattedData || {}) || [];
  if (ptSearchConfig?.ptSearchCount && payload.locality && tableData && tableData.length > ptSearchConfig.ptSearchCount) {
    !showToast && setShowToast({ error: true, label: "PT_MODIFY_SEARCH_CRITERIA" });
    return null;
  }
  return (
    <React.Fragment>
      {data?.Properties?.length === 0 ? (
        <PTEmptyResultInbox data={true}></PTEmptyResultInbox>
      ) : isMobile ? (
        <DetailsCard data={getData(tableData)} t={t} />
      ) : (
        <Table
          t={t}
          data={tableData}
          totalRecords={data?.Properties?.length}
          columns={columns}
          getCellProps={(cellInfo) => {
            return {
              style: {
                padding: "20px 18px",
                fontSize: "16px",
              },
            };
          }}
          manualPagination={false}
          disableSort={true}
        />
      )}
    </React.Fragment>
  );
};

export default SearchPTID;
