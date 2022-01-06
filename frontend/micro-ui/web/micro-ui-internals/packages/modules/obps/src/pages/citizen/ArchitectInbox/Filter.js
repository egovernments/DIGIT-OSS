import { ActionBar, ApplyFilterBar, CloseSvg, Dropdown, SubmitBar, FilterIcon, Loader, CheckBox, RadioButtons } from "@egovernments/digit-ui-react-components";
import React ,{useMemo, useState}from "react";
import { useTranslation } from "react-i18next";
import Status from "./Status";

const Filter = ({ searchParams, paginationParms, onFilterChange, onSearch, onClose, removeParam, statuses, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [_searchParams, setSearchParams] = useState(() => ({...searchParams,applicationType: [], applicationStatus:[]}));
  
  const { data: applicationTypes, isLoading: loadingApplicationTypes } = Digit.Hooks.obps.SearchMdmsTypes.useApplicationTypes(tenantId);
  const availableBusinessServicesOptions = Digit.Hooks.obps.useBusinessServiceBasedOnServiceType({applicationType: _searchParams?.applicationType})
  const filteredStatus = useMemo(() => _searchParams?.applicationType?.length > 0 && _searchParams.businessService ? statuses?.filter(e => e.businessservice === _searchParams.businessService) : null ,[statuses, _searchParams.businessService, _searchParams?.applicationType])
  
  const onStatusChange = (e, type) => {
    if (e.target.checked) setSearchParams({..._searchParams, applicationStatus: [..._searchParams?.applicationStatus, type] });
    else setSearchParams({..._searchParams, applicationStatus: _searchParams?.applicationStatus.filter((option) => type.name !== option.name) });
  };

  const handleChange = (option) => {
    setSearchParams(old=>({...old,...option}));
  };
  const clearAll = () => {setSearchParams({applicationType: [], applicationStatus:[]});
  onFilterChange({});
};

  return (
    <React.Fragment>
      <div className="filter">
        <div className="filter-card">
          <div className="heading">
            <div className="filter-label">
              <FilterIcon />
              {t("ES_COMMON_FILTER_BY")}
              <span className="clear-search" onClick={clearAll} style={{ border: "1px solid #e0e0e0", padding: "6px" }}>
                <svg width="17" height="17" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                  d="M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74Z"
                  fill="#505A5F"
                  />
                </svg>
              </span>
            </div>
            {props.type === "mobile" && (
              <span onClick={onClose}>
                <CloseSvg />
              </span>
            )}
          </div>
          {loadingApplicationTypes ? <Loader/> : <div>
            <div className="filter-label">{t("BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL")}</div>
            {/* <Dropdown t={t} option={applicationTypes} selected={_searchParams?.applicationType} optionKey={"i18nKey"} select={(arg) => handleChange({ applicationType: arg })} /> */}
            {applicationTypes.map(applicationType => {
                return <CheckBox
                  key={applicationType.code}
                  onChange={(e) =>{
                    e.target.checked ?
                    handleChange({applicationType : [..._searchParams?.applicationType, applicationType]}) 
                    : setSearchParams({applicationType : _searchParams?.applicationType.filter( item => item.code !== applicationType.code), applicationStatus:[]})
                  }}
                  checked={_searchParams?.applicationType?.filter(e => e.code === applicationType.code)[0]}
                  label={t(applicationType?.i18nKey)}
                />  
              })}
          </div>}
          {/* {filteredServiceTypes?.length > 0 ? loadingServiceTypes ? <Loader/> : <div>
            <div className="filter-label">{t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL")}</div>
            <Dropdown t={t} option={filteredServiceTypes} optionKey={"i18nKey"} selected={_searchParams?.serviceType} select={(arg) => handleChange({ serviceType: arg })} />
          </div> : null} */}
          {availableBusinessServicesOptions?.length > 0 ? <div>
            <div className="filter-label">{t("ES_INBOX_RISK_TYPE")}</div>
            <RadioButtons
                onSelect={(e) => handleChange({businessService: e.code})}
                selectedOption={availableBusinessServicesOptions.filter((option) => option.code === _searchParams?.businessService)[0]}
                optionsKey="i18nKey"
                name="businessService"
                options={availableBusinessServicesOptions}
              />
          </div> : null }
          {filteredStatus?.length > 0 ? <div>
            <Status onAssignmentChange={onStatusChange} statuses={filteredStatus} searchParams={_searchParams} />
          </div> : null}
          {props.type !== "mobile" && (
            <div>
              <SubmitBar
                // disabled={status?.length == mdmsStatus?.length&& service?.code == defaultService}
                onSubmit={() => {
                  onFilterChange({applicationStatus: _searchParams?.applicationStatus });
                  props?.onClose?.();
                }}
                label={t("ACTION_TEST_APPLY")}
              />
            </div>
          )}
        </div>

        {props.type === "mobile" && (
          <ActionBar>
            <ApplyFilterBar
              submit={false}
              labelLink={t("ES_COMMON_CLEAR_ALL")}
              buttonLink={t("ES_COMMON_FILTER")}
              onClear={clearAll}
              onSubmit={() => {
                onFilterChange({applicationStatus: _searchParams?.applicationStatus });
                if (props.type === "mobile") {
                  onClose();
                }
              }}
              style={{ flex: 1 }}
            />
          </ActionBar>
        )}
      </div>
    </React.Fragment>
  );
};

export default Filter;
