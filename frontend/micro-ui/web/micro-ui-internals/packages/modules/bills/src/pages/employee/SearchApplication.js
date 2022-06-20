
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SearchApplication from "../../components/SearchApp";
import {Toast } from "@egovernments/digit-ui-react-components";
const Search = ({ path }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [payload, setPayload] = useState({});
  const [showToast, setShowToast] = useState(null);

  function onSubmit(_data) {
    Digit.SessionStorage.set("BILL_SEARCH_APPLICATION_DETAIL", {
      serviceCategory: _data?.serviceCategory,
      consumerCode: _data?.consumerCode,
      locality:_data?.locality,
      offset: 0,
      limit: 10,
      sortBy: "commencementDate",
      sortOrder: "DESC",
    });
    const data = {
      ..._data,
    };

    setPayload(
      Object.keys(data)
        .filter((k) => data[k])
        .reduce((acc, key) => ({ ...acc, [key]: typeof data[key] === "object" ? data[key] : data[key] }), {})
    );
  }
  useEffect(() => {
    const storedPayload = Digit.SessionStorage.get("BILL_SEARCH_APPLICATION_DETAIL") || {};
    if (storedPayload) {
      const data = {
        ...storedPayload,
      };

      setPayload(
        Object.keys(data)
          .filter((k) => data[k])
          .reduce((acc, key) => ({ ...acc, [key]: typeof data[key] === "object" ? data[key].code : data[key] }), {})
      );
      let payload = Object.keys(data).filter( k => data[k] ).reduce( (acc, key) => ({...acc,  [key]: typeof data[key] === "object" ? data[key].code : data[key] }), {} );
      if(Object.entries(payload).length>0 && !payload.serviceCategory && !payload.billNumber && !payload.consumerCode && !payload.mobileNumber)
      setShowToast({ warning: true, label: "ERR_PT_FILL_VALID_FIELDS" });
      else
        setPayload(payload)
  
  }
  }, []);
  const config = {
    enabled: !!(payload && Object.keys(payload).length > 0),
  };

  const newObj = { ...payload };
  const service = payload?.serviceCategory;
  delete newObj.serviceCategory;
  const {
    isFetching,
    isLoading,
    isSuccess,
    count,
    isLoading: hookLoading,
    searchResponseKey,
    data: billsResp,
    searchFields,
    ...rest
  } = Digit.Hooks.useBillSearch({
    tenantId,
    filters: {
      ...newObj,
      url: service?.url,
      businesService: service?.businesService,
    },
    config: {},
  });


  return <React.Fragment>
    <SearchApplication
      t={t}
      tenantId={tenantId}
      onSubmit={onSubmit}
      setShowToast={setShowToast}
      data={
        !isLoading && isSuccess
          ? billsResp?.Bills?.length > 0
            ? billsResp?.Bills?.map((obj) => ({
                ...obj,
              }))
            : { display: "ES_COMMON_NO_DATA" }
          : ""
      }
      count={billsResp?.Bills?.length}
    />
    {showToast && (
      <Toast
        error={showToast.error}
        warning={showToast.warning}
        label={t(showToast.label)}
        isDleteBtn={true}
        onClose={() => {
          setShowToast(null);
        }}
      />
    )}
  </React.Fragment>
};

export default Search;
