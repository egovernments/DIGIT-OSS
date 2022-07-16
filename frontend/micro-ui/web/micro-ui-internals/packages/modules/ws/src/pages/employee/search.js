import React, { useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Toast } from "@egovernments/digit-ui-react-components";

const Search = ({ path }) => {
  const [isBothCallsFinished, setIsBothCallFinished] = useState(true);
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [payload, setPayload] = useState({});
  const Search = Digit.ComponentRegistryService.getComponent("WSSearchApplication");
  const applicationTypes = ["NEW_WATER_CONNECTION", "NEW_SEWERAGE_CONNECTION", "MODIFY_WATER_CONNECTION", "MODIFY_SEWERAGE_CONNECTION"];
  // const [businessServ, setBusinessServ] = useState("");
  const getUrlPathName = window.location.pathname;
  const checkPathName = getUrlPathName.includes("water/search-application");
  const businessServ = checkPathName ? "WS" : "SW";
  const [showToast, setShowToast] = useState(null);

  function onSubmit(_data) {
    if(_data.applicationNumber==="" && _data.connectionNumber==="" && _data.mobileNumber==="" && !_data.applicationType && !_data.applicationStatus && !_data.fromDate && !_data.toDate ){
      setShowToast({ warning: true, label: "ERR_PT_FILL_VALID_FIELDS" });
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return
    }
    const index = applicationTypes.indexOf(_data.applicationType?.code);
    var fromDate = new Date(_data?.fromDate);
    fromDate?.setSeconds(fromDate?.getSeconds() - 19800);
    var toDate = new Date(_data?.toDate);
    toDate?.setSeconds(toDate?.getSeconds() + 86399 - 19800);
    const data = {
      ..._data,
      ...(_data.toDate ? { toDate: toDate?.getTime() } : {}),
      ...(_data.fromDate ? { fromDate: fromDate?.getTime() } : {}),
    };
    setPayload(
      Object.keys(data)
        .filter((k) => data[k])
        .reduce((acc, key) => ({ ...acc, [key]: typeof data[key] === "object" ? data[key].code : data[key] }), {})
    );
  }

  const config = {
    enabled: !!(payload && Object.keys(payload).length > 0),
  };

  const result = Digit.Hooks.ws.useSearchWS({ tenantId, filters: payload, config, bussinessService: businessServ, t ,shortAddress:true });
  
  return (
    <Fragment>
      <Search
        t={t}
        tenantId={tenantId}
        onSubmit={onSubmit}
        data={result?.data ? result?.data : { display: "ES_COMMON_NO_DATA" }}
        count={result?.count}
        resultOk={!result?.isLoading}
        businessService={businessServ}
      />
      {showToast && (
        <Toast
          error={showToast.error}
          warning={showToast.warning}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
    </Fragment>
  );
};

export default Search;
