import React from "react";
import { ActionBar, RemoveableTag, CloseSvg, Loader, Localities, Dropdown } from "@egovernments/digit-ui-react-components";
import { ApplyFilterBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import Status from "./Status";

const applicationTypes = [{
  name: "BUILDING_PLAN_SCRUTINY"
}, {
  name: "BUILDING_NEW_PLAN_SCRUTINY",
}]

const serviceTypes = [{
  name: "NEW_CONSTRUCTION"
}]

const Filter = ({ searchParams, paginationParms, onFilterChange, onSearch, onClose, removeParam, statuses, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  
  const clearAll = () => {};

  const onStatusChange = (e, type) => {
    if (e.target.checked) onFilterChange({ applicationStatus: [...searchParams?.applicationStatus, type] });
    else onFilterChange({ applicationStatus: searchParams?.applicationStatus.filter((option) => type.name !== option.name) });
  };

  const handleChange = (option) => {
    onFilterChange(option);
  }

  return (
    <React.Fragment>
      <div className="filter-card">
        <div className="heading">
          <div className="filter-label">{t("ES_COMMON_FILTER_BY")}:</div>
          <div className="clearAll" onClick={clearAll}>
            {t("ES_COMMON_CLEAR_ALL")}
          </div>
          {props.type === "desktop" && (
            <span className="clear-search" onClick={clearAll}>
              {t("ES_COMMON_CLEAR_ALL")}
            </span>
          )}
          {props.type === "mobile" && (
            <span onClick={props.onClose}>
              <CloseSvg />
            </span>
          )}
        </div>
        <div>
          <div className="filter-label">{t("BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL")}</div>
          <Dropdown t={t} option={applicationTypes} optionKey={"name"} select={arg => handleChange({ applicationType: arg?.name })} />
        </div>
        <div>
          <div className="filter-label">{t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL")}</div>
          <Dropdown t={t} option={serviceTypes} optionKey={"name"} select={arg => handleChange({ serviceType: arg?.name })} />
        </div>
        <div>
          <Status onAssignmentChange={onStatusChange} statuses={statuses} searchParams={searchParams} />
        </div>
      </div>
      {props.type === "mobile" && (
        <ActionBar>
          <ApplyFilterBar
            submit={false}
            labelLink={t("ES_COMMON_CLEAR_ALL")}
            buttonLink={t("ES_COMMON_FILTER")}
            onClear={clearAll}
            onSubmit={() => {
              // if (props.type === "mobile") onSearch({ delete: ["applicationNos"] });
              // else onSearch();
              if (props.type === "mobile") {
                onClose();
              }
            }}
            style={{ flex: 1 }}
          />
        </ActionBar>
      )}
    </React.Fragment>
  );

};

export default Filter;