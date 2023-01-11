import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApplicationCard } from "./ApplicationCard";
import ApplicationLinks from "./ApplicationLinks";
import { convertEpochToDateDMY } from "../../utils";

const GetSlaCell = (value) => {
  if (isNaN(value)) return <span className="sla-cell-success">0</span>;
  return value < 0 ? <span className="sla-cell-error">{value}</span> : <span className="sla-cell-success">{value}</span>;
};

const GetCell = (value) => <span className="sla-cell">{value}</span>;

const MobileInbox = ({
  data,
  vehicleLog,
  isLoading,
  isSearch,
  onSearch,
  onFilterChange,
  onSort,
  searchParams,
  searchFields,
  linkPrefix,
  parentRoute,
  removeParam,
  sortParams,
}) => {
  const { t } = useTranslation();
  const getData = () => data?.table.map(e => ({
      [t("WF_INBOX_HEADER_APPLICATION_NO")]:e?.["applicationId"],
      [t("TL_COMMON_TABLE_COL_APP_DATE")]:convertEpochToDateDMY(e?.["date"]),
      [t("TL_COMMON_TABLE_COL_APP_TYPE")]:e?.["businessService"]?t(`CS_COMMON_INBOX_${e?.["businessService"]?.toUpperCase()}`):t("NA"),
      [t("WF_INBOX_HEADER_LOCALITY")]:t(Digit.Utils.locale.getRevenueLocalityCode(e?.["locality"], e?.["tenantId"])),
      [t("WF_INBOX_HEADER_STATUS")]:t(e?.["businessService"]?`WF_${e["businessService"]?.toUpperCase()}_${e?.["status"]}`:`NA`),
      [t("WF_INBOX_HEADER_CURRENT_OWNER")]:t(e?.owner),
      [t("WF_INBOX_HEADER_SLA_DAYS_REMAINING")]:e?.["sla"]}))

  return (
    <div style={{ padding: 0 }}>
      <div className="inbox-container">
        <div className="filters-container">
        <ApplicationLinks classNameForMobileView="linksWrapperForMobileInbox" linkPrefix={parentRoute} 
                    allLinks={[
                      {
                        text: "TL_NEW_APPLICATION",
                        link: "/digit-ui/employee/tl/new-application",
                        businessService: "TL",
                        roles: ["TL_CEMP"],
                      },
                      {
                        text: "TL_SEARCH_APPLICATIONS",
                        link: "/digit-ui/employee/tl/search/application",
                        businessService: "TL",
                        roles: ["TL_FIELD_INSPECTOR","TL_APPROVER", "TL_DOC_VERIFIER","TL_CEMP"],
                      },
                      {
                        text: "TL_SEARCH_LICENSE",
                        link: "/digit-ui/employee/tl/search/license",
                        businessService: "TL",
                        roles: ["TL_APPROVER", "TL_DOC_VERIFIER","TL_FIELD_INSPECTOR"],
                      },
                      {
                        text: "TL_RENEWAL_HEADER",
                        link: "/digit-ui/employee/tl/search/license",
                        businessService: "TL",
                        roles: ["TL_CEMP"],
                      },
                      {
                        text: "ACTION_TEST_DASHBOARD",
                        link: "/digit-ui/employee/dss/dashboard/tradelicence",
                        businessService: "TL",
                        roles: ["STADMIN"],
                      },
                    ]}
                    headerText={t("ACTION_TEST_TRADELICENSE")} isMobile={true} />
          <ApplicationCard
            t={t}
            data={getData()}
            onFilterChange={onFilterChange}
            serviceRequestIdKey={t("WF_INBOX_HEADER_APPLICATION_NO")}
            isLoading={isLoading}
            onSearch={onSearch}
            onSort={onSort}
            searchParams={searchParams}
            searchFields={searchFields}
            linkPrefix={linkPrefix}
            removeParam={removeParam}
            sortParams={sortParams}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileInbox;
