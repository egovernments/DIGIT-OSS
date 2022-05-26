import { CheckBox, CloseSvg, Dropdown, Loader, SubmitBar,ApplyFilterBar,ActionBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDefaultReceiptService } from "../utils";

const ReceiptsFilter = ({ searchParams, onFilterChange, onSearch, removeParam, ...props }) => {

  const tenantId = Digit.ULBService.getCurrentTenantId() || '';
  const tenant =Digit.ULBService.getStateId();
  const [_searchParams, setSearchParams] = useState(() => searchParams);
  const { t } = useTranslation();
  const defaultService = getDefaultReceiptService();
  const [status, setStatus] = useState([]);
  const [service, setService] = useState({ name: `BILLINGSERVICE_BUSINESSSERVICE_${defaultService}`, code: defaultService });

  const { data, isLoading, ...rest } = Digit.Hooks.receipts.useReceiptsMDMS(
    tenant,
    "CancelReceiptReasonAndStatus"
  );

  const mdmsStatus = data?.dropdownDataStatus || [];

  useEffect(() => {
    if (service?.code != _searchParams.businessServices) {
      setSearchParams({ businessServices: service?.code });
    }
  }, [service]);

  useEffect(() => {
    if (status) {
      setSearchParams({ status: status.join(',') });
    }
  }, [status]);

  const onCheckBoxClick = (value) => {
    if (status.includes(value)) {
      status.splice(status.findIndex((x) => x == value), 1)
    } else {
      status.push(value)
    }
    setStatus([...status])
  }

  const clearAll = () => {
    onFilterChange({ delete: Object.keys(searchParams) }, true);
    setStatus([]);
    setService({ name: `BILLINGSERVICE_BUSINESSSERVICE_${defaultService}`, code: defaultService });
    props?.onClose?.();
  };
  if (isLoading) {
    return <Loader />
  }
  return (
    <React.Fragment>
      <div className="filter">
        <div className="filter-card">
          <div className="heading">
            <div className="filter-label">{t("COMMON_TABLE_FILTERS")}:</div>
            <div className="clearAll" onClick={clearAll}>
              {t("CR_COMMON_CLEAR_ALL")}
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
            <div>
              <div className="filter-label">{t("CR_COMMON_TABLE_COL_STATUS")}</div>
              {mdmsStatus.map((sta, index) =>
                <CheckBox
                  key={index + "service"}
                  label={t(sta?.name)}
                  value={sta?.code}
                  checked={status.includes(sta?.code)}
                  onChange={(event) =>
                    onCheckBoxClick(event.target.value)}
                />
              )}
              <div>
                <div className="filter-label">{t("CR_SERVICE_CATEGORY_LABEL")}</div>
                <Dropdown t={t} option={data?.dropdownData || null} value={service} selected={service} select={setService} optionKey={"name"} />
              </div>
              {props.type !== "mobile" &&<div>
                <SubmitBar
                  // disabled={status?.length == mdmsStatus?.length&& service?.code == defaultService}
                  onSubmit={() => {onFilterChange(_searchParams)
                    props?.onClose?.()}}
                  label={t("ACTION_TEST_APPLY")}
                />
              </div>}
              {props.type === "mobile" &&(  <ActionBar>
                <ApplyFilterBar
                  submit={false}
                  labelLink={t("ES_COMMON_CLEAR_ALL")}
                  buttonLink={t("ACTION_TEST_APPLY")}
                  onSubmit={() => {onFilterChange(_searchParams)
                    props?.onClose?.()}}
                  onClear={() => {clearAll()
                    props?.onClose?.()}}
                  style={{ flex: 1 }}
                />
              </ActionBar>)}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ReceiptsFilter;
