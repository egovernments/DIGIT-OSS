import { ReportsService } from "../../services/elements/Reports";
import { useQuery } from "react-query";
import React from "react";


const useReportMeta = {
    fetchMetaData:(moduleName,reportName,tenantId) => 
        useQuery(["reportMeta",moduleName,reportName],()=> ReportsService.fetchMeta({moduleName,reportName,tenantId})),
    fetchReportData: (moduleName, reportName, tenantId,searchParams,config={}) =>
         useQuery(["reportMetaData", moduleName, searchParams], () => ReportsService.fetchReportsData({ moduleName, reportName, tenantId,searchParams }),config)
    
}
export default useReportMeta
