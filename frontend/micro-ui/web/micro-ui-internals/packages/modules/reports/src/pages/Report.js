import React,{useState,useEffect} from 'react'
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";

const getSearchParamsObj = (field,data,key,t) => {
  let obj = {}
      switch (field.type) {
        case "singlevaluelist":
          const defaultValueObj = field.defaultValue
          const isLoc = field.localisationRequired;
          let input
          if (isLoc) {
            input = Object.keys(defaultValueObj).find(el => t(defaultValueObj[el]) === data[key])
          } else {
            input = Object.keys(defaultValueObj).find(el => defaultValueObj[el] === data[key])
          }
          
          obj["name"] = key
          obj["input"] = input;
          return obj
        case "epoch":
          obj["name"] = key
          if(key==="fromDate") 
            obj["input"] = new Date(data?.fromDate).getTime();
          else
            obj["input"] = new Date(data?.toDate).getTime();
          return obj
        default:
          return
      }
}

const Report = () => {
  const { moduleName,reportName } = useParams();
  const {t} = useTranslation()
  const [filter,setFilter] = useState([])
  const { isLoading:SearchFormIsLoading, data:SearchFormUIData } = Digit.Hooks.reports.useReportMeta.fetchMetaData(moduleName,reportName,"pb.amritsar")

  const { isLoading: isLoadingReportsData, data: ReportsData } = Digit.Hooks.reports.useReportMeta.fetchReportData(moduleName, reportName, "pb.amritsar", filter,{
    enabled: !!filter.length > 0
  })


  const SearchApplication = Digit.ComponentRegistryService.getComponent("ReportSearchApplication");

  const onSubmit = (data) => {
    const reportData = SearchFormUIData.reportDetails.searchParams;
    let searchParams = []
    Object.keys(data).map((key) => {
      const field = reportData.filter(field => field.name === key )[0]
      const obj = getSearchParamsObj(field,data,key,t)
      searchParams.push(obj)
    })
    setFilter(searchParams)
  }

  return (
    <SearchApplication onSubmit={onSubmit} isLoading={SearchFormIsLoading} data={SearchFormUIData}/>
  )
}

export default Report