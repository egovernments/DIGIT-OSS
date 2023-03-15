import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

const BillingService = {
  search_bill: ({ tenantId, filters }) =>
    Request({
      url: `${Urls.billgenie}${filters.url}`,
      useCache: false,
      method: "POST",
      data: {
        searchCriteria: {
          tenantId: tenantId,
          ...filters,
        },
      },
      auth: true,
      userService: false,
    }),
    cancel_bill:(filters) =>
      Request({
        url: Urls?.bills?.cancelBill,
        useCache: false,
        method: "POST",
        data: {
          UpdateBillCriteria: {
            ...filters,
          },
        },
        auth: true,
        userService: false,
      }),
}

export default BillingService
