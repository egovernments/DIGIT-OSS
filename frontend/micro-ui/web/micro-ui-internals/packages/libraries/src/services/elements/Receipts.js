import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

const ReceiptsService = {
    search: (tenantId, filters, searchParams, businessService) =>
        Request({
            url: Digit.SessionStorage.get("userType") == "citizen" ? `${Urls.receipts.payments}/_search` : `${Urls.receipts.payments}/${businessService}/_search`,
            useCache: false,
            method: "POST",
            auth: true,
            userService: true,
            params: { tenantId, ...filters, ...searchParams },
        }),
    receipt_download: (bussinessService, consumerCode, tenantId,pdfKey,receiptNumbers) =>{
        let newParam={ bussinessService,tenantId };
        if(receiptNumbers){
            newParam['receiptNumbers']=receiptNumbers;
        }else{
            newParam['consumerCode']=consumerCode;
        }
            return Request({
            url: Urls.mcollect.receipt_download,
            data: {},
            useCache: true,
            method: "POST",
            params: { ...newParam},
            auth: window.location.href.includes("pt/property/my-payments")? false : true,
            locale: true,
            userService: window.location.href.includes("pt/property/my-payments")? false : true,
            userDownload: true,
            })
        },
        bill_download: (bussinessService, consumerCode, tenantId,pdfKey) =>{
            let newParam={ bussinessService,tenantId ,consumerCode};
                return Request({
                url: Urls.mcollect.bill_download,
                data: {},
                useCache: true,
                method: "POST",
                params: { ...newParam},
                auth:  true,
                locale: true,
                userService:true,
                userDownload: true,
                })
            },
    update: (data, tenantId, businessService) =>
        Request({
            data: data,
            url: `${Urls.receipts.payments}/${businessService}/_workflow`,
            useCache: false,
            method: "POST",
            auth: true,
            userService: true,
            params: { tenantId },
        }),
}

export default ReceiptsService;
