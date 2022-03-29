import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApplicationCard } from "./inbox/ApplicationCard";
import ApplicationLinks from "./inbox/ApplicationLinks";
import { getActionButton, printReciept } from "../utils";
import { Link } from "react-router-dom";

const MobileInbox = ({
  data,
  defaultSearchParams={},
  isLoading,
  isSearch,
  searchFields,
  onFilterChange,
  onSearch,
  onSort,
  parentRoute,
  searchParams,
  sortParams,
  linkPrefix,
  tableConfig,
  filterComponent,
}) => {
  const { t } = useTranslation();
  const GetMobCell = (value) => <span className="sla-cell">{value}</span>;
  const convertEpochToDate = (dateEpoch) => {
    if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
      return "NA";
    }
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  };
  const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
    if (searcher == "") return str;
    while (str.includes(searcher)) {
      str = str.replace(searcher, replaceWith);
    }
    return str;
  };
  const inboxColumns = (props) => [
    {
      Header: t("UC_CHALLAN_NUMBER"),
      mobileCell: (original) => GetMobCell(original?.["challanNo"]),
    },
    {
      Header: t("UC_COMMON_TABLE_COL_PAYEE_NAME"),
      mobileCell: (original) => GetMobCell(original?.["name"]),
    },
    {
      Header: t("UC_SERVICE_CATEGORY_LABEL"),
      mobileCell: (original) => {
        let code = stringReplaceAll(`${original?.["businessService"]}`, ".", "_");
        code = code.toUpperCase();
        return GetMobCell(t(`BILLINGSERVICE_BUSINESSSERVICE_${code}`));
      },
    },
    {
      Header: t("UC_DUE_DATE"),
      mobileCell: (original) => GetMobCell(original?.dueDate === "NA" ? t("CS_NA") : convertEpochToDate(original?.dueDate)),
    },
    {
      Header: t("UC_RECIEPT_NUMBER_LABEL"),
      mobileCell: (original) => GetMobCell(original?.receiptNumber === null ? t("CS_NA") : original?.receiptNumber),
    },
    {
      Header: t("UC_TOTAL_AMOUNT"),
      mobileCell: (original) => GetMobCell(original?.["totalAmount"]),
    },
    {
      Header: t("UC_COMMON_TABLE_COL_STATUS"),
      mobileCell: (original) => GetMobCell(original?.applicationStatus),
    },
    {
      Header: t("UC_TABLE_COL_ACTION"),
      mobileCell: (original) => {
        const amount = original?.totalAmount;
        let action = "ACTIVE";
        if (amount > 0) action = "COLLECT";
        if (action == "COLLECT") {
          return (
            <div>
              <span className="link">
                <Link
                  to={{
                    pathname: `/digit-ui/employee/payment/collect/${original?.["businessService"]}/${original?.["challanNo"]}/tenantId=${original?.["tenantId"]}?workflow=mcollect`,
                  }}
                >
                  {t(`UC_${action}`)}
                </Link>
              </span>
            </div>
          );
        } else if (original?.applicationStatus == "PAID") {
          return (
            <div>
              <span className="link">
                <Link>
                  <a
                    href="javascript:void(0)"
                    style={{
                      color: "#FE7A51",
                      cursor: "pointer",
                    }}
                    onClick={(value) => {
                      printReciept(original?.["businessService"], original?.["challanNo"]);
                    }}
                  >
                    {" "}
                    {t(`${"UC_DOWNLOAD_RECEIPT"}`)}{" "}
                  </a>
                </Link>
              </span>
            </div>
          );
        } else {
          return GetMobCell(t(`${"CS_NA"}`));
        }
      },
    },
  ];

  const serviceRequestIdKey = (original) => original?.[t("UC_CHALLAN_NUMBER")]?.props?.children;

  const getData = () => {
    return data?.map((dataObj) => {
      const obj = {};
      const columns = inboxColumns();
      columns.forEach((el) => {
        if (el.mobileCell) obj[el.Header] = el.mobileCell(dataObj);
      });
      return obj;
    });
  };

  return (
    <div style={{ padding: 0 }}>
      <div className="inbox-container">
        <div className="filters-container">
          {!isSearch && <ApplicationLinks linkPrefix={parentRoute} allLinks = {[
          {
            text: t("UC_GENERATE_NEW_CHALLAN"),
            link: "/digit-ui/employee/mcollect/new-application",
            roles: [],
          }]} 
          headerText={t("ACTION_TEST_MCOLLECT")}
          isMobile={true} />}
          <ApplicationCard
            t={t}
            data={getData()}
            defaultSearchParams={defaultSearchParams}
            onFilterChange={onFilterChange}
            isLoading={isLoading}
            isSearch={isSearch}
            onSearch={onSearch}
            onSort={onSort}
            searchParams={searchParams}
            searchFields={searchFields}
            linkPrefix={linkPrefix}
            sortParams={sortParams}
            serviceRequestIdKey={serviceRequestIdKey}
            filterComponent={filterComponent}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileInbox;
