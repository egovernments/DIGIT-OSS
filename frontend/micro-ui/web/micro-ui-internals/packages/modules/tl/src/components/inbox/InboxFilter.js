import React, { useState } from "react";
import { Dropdown, RadioButtons, ActionBar, RemoveableTag, CloseSvg, CheckBox, Localities, SubmitBar } from "@egovernments/digit-ui-react-components";

import { useTranslation } from "react-i18next";

import _ from "lodash";

const Filter = ({ searchParams, onFilterChange, defaultSearchParams, statuses, ...props }) => {
  const { t } = useTranslation();

  const [_searchParams, setSearchParams] = useState(() => searchParams);

  const localParamChange = (filterParam) => {
    let keys_to_delete = filterParam.delete;
    let _new = { ..._searchParams, ...filterParam };
    if (keys_to_delete) keys_to_delete.forEach((key) => delete _new[key]);
    delete filterParam.delete;
    setSearchParams({ ..._new });
  };

  const clearAll = () => {
    setSearchParams({applicationStatus:[]});
    onFilterChange({applicationStatus:[]});
  };

  const tenantId = Digit.ULBService.getCurrentTenantId();

  const onServiceSelect = (e, label) => {
    if (e.target.checked) localParamChange({ applicationStatus: [...(_searchParams?.applicationStatus ? _searchParams.applicationStatus : [] ), label] });
    else localParamChange({ applicationStatus: _searchParams?.applicationStatus.filter((o) => o !== label) });
  };

  const selectLocality = (d) => {
    localParamChange({ locality: [ ...(_searchParams?.locality || []) , d ] });
  };

  return (
    <React.Fragment>
      <div className="filter">
        <div className="filter-card">
          <div className="heading" style={{ alignItems: "center" }}>
            <div className="filter-label" style={{ display: "flex", alignItems: "center" }}>
              <span>
                <svg width="17" height="17" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0.66666 2.48016C3.35999 5.9335 8.33333 12.3335 8.33333 12.3335V20.3335C8.33333 21.0668 8.93333 21.6668 9.66666 21.6668H12.3333C13.0667 21.6668 13.6667 21.0668 13.6667 20.3335V12.3335C13.6667 12.3335 18.6267 5.9335 21.32 2.48016C22 1.60016 21.3733 0.333496 20.2667 0.333496H1.71999C0.613327 0.333496 -0.01334 1.60016 0.66666 2.48016Z"
                    fill="#505A5F"
                  />
                </svg>
              </span>
              <span style={{ marginLeft: "8px", fontWeight: "normal" }}>{t("ES_COMMON_FILTER_BY")}</span>
            </div>
            <div className="clearAll" onClick={clearAll}>
              {t("ES_COMMON_CLEAR_ALL")}
            </div>
            {props.type === "desktop" && (
              <span className="clear-search" onClick={clearAll} style={{ border: "1px solid #e0e0e0", padding: "6px" }}>
                <svg width="17" height="17" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74Z"
                    fill="#505A5F"
                  />
                </svg>
              </span>
            )}
            {props.type === "mobile" && (
              <span onClick={props.onClose}>
                <CloseSvg />
              </span>
            )}
          </div>
          <div>
            <RadioButtons
              onSelect={(d) => localParamChange({ uuid: d })}
              selectedOption={_searchParams?.uuid || { code: "ASSIGNED_TO_ALL", name: "ES_INBOX_ASSIGNED_TO_ALL" }}
              t={t}
              optionsKey="name"
              options={[
                { code: "ASSIGNED_TO_ME", name: "ES_INBOX_ASSIGNED_TO_ME" },
                { code: "ASSIGNED_TO_ALL", name: "ES_INBOX_ASSIGNED_TO_ALL" },
              ]}
            />
            <div>
              <div className="filter-label" style={{ fontWeight: "normal" }}>
                {t("ES_INBOX_LOCALITY")}:
              </div>
              <Localities selectLocality={selectLocality} tenantId={tenantId} boundaryType="revenue" />
              <div className="tag-container">
                {_searchParams?.locality?.map((locality, index) => {
                  return (
                    <RemoveableTag
                      key={index}
                      // text={locality.name}
                      text={t(`${locality.i18nkey}`)}
                      onClick={() => {
                        localParamChange({ locality: _searchParams?.locality.filter((loc) => loc.code !== locality.code) });
                      }}
                    />
                  );
                })}
              </div>
            </div>
            <div>
              <div className="filter-label" style={{ fontWeight: "normal" }}>
                {t("CS_INBOX_STATUS_FILTER")}
              </div>
              {statuses?.map((e, index) => {
                const checked = _searchParams?.applicationStatus?.includes(e.statusid);
                return (
                  <CheckBox
                    key={index + "service"}
                    label={t(`CS_COMMON_INBOX_${e.businessservice.toUpperCase()}`)+" - "+t(`WF_NEWTL_${e.applicationstatus}`)+" "+`(${e.count})`}
                    value={e.statusid}
                    checked={checked}
                    onChange={(event) => onServiceSelect(event, e.statusid)}
                  />
                );
              })}
            </div>
            <div>
              <SubmitBar
                disabled={_.isEqual(_searchParams, searchParams)}
                onSubmit={() => onFilterChange(_searchParams)}
                label={t("ES_COMMON_APPLY")}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Filter;