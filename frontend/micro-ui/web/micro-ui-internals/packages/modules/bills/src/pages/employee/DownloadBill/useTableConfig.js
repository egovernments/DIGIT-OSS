import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getCancelButton, getRetryButton } from "../../../utils";
const useSearchApplicationTableConfig = (setShowToast) => {
  
  const { t } = useTranslation();

  const GetCell = (value) => <span className="cell-text">{value}</span>;

  const diffInDates = (date1, date2) => {
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUpdatedStatus = (item) => {
    if (item.status == "DONE") {
      return diffInDates(new Date(Number(item.lastmodifiedtime)), new Date()) < 2 && item.filestoreid ? item.status : "EXPIRED";
    } else if (item.status == "INPROGRESS") {
      return item.recordscompleted === item.totalrecords && !item.filestoreid && item.recordscompleted != 0 ? "FAILED" : item.status;
    } else {
      return item.status;
    }
  };

  const openFile = async (filestoreid,tenantId) => {
    const resv1 = await Digit.UploadServices.Filefetch([filestoreid], tenantId);
    window.open(resv1.data[resv1.data.fileStoreIds[0].id]);
  } 

  const getActionButton = (status, item) => {
    switch (status) {
      case "DONE":
        return (
          <div>
            <span className="link">
              <button onClick={()=>openFile(item?.filestoreid,item?.tenantId)} className="btn btn-primary btn-sm">
                {t("GRP_BILL_ACT_DOWNLOAD")}
              </button>
            </span>
          </div>
        );
      case "INPROGRESS":
        let val = (item.recordscompleted / item.totalrecords) * 100;
        return val ? (
          <div>
            <span className="link">
              <div>{GetCell(getCancelButton(item.jobid, setShowToast))} </div>
            </span>
          </div>
        ) : (
          <span> {t("CS_NA")} </span>
        );

      case "FAILED":
      case "EXPIRED":
        return (
          <div>
            <span className="link">
              {GetCell(getRetryButton(item.key, item.tenantId, item.locality, item.isConsolidated, item.bussinessService, setShowToast))}
            </span>
          </div>
        );
      case "CANCEL":
        return <span> {t("CS_NA")} </span>;
    }
  };

  const getStatusColumn = (status) => {
    switch (status) {
      case "DONE":
        return <span> {t("GRP_BILL_DONE")} </span>;
      case "INPROGRESS":
        return <span> {t("GRP_BILL_INITIATED")} </span>;
      case "FAILED":
      case "EXPIRED":
        return <span> {t(`GRP_BILL_${status}`)} </span>;
      case "CANCEL":
        return <span> {t(`GRP_BILL_CANCELLED`)} </span>;
    }
  };

  return useMemo(
    () => [
      {
        Header: t("TL_DATE_LABEL"),
        disableSortBy: true,
        accessor: (row) => new Date(Number(row?.createdtime)).toLocaleDateString(),
      },
      {
        Header: t("BUSINESS_SERVICE"),
        disableSortBy: true,
        Cell: ({ row }) => {
          if (row?.original?.isConsolidated) {
            let replaceKey = row?.original?.bussinessService == "WS" ? "WS" : "SW";
            let replaceWith = row?.original?.bussinessService == "WS" ? "SW" : "WS";
            return GetCell(t(`BILLINGSERVICE_BUSINESSSERVICE_${replaceKey}`) + "," + t(`BILLINGSERVICE_BUSINESSSERVICE_${replaceWith}`));
          }
          return GetCell(t(`BILLINGSERVICE_BUSINESSSERVICE_${row?.original?.bussinessService}` || "-"));
        },
      },
      {
        Header: t("ES_INBOX_LOCALITY"),
        disableSortBy: true,
        accessor: (row) => {
          return GetCell(t(`${Digit.Utils.locale.getTransformedLocale(row?.tenantId)}_REVENUE_${row?.locality}`) || "-");
        },
      },
      {
        Header: t("ABG_PT_CONSUMER_CODE_LABEL"),
        disableSortBy: true,
        accessor: (row) => GetCell(row?.consumerCode || "-"),
      },
      {
        Header: t("ABG_COMMON_TABLE_COL_STATUS"),
        disableSortBy: true,
        Cell: ({ row }) => {
          const status = getUpdatedStatus(row?.original);
          return getStatusColumn(status);
        },
      },
      {
        Header: t("ABG_COMMON_TABLE_COL_ACTION"),
        disableSortBy: true,
        Cell: ({ row }) => {
          const status = getUpdatedStatus(row?.original);
          return getActionButton(status, row?.original);
        },
      },
    ],
    []
  );
};

export default useSearchApplicationTableConfig;
