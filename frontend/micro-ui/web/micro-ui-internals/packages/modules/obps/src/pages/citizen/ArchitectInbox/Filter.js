import { ActionBar, ApplyFilterBar, CloseSvg, Dropdown, SubmitBar } from "@egovernments/digit-ui-react-components";
import React ,{useState}from "react";
import { useTranslation } from "react-i18next";
import Status from "./Status";

const applicationTypes = [
  {
    name: "BUILDING_PLAN_SCRUTINY",
  },
  {
    name: "BUILDING_NEW_PLAN_SCRUTINY",
  },
];

const serviceTypes = [
  {
    name: "NEW_CONSTRUCTION",
  },
];

const Filter = ({ searchParams, paginationParms, onFilterChange, onSearch, onClose, removeParam, statuses, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [_searchParams, setSearchParams] = useState(() => ({...searchParams,applicationStatus:[]}));
  

  const onStatusChange = (e, type) => {
    if (e.target.checked) setSearchParams({ applicationStatus: [..._searchParams?.applicationStatus, type] });
    else setSearchParams({ applicationStatus: _searchParams?.applicationStatus.filter((option) => type.name !== option.name) });
  };

  const handleChange = (option) => {
    setSearchParams(old=>({...old,...option}));
  };
  const clearAll = () => {setSearchParams({applicationStatus:[]});
  onFilterChange({});
};

  return (
    <React.Fragment>
      <div className="filter">
        <div className="filter-card">
          <div className="heading">
            <div className="filter-label">{t("ES_COMMON_FILTER_BY")}:</div>
            {/* <div className="clearAll" onClick={clearAll}>
            {t("ES_COMMON_CLEAR_ALL")}
          </div> */}
            {props.type === "desktop" && (
              <span className="clear-search" onClick={clearAll}>
                {t("ES_COMMON_CLEAR_ALL")}
              </span>
            )}
            {props.type === "mobile" && (
              <span onClick={onClose}>
                <CloseSvg />
              </span>
            )}
          </div>
          <div>
            <div className="filter-label">{t("BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL")}</div>
            <Dropdown t={t} option={applicationTypes} selected={{name:_searchParams?.applicationType}} optionKey={"name"} select={(arg) => handleChange({ applicationType: arg?.name })} />
          </div>
          <div>
            <div className="filter-label">{t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL")}</div>
            <Dropdown t={t} option={serviceTypes} optionKey={"name"} selected={{name:_searchParams?.serviceType}} select={(arg) => handleChange({ serviceType: arg?.name })} />
          </div>
          <div>
            <Status onAssignmentChange={onStatusChange} statuses={statuses} searchParams={_searchParams} />
          </div>
          {props.type !== "mobile" && (
            <div>
              <SubmitBar
                // disabled={status?.length == mdmsStatus?.length&& service?.code == defaultService}
                onSubmit={() => {
                  onFilterChange(_searchParams);
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
                // if (props.type === "mobile") onSearch({ delete: ["applicationNos"] });
                // else onSearch();
                if (props.type === "mobile") {
                  onClose();
                }
                onFilterChange(_searchParams);
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
