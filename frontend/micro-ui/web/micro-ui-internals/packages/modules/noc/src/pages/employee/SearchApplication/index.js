import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Search = ({ path }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const Search = Digit.ComponentRegistryService.getComponent("NOCSearchApplication");

  const availableNocTypes = ["AIRPORT_AUTHORITY"]

  const [filters, setfilters] = useState({
    offset: 0,
    limit: 10,
    tenantId,
    nocType: availableNocTypes[0]
  })

  function onSubmit(__data) {
    let __filters = filters
    for (const [key, value] of Object.entries(__data)) {
      if(value != undefined && value != null && value != ""){
        __filters = {...__filters, [key]:value}        
      }
    }
    setfilters(__filters)
    // debugger
    // setSearchData(_data);
    // var fromDate = new Date(_data?.fromDate);
    // fromDate?.setSeconds(fromDate?.getSeconds() - 19800);
    // var toDate = new Date(_data?.toDate);
    // setSelectedType(_data?.applicationType?.code);
    // toDate?.setSeconds(toDate?.getSeconds() + 86399 - 19800);
    // const data = {
    //   ..._data,
    //   ...(_data.toDate ? { toDate: toDate?.getTime() } : {}),
    //   ...(_data.fromDate ? { fromDate: fromDate?.getTime() } : {}),
    // };

    // setPayload(
    //   Object.keys(data)
    //     .filter((k) => data[k])
    //     .reduce((acc, key) => ({ ...acc, [key]: typeof data[key] === "object" ? data[key].code : data[key] }), {})
    // );
  }

  const { data, isLoading, isSuccess, error } = Digit.Hooks.noc.useNOCSearchApplication(tenantId,filters,{});
  return (
    <Search
      t={t}
      tenantId={tenantId}
      onSubmit={onSubmit}
    //   searchData={searchData}
      isLoading={isLoading}
      Count={data?.count}
      error={error}
      data={!isLoading && isSuccess && data?.Noc?.length > 0 ? data.Noc : [{ display: "ES_COMMON_NO_DATA" }]}
    />
  );
};

export default Search;
