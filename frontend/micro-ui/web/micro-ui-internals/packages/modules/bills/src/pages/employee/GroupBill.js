import { Header } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
const GroupBill = () => {
    const { t } = useTranslation();
    const GroupBills = Digit.ComponentRegistryService.getComponent("GroupBills");
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [payload, setPayload] = useState("")
    const [payloadForFetchBill, setPayloadForFetchBill] = useState("")
    const [serviceType, setServiceType] = useState("")
    const [locality, setLocality] = useState("")
    const onSubmit = (_data) => {
        setServiceType(_data?.businesService?.businesService)
        setLocality(_data?.locality)
        setPayload(prevState => {            
            const obj =  {
                businesService: _data?.businesService?.businesService,
                url: _data?.businesService?.url,
                billActive: "ACTIVE",
                locality:[_data?.locality],
                consumerCode:_data?.consumerCode
            }
            if(_data?.consumerCode===""){
                delete obj.consumerCode
            }
            return obj
        })
    }

    const { isLoading: hookLoading, data, ...rest } = Digit.Hooks.useBillSearch({
        tenantId,
        filters: { ...payload, tenantId },
        config: {
            cacheTime : 0
          },
    });

    //identify the consumerids for which expiry date is < date rn

    // const bills = data?.Bills
    // let expiredConsumers = []
    // let billObject = {};
    // bills?.map(bill => {
    //     billObject[bill.consumerCode] = bill;
    //     if (bill.billDetails[0].expiryDate < new Date().getTime()) {
    //         expiredConsumers.push(bill.consumerCode);
    //     }
    // })
    // let consumerIds
    // if (expiredConsumers?.length > 0) {
    //     //set the payload for fetchBill here
    //     consumerIds = [...expiredConsumers];
    // }

    // const result = Digit.Hooks.useFetchBillsForBuissnessService(
    //     { businessService: serviceType, ...{ consumerCode: consumerIds?.join(',') }, tenantId }, { enabled: expiredConsumers?.length > 0 && serviceType !== "" }
    // );
    // const billMap = result?.data?.Bill
    // billMap?.map(bill => {
    //     billObject[bill.consumerCode] = bill
    // })
    // const finalBills = Object.values(billObject);

    return (
        <GroupBills
            tenantId={tenantId}
            onSubmit={onSubmit}
            isLoading={hookLoading}
            data={data?.Bills}
            count={data?.Bills?.length}
            resultOk={!hookLoading}
            serviceType={serviceType}
            locality={locality}
        >
        </GroupBills>
    )
};
export default GroupBill; 