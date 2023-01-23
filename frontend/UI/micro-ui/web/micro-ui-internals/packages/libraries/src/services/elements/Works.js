import { Request } from "../atoms/Utils/Request";
import Urls from "../atoms/urls";
export const WorksService = {
    createLOI: (details) =>
        Request({
            url: Urls.works.create,
            data: details,
            useCache: false,
            setTimeParam: false,
            userService: true,
            method: "POST",
            params: {},
            auth: true,
        }),
    estimateSearch: ({ tenantId, filters }) =>
        Request({
            url: Urls.works.estimateSearch,
            useCache: false,
            method: "POST",
            auth: true,
            userService: false,
            params: { tenantId, ...filters },
        }),
    loiSearch: ({ tenantId, filters }) =>
        Request({
            url: Urls.works.loiSearch,
            useCache: false,
            method: "POST",
            auth: true,
            userService: false,
            params: { tenantId, ...filters },
        }),
    createEstimate:(details)=>
        Request({
            url: Urls.works.createEstimate,
            data:details,
            useCache:false,
            setTimeParam:false,
            userService:true,
            method:"POST",
            // params:{},
            auth:true,

        }),
    approvedEstimateSearch:({ tenantId, filters })=>
         Request({
            //update URL for Approved Estimate Search
            url: Urls.works.approvedEstimateSearch,
            useCache: false,
            method: "POST",
            auth: true,
            userService: false,
            params: { tenantId, ...filters },
        }),
    SearchEstimate:(details)=>
        Request({
           url: Urls.works.searchEstimate,
           data:details,
           useCache:false,
           setTimeParam:false,
           userService:true,
           method:"POST",
           auth:true,
       }),
    updateLOI: (details) =>
        Request({
            url: Urls.works.updateLOI,
            data: details,
            useCache: false,
            setTimeParam: false,
            userService: true,
            method: "POST",
            // params:{},
            auth: true,
        }),
    updateEstimate:(details)=>
       Request({
           url: Urls.works.updateEstimate,
           data:details,
           useCache:false,
           setTimeParam:false,
           userService:true,
           method:"POST",
           // params:{},
           auth:true,
       }),
    downloadEstimate:(tenantId, estimateNumber)=>
        Request({
            url: Urls.works.download_pdf,
            data: {},
            useCache: true,
            method: "POST",
            params: { tenantId, estimateNumber},
            auth: true,
            locale: true,
            userService: true,
            userDownload: true,
        }),
}