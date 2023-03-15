import React, { useCallback, useState } from "react";
import { ActionBar, RemoveableTag, CloseSvg, Loader, DateRange, Localities, ApplyFilterBar, SubmitBar, Dropdown, RefreshIcon } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import Status from "./Status";

const Filter = ({ type = "desktop", onClose, onSearch, onFilterChange, searchParams }) => {
  const { t } = useTranslation();
  const [localSearchParams, setLocalSearchParams] = useState(() => ({ ...searchParams }));
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = tenantId?.split('.')[0];
  const { isLoading, data } = Digit.Hooks.useCommonMDMS(state, "mseva", ["EventCategories"]);

  const clearAll = () => {
    setLocalSearchParams({ eventCategory: null, eventStatus: [], range: { startDate: null, endDate: new Date(""), title: "" } })
    onFilterChange({ eventCategory: null, eventStatus: [], range: { startDate: null, endDate: new Date(""), title: "" } });
    onClose?.();
  };

  const applyLocalFilters = () => {
    onFilterChange(localSearchParams);
    onClose?.();
  };
  const handleChange = useCallback((data) => {
    setLocalSearchParams((prevLocalSearchParams) => ({ ...prevLocalSearchParams, ...data }));
  },[])

  const onStatusChange = (e, type) => {
    if (e.target.checked) handleChange({ eventStatus: [...(localSearchParams?.eventStatus || []), type] })
    else handleChange({ eventStatus: localSearchParams?.eventStatus?.filter(status => status !== type) })
  }

  if (isLoading) {
    return (
      <Loader />
    );
  }
  return (
    <div className="filter">
      <div className="filter-card">
        <div className="heading">
          <div className="filter-label">{t("ES_COMMON_FILTER_BY")}:</div>
          <div className="clearAll" onClick={clearAll}>
            {t("ES_COMMON_CLEAR_ALL")}
          </div>
          {type === "desktop" && (
            <span className="clear-search" onClick={clearAll}>
              <RefreshIcon />
            </span>
          )}
          {type === "mobile" && (
            <span onClick={onClose}>
              <CloseSvg />
            </span>
          )}
        </div>
        {/* <div className="filter-label">{`${t(`EVENTS_CATEGORY_LABEL`)}`}</div> */}
        {/* <Dropdown option={data?.mseva?.EventCategories} optionKey="code" t={t} selected={localSearchParams?.eventCategory} select={val => handleChange({ eventCategory: val })} /> */}
        <DateRange t={t} values={localSearchParams?.range} onFilterChange={handleChange} labelClass="filter-label" />
        <div>
          <Status onAssignmentChange={onStatusChange} searchParams={localSearchParams} />
        </div>
        <div>
          <SubmitBar style={{ width: '100%' }} onSubmit={() => applyLocalFilters()} label={t("ES_COMMON_APPLY")} />
        </div>
      </div>
    </div>
  )
}

export default Filter;