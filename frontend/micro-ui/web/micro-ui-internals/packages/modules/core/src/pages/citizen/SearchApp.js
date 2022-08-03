import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AuditSearchApplication from "../../components/Search";
const Search = ({ path }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCitizenCurrentTenant()
  const [payload, setPayload] = useState({});
  const convertDateToEpoch = (dateString, dayStartOrEnd = "dayend") => {
    //example input format : "2018-10-02"
    try {
      const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
      const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
      DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
      if (dayStartOrEnd === "dayend") {
        DateObj.setHours(DateObj.getHours() + 24);
        DateObj.setSeconds(DateObj.getSeconds() - 1);
      }
      return DateObj.getTime();
    } catch (e) {
      return dateString;
    }
  };
  function onSubmit(_data) {
    Digit.SessionStorage.set("AUDIT_APPLICATION_DETAIL", {
      offset: 0,
      limit: 5,
      sortBy: "commencementDate",
      sortOrder: "DESC",
    });
    const data = {
        ..._data,
        fromDate: convertDateToEpoch(_data?.fromDate),
        toDate: convertDateToEpoch(_data?.toDate),
      };
  
      setPayload(
        Object.keys(data)
          .filter((k) => data[k])
          .reduce((acc, key) => ({ ...acc, [key]: typeof data[key] === "object" ? data[key] : data[key] }), {})
      );
    }
    useEffect(() => {
      const storedPayload = Digit.SessionStorage.get("AUDIT_APPLICATION_DETAIL") || {};
      if (storedPayload) {
        const data = {
          ...storedPayload,
        };
  
        setPayload(
          Object.keys(data)
          .filter((k) => data[k])
          .reduce((acc, key) => ({ ...acc, [key]: typeof data[key] === "object" ? data[key].code : data[key] }), {})
      );
    }
  }, []);
  const config = {
    enabled: !!(payload && Object.keys(payload).length > 0),
  };
  const newObj = { ...payload };
 
  const {
    isLoading,
    data,
} = Digit.Hooks.useAudit({
    tenantId,
    filters: {
        ...newObj,
      },
      config,
    });

    return (
        <AuditSearchApplication
          t={t}
          tenantId={tenantId}
          onSubmit={onSubmit}
          data={
            !isLoading
              ? data?.ElasticSearchData?.length > 0
                ? data?.ElasticSearchData
                : { display: "ES_COMMON_NO_DATA" }
              : ""
          }
          count={data?.ElasticSearchData?.length}
        />
      );
    };
    export default Search;