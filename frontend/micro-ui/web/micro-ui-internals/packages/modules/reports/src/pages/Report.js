import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";

const getSearchParamsObj = (field, data, key, t) => {
  let obj = {}
  if (data[key] === undefined || data[key] === '' || field === undefined || data[key] === t('ALL'))
    return
  switch (field?.type) {
    case "string":
      if(data[key]===undefined || data[key]==="")
      return
      obj["name"] = key
      obj["input"] = data[key];
      return obj
    case "singlevaluelist":
      var defaultValueObj = field.defaultValue
      var isLoc = field.localisationRequired;
      var input
      if (isLoc) {
        input = Object.keys(defaultValueObj).find(el => t(defaultValueObj[el]) === data[key])
      } else {
        input = Object.keys(defaultValueObj).find(el => defaultValueObj[el] === data[key])
      }

      obj["name"] = key
      obj["input"] = input;
      return obj

    case "multivaluelist":
      if(data?.[key]?.[0]?.name === "All")
       return 
      var defaultValueObj = field.defaultValue
      var isLoc = field.localisationRequired;
      var input
      if (isLoc) {
        input = data[key].map(selection => Object.keys(defaultValueObj).find(el => t(defaultValueObj[el]) === t(selection.name)))
        //input = Object.keys(defaultValueObj).find(el => t(defaultValueObj[el]) === data[key])
      } else {
        input = data[key].map(selection => Object.keys(defaultValueObj).find(el => defaultValueObj[el] === selection.name))
      }

      obj["name"] = key
      obj["input"] = input;
      return obj
    case "epoch":
      obj["name"] = key
      if (key === "fromDate")
        obj["input"] = new Date(data?.fromDate).getTime();
      else
        obj["input"] = new Date(data?.toDate).getTime();
      return obj
    default:
      return
  }
}

const Report = () => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const { moduleName, reportName } = useParams();
  const { t } = useTranslation()
  const [filter, setFilter] = useState([])
  const [searchData, setSearchData] = useState({})
  const { isLoading: SearchFormIsLoading, data: SearchFormUIData } = Digit.Hooks.reports.useReportMeta.fetchMetaData(moduleName, reportName, "pb.amritsar")

  const { isLoading: isLoadingReportsData, data: ReportsData } = Digit.Hooks.reports.useReportMeta.fetchReportData(moduleName, reportName, "pb.amritsar", filter, {
    //enabled: !!filter.length > 0
    enabled: isFormSubmitted
  })


  const SearchApplication = Digit.ComponentRegistryService.getComponent("ReportSearchApplication");

  const onSubmit = (data) => {
    
    setSearchData(data)   
    const reportData = SearchFormUIData.reportDetails.searchParams;
    let searchParams = []
    Object.keys(data).map((key) => {
      const field = reportData.filter(field => field.name === key)[0]
      const obj = getSearchParamsObj(field, data, key, t)
      if (obj)
        searchParams.push(obj)
    })

    setFilter(searchParams)
    setIsFormSubmitted(true)
  }

  return (
    <SearchApplication
      onSubmit={onSubmit}
      isLoading={SearchFormIsLoading}
      data={SearchFormUIData}
      tableData={!isLoadingReportsData && ReportsData?.reportData.length > 0 ? ReportsData : { display: "ES_COMMON_NO_DATA" }}
      isTableDataLoading={isLoadingReportsData}
      Count={ReportsData?.reportData.length}
      searchData={searchData}
      reportName={reportName}
    />
  )
}

export default Report