import React from "react";
import { ActionBar, RemoveableTag, CloseSvg, Loader, Localities, ApplyFilterBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import Status from "./Status";

const Filter = ({ type = "desktop", onClose, onSearch, onFilterChange, searchParams }) => {
  const { t } = useTranslation();
  const clearAll = () => {
    // onFilterChange({ applicationStatus: [], locality: [], uuid: { code: "ASSIGNED_TO_ME", name: "Assigned to Me" } });
    onClose?.();
  };

  const onStatusChange = (e, type) => {
    if (e.target.checked) onFilterChange({ eventStatus: [...(searchParams?.eventStatus || []),  type] })
    else onFilterChange({ eventStatus: searchParams?.eventStatus?.filter(status => status !== type) })
  }

  return (
    <div className="filter" style={{ marginTop: "revert" }}>
      <div className="filter-card">
        <div className="heading">
          <div className="filter-label">{t("ES_COMMON_FILTER_BY")}:</div>
          <div className="clearAll" onClick={clearAll}>
            {t("ES_COMMON_CLEAR_ALL")}
          </div>
          {type === "desktop" && (
            <span className="clear-search" onClick={clearAll}>
              {t("ES_COMMON_CLEAR_ALL")}
            </span>
          )}
          {type === "mobile" && (
            <span onClick={onClose}>
              <CloseSvg />
            </span>
          )}
        </div>
        <div>
          <Status onAssignmentChange={onStatusChange} searchParams={searchParams} />
        </div>
      </div>
    </div>
  )
}

export default Filter;