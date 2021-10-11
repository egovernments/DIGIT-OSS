import React from "react";
import { ActionBar, RemoveableTag, CloseSvg, Loader, Localities, Dropdown } from "@egovernments/digit-ui-react-components";
import { ApplyFilterBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const Filter = ({ searchParams, paginationParms, onFilterChange, onSearch, removeParam, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  
  const clearAll = () => {};

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
          <Dropdown />
        </div>
        <div>
          <div className="filter-label">{t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL")}</div>
          <Dropdown />
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
              if (props.type === "mobile") onSearch({ delete: ["applicationNos"] });
              else onSearch();
            }}
            style={{ flex: 1 }}
          />
        </ActionBar>
      )}
    </React.Fragment>
  );

};

export default Filter;