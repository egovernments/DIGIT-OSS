import React, { useState } from "react";
import { Dropdown, RadioButtons, ActionBar, RemoveableTag, CloseSvg, CheckBox, Localities, SubmitBar, RefreshSVG } from "@egovernments/digit-ui-react-components";

import { useTranslation } from "react-i18next";

import Status from "./Status";
import ServiceCategory from "./ServiceCategory";
import _ from "lodash";
import { stringReplaceAll } from "../../utils";

const Filter = ({ searchParams, onFilterChange,onRefresh, defaultSearchParams, ...props }) => {
  const { t } = useTranslation();

  const [_searchParams, setSearchParams] = useState(() => searchParams);
  const [ clearCheck, setclearCheck] = useState(false);
  const [selectedCategories, setselectedCategories] = useState([]);

  const localParamChange = (filterParam) => {
    setclearCheck(false);
    let keys_to_delete = filterParam.delete;
    let _new = { ..._searchParams, ...filterParam };
    if (keys_to_delete) keys_to_delete.forEach((key) => delete _new[key]);
    delete filterParam.delete;
    setSearchParams({ ..._new });
  };

  const clearAll = () => {
    setSearchParams(defaultSearchParams);
    onFilterChange(defaultSearchParams);
    setselectedCategories([]);
    setclearCheck(true);
  };

  const Refresh = () => {
    onRefresh(defaultSearchParams,true);
    setclearCheck(true);
  }

  return (
    <React.Fragment>
      <div className="filter">
        <div className="filter-card">
          <div className="heading" style={{ alignItems: "center" }}>
            <div className="filter-label" style={{ display: "flex", alignItems: "center", marginTop:"auto"}}>
              <span>
                <svg width="17" height="17" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0.66666 2.48016C3.35999 5.9335 8.33333 12.3335 8.33333 12.3335V20.3335C8.33333 21.0668 8.93333 21.6668 9.66666 21.6668H12.3333C13.0667 21.6668 13.6667 21.0668 13.6667 20.3335V12.3335C13.6667 12.3335 18.6267 5.9335 21.32 2.48016C22 1.60016 21.3733 0.333496 20.2667 0.333496H1.71999C0.613327 0.333496 -0.01334 1.60016 0.66666 2.48016Z"
                    fill="#505A5F"
                  />
                </svg>
              </span>
              <span style={{ marginLeft: "8px", fontWeight: "normal" }}>{t("UC_FILTERS_LABEL")}:</span>
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
                {/* {t("ES_COMMON_CLEAR_ALL")} */}
              </span>
            )}
            {props.type === "mobile" && (
            <div>
              <span onClick={props.Close}>
                <CloseSvg />
              </span>
              <span className="clear-search" onClick={Refresh} style={{ border: "1px solid #e0e0e0", padding: "6px", marginTop:"5px" }}>
                <RefreshSVG />
              </span>
            </div>
            )}
          </div>
          <div>
            <div>
              <Status
                _searchParams={_searchParams}
                businessServices={_searchParams.services}
                clearCheck={clearCheck}
                setclearCheck={setclearCheck}
                onAssignmentChange={(e, status) => {
                  if (e.target.checked) localParamChange({ status: [..._searchParams?.status, status?.code] });
                  else localParamChange({ status: _searchParams?.status.filter((e) => e !== status?.code) });
                }}
              />
            </div>
            <div>
              <ServiceCategory
                searchParams={_searchParams}
                setclearCheck={setclearCheck}
                selectedCategory={selectedCategories}
                businessServices={_searchParams.services}
                clearCheck={clearCheck}
                setSearchParams={setSearchParams}
                setselectedCategories={setselectedCategories}
                onAssignmentChange={(e, businessService) => {
                  let filterParam = [];
                  let selectedCategory = [];
                  _searchParams["businessService"] = [];
                  e && e.map((ob) => {
                    filterParam.push(ob?.[1]?.code);
                    selectedCategory.push({"code":ob?.[1]?.code, "i18nKey":`BILLINGSERVICE_BUSINESSSERVICE_${stringReplaceAll(ob?.[1]?.code,".","_").toUpperCase()}`});
                  })
                  let _new = { ..._searchParams, businessService: [...filterParam] };
                  setSearchParams({..._new})
                  setselectedCategories([...selectedCategory])
                  // if (e.target.checked) localParamChange({ businessService: [..._searchParams?.businessService, businessService?.code] });
                  // else localParamChange({ businessService: _searchParams?.businessService.filter((e) => e !== businessService?.code) });
                }}
              />
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
