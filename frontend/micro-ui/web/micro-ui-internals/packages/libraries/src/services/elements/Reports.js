import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";


export const ReportsService = {
    fetchMeta: ({ moduleName, reportName, tenantId }) => {
        return Request({
            url: `${Urls.reports.reportSearch}${moduleName}/${reportName}/metadata/_get`,
            params: {},
            method: "POST",
            auth: true,
            userService: true,
            reqTimestamp:true,
            data: { reportName: reportName, tenantId: tenantId },
        })
    },
    fetchReportsData:({moduleName,reportName,tenantId,searchParams}) => {
        return Request({
            url: `${Urls.reports.reportSearch}${moduleName}/${reportName}/_get`,
            params: {},
            method: "POST",
            auth: true,
            userService: true,
            reqTimestamp: true,
            data: { reportName: reportName, tenantId: tenantId, searchParams },
        })
    }
}