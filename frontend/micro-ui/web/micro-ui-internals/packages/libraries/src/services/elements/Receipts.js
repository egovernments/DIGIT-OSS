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
    receipt_download: (bussinessService, consumerCode, tenantId,pdfKey) =>
        Request({
            url: Urls.receipts.receipt_download,
            data: {},
            useCache: true,
            method: "POST",
            params: { bussinessService, consumerCode, tenantId,pdfKey },
            auth: true,
            userService: true,
            locale: true,
            userDownload: true,
        }),
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
