import {Header}from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
const CancelBill = () => {
    const { t } = useTranslation();
    const CancelBills = Digit.ComponentRegistryService.getComponent("CancelBills");
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [payload,setPayload] = useState("")
    const [payloadForFetchBill,setPayloadForFetchBill] = useState("")
    const [serviceType,setServiceType] = useState("")
    const onSubmit = (_data) => {
        setServiceType(_data?.businesService?.businesService)
        setPayload(prevState => {
            const obj = Object.keys(_data)
                .filter((k) => _data[k])
                .reduce((acc, key) => ({ ...acc, [key]: typeof _data[key] === "object" ? _data[key].code : _data[key] }), {})
            return {
                ...obj,
                businesService: _data?.businesService?.businesService,
                url: _data?.businesService?.url,
                billActive:"ACTIVE"
            }
        })
    }

    const { isLoading: hookLoading, data,...rest } = Digit.Hooks.useBillSearch({
        tenantId,
        filters: { ...payload,tenantId },
        config: {
            cacheTime : 0
          },
    });

    //identify the consumerids for which expiry date is < date rn
    
    const bills = data?.Bills
    let expiredConsumers = []
    let billObject = {};
    bills?.map(bill => {
        billObject[bill.consumerCode] = bill;
        if (bill.billDetails[0].expiryDate < new Date().getTime()) {
            expiredConsumers.push(bill.consumerCode);
        }
    })
    let consumerIds
    if(expiredConsumers?.length>0){
        //set the payload for fetchBill here
         consumerIds = [...expiredConsumers];
    }

    const result = Digit.Hooks.useFetchBillsForBuissnessService(
        { businessService: serviceType, ...{ consumerCode: consumerIds?.join(',') }, tenantId },{enabled:expiredConsumers?.length>0 && serviceType!==""}
    );
    const billMap = result?.data?.Bill
    billMap?.map(bill=> {
        billObject[bill.consumerCode] = bill
    })
    const finalBills = Object.values(billObject);

    return(
        <CancelBills 
            tenantId = {tenantId} 
            onSubmit={onSubmit}
            isLoading={hookLoading}
            data={expiredConsumers?.length > 0 ?finalBills:data?.Bills}
            count={data?.Bills?.length}
            resultOk={expiredConsumers?.length > 0? !result?.isLoading && result?.data?.Bill?.length>0:!hookLoading && data?.Bills?.length>=0}
            >
        </CancelBills>
    )
};
export default CancelBill; 