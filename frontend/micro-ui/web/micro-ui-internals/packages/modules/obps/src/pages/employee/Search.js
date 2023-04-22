import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const Search = ({ path }) => {
  const userInfos = sessionStorage.getItem("Digit.citizen.userRequestObject");
  const userInfo = userInfos ? JSON.parse(userInfos) : {};
  const userInformation = userInfo?.value?.info;

  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const location = useLocation();
  const details = () => {
    if (userInformation?.roles?.filter((ob) => ob.code.includes("BPAREG_"))?.length <= 0 && userInformation?.roles?.filter((ob) =>(ob.code.includes("BPA_") || ob.code.includes("CITIZEN"))).length > 0) return "BUILDING_PLAN_SCRUTINY";
    if (userInformation?.roles?.filter((ob) => ob.code.includes("BPAREG_"))?.length > 0 && userInformation?.roles?.filter((ob) =>(ob.code.includes("BPA_") || ob.code.includes("CITIZEN"))).length <= 0) return "BPA_STAKEHOLDER_REGISTRATION";
    else return "BUILDING_PLAN_SCRUTINY"
  }
  const [selectedType, setSelectedType] = useState(details());
  const [payload, setPayload] = useState({});
  const [searchData, setSearchData] = useState({});

  useEffect(()=>{
    if (location.pathname === "/digit-ui/citizen/obps/search/application" || location.pathname === "/digit-ui/employee/obps/search/application") {
      Digit.SessionStorage.del("OBPS.INBOX")
      Digit.SessionStorage.del("STAKEHOLDER.INBOX")
    }
  },[location.pathname])

  const Search = Digit.ComponentRegistryService.getComponent("OBPSSearchApplication");

  const checkData = (data) => {
    if (data?.applicationNo === "" && data?.fromDate === "" && data?.mobileNumber === "" && data?.serviceType === "" && data?.status === "" && data?.toDate === "") return false

    return true

  }

  const [paramerror,setparamerror] = useState("")

  function onSubmit(_data) {
    if (_data?.applicationType?.code === "BPA_STAKEHOLDER_REGISTRATION"){
      const isSearchAllowed = checkData(_data)
      if(!isSearchAllowed){
        setparamerror("BPA_ADD_MORE_PARAM_STAKEHOLDER")
      }
    }
    setSearchData(_data);
    var fromDate = new Date(_data?.fromDate);
    fromDate?.setSeconds(fromDate?.getSeconds() - 19800);
    var toDate = new Date(_data?.toDate);
    setSelectedType(_data?.applicationType?.code ? _data?.applicationType?.code : selectedType);
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

  let params = {};
  let filters = {};
  

  
  if (
    (selectedType && selectedType.includes("STAKEHOLDER")) ||
    (Object.keys(payload).length > 0 && payload?.applicationType && payload?.applicationType.includes("STAKEHOLDER"))
  ) {
    if (Object.entries(payload).length <= 2 && Object.keys(payload).filter((ob) => ob === "applicationType").length == 0) {
    } else {
      let filters = payload;
      if (payload.applicationNo) {
        payload["applicationNumber"] = payload.applicationNo;
        payload.applicationNo = "";
      }
      if (payload && payload["applicationType"]) delete payload["applicationType"];
      if(payload && payload["serviceType"])
      {
        payload["tradeType"] = payload["serviceType"]
        delete payload["serviceType"];
      }
      params = { ...payload, tenantId: Digit.ULBService.getStateId() };
    }
  } else {
    if (Object.keys(payload).length === 0) {
      let payload1 = {
        applicationType: "BUILDING_PLAN_SCRUTINY",
        serviceType: "NEW_CONSTRUCTION",
        ...(window.location.href.includes("/search/obps-application") && {
          mobileNumber: Digit.UserService.getUser()?.info?.mobileNumber,
        }),
      };

      setPayload({ ...payload, ...payload1 });
    }
    filters = payload;
  }
  const { data: bpaData = [], isLoading: isBpaSearchLoading, isSuccess: isBpaSuccess, error: bpaerror } = Digit.Hooks.obps.useOBPSSearch(
    selectedType,
    payload,
    tenantId,
    filters,
    params,
    {enabled:paramerror===""}
  );
  return (
    <Search
      t={t}
      tenantId={tenantId}
      onSubmit={onSubmit}
      searchData={searchData}
      isLoading={isBpaSearchLoading}
      Count={bpaData?.[0]?.Count}
      error={paramerror}
      data={!isBpaSearchLoading && isBpaSuccess && bpaData?.length > 0 ? bpaData : [{ display: "ES_COMMON_NO_DATA" }]}
      setparamerror={setparamerror}
    />
  );
};

export default Search;
