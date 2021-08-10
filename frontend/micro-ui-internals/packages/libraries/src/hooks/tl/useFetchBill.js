import React from "react"
import { useFetchCitizenBillsForBuissnessService } from "../payment"

const useFetchBill = ({params, config}) => {
    return useFetchCitizenBillsForBuissnessService({ businessService: "TL", ...params },{
        ...config,
        select: (data) => {
            const {Bill: _data} = data
            return _data.map(i => ({
                TL_COMMON_BILL_NUMBER: i.billNumber,
                TL_COMMON_TOTAL_AMOUNT: i.totalAmount,
                TL_COMMON_PAYER_NAME: i.payerName,
                TL_COMMON_CONSUMER_CODE: i.consumerCode,
                raw: { ...i, applicationNumber: i.consumerCode }
            }))
        }
    })
}

export default useFetchBill