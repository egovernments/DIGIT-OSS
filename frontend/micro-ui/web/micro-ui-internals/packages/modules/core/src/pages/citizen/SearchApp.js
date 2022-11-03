import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AuditSearchApplication from "../../components/Search";
import { Link } from "react-router-dom";
const Search = ({ path }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCitizenCurrentTenant()
  const [payload, setPayload] = useState({});
  const isMobile = window.Digit.Utils.browser.isMobile();
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
      if (dayStartOrEnd === "daystart") {
        DateObj.setHours(DateObj.getHours());
        DateObj.setSeconds(DateObj.getSeconds() + 1);
      }
      return DateObj.getTime();
    } catch (e) {
      return dateString;
    }
  };
  function onSubmit(_data) {
    Digit.SessionStorage.set("AUDIT_APPLICATION_DETAIL", {
      offset:0,
      limit:10
    });
    let data = {
        ..._data,
        fromDate: convertDateToEpoch(_data?.fromDate, _data?.fromDate == _data?.toDate ? "daystart":""),
        toDate: convertDateToEpoch(_data?.toDate, _data?.fromDate == _data?.toDate ? "dayend":""),
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

  let curoffset = window.location.href.split("/").pop();
  let previousoffset;
  let currentoffset;
  if (!isNaN(parseInt(curoffset))) {
    currentoffset = curoffset;
    previousoffset = parseInt(curoffset) + 10;
  } else {
    previousoffset = 10;
  } 

  const newObj = isMobile ? { ...payload, offset:!isNaN(parseInt(curoffset))? parseInt(currentoffset) : 0 } : { ...payload };
 
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
      <React.Fragment>
        <AuditSearchApplication
          t={t}
          tenantId={tenantId}
          onSubmit={onSubmit}
          data={
            !isLoading
              ? data?.ElasticSearchData?.filter((e)=> !e.total)?.length > 0
                ? data?.ElasticSearchData?.filter((e)=> !e.total)
                : { display: "ES_COMMON_NO_DATA" }
              : ""
          }
          count={data?.ElasticSearchData?.filter((e)=> e.total)?.[0]?.total}
          isLoading={isLoading}
        />
        {isMobile && data?.ElasticSearchData?.filter((e)=> !e.total)?.length && data?.ElasticSearchData?.filter((e)=> !e.total)?.length !== 0 && (
          <div>
            <p style={{ marginLeft: "16px",marginBottom:"40px"}}>
              <span className="link">{<Link to={`/digit-ui/citizen/Audit/${previousoffset}`}>{t("PT_LOAD_MORE_MSG")}</Link>}</span>
            </p>
          </div>
        )}
        </React.Fragment>
      );
    };
    export default Search;