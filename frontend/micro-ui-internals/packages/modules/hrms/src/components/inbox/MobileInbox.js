import React from "react";
import { useTranslation } from "react-i18next";
import { ApplicationCard } from "./ApplicationCard";
// import { ApplicationLinks } from "@egovernments/digit-ui-react-components";

const MobileInbox = ({
  data,
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
  allLinks,
}) => {
  const { t } = useTranslation();
  // const getData = () => {
  //   return data?.Employees?.map((dataObj) => {
  //     const obj = {};
  //     const columns = isSearch ? tableConfig.searchColumns() : tableConfig.inboxColumns();
  //     columns.forEach((el) => {
  //       if (el.mobileCell) obj[el.Header] = el.mobileCell(dataObj);
  //     });
  //     return obj;
  //   });
  // };

  const GetCell = (value) => <span className="cell-text">{t(value)}</span>;
const GetSlaCell = (value) => {
  return value == "INACTIVE" ? <span className="sla-cell-error">{ t(value )|| ""}</span> : <span className="sla-cell-success">{ t(value) || ""}</span>;
};
  const getData = () => {
    return data?.Employees?.map((original) => ({
      [t("HR_EMP_ID_LABEL")]: original?.code,
      [t("HR_EMP_NAME_LABEL")]: GetCell(original?.user?.name || ""),
      [t("HR_ROLE_NO_LABEL")]: GetCell(original?.user?.roles.length || ""),
      [t("HR_DESG_LABEL")]: GetCell(t("COMMON_MASTERS_DESIGNATION_" +original?.assignments?.sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate))[0]?.designation)),
      [t("HR_DEPT_LABEL")]: GetCell(t(`COMMON_MASTERS_DEPARTMENT_${original?.assignments?.sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate))[0]?.department}`)),
      [t("HR_STATUS_LABEL")]: GetSlaCell(original?.isActive ? "ACTIVE" : "INACTIVE"),
    }));
  };
  const serviceRequestIdKey = (original) => {return `${searchParams?.tenantId}/${original?.[t("HR_EMP_ID_LABEL")]}`};

  return (
    <div style={{ padding: 0 }}>
      <div className="inbox-container">
        <div className="filters-container">
          {/* {!isSearch && <ApplicationLinks linkPrefix={parentRoute} allLinks={allLinks} isMobile={true} />} */}
          <ApplicationCard
                t={t}
            data={getData()}
            onFilterChange={onFilterChange}
            isLoading={isLoading}
            isSearch={isSearch}
            onSearch={onSearch}
            onSort={onSort}
            searchParams={searchParams}
            searchFields={searchFields}
            linkPrefix={linkPrefix}
            sortParams={sortParams}
            filterComponent={filterComponent}
            serviceRequestIdKey={serviceRequestIdKey}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileInbox;
