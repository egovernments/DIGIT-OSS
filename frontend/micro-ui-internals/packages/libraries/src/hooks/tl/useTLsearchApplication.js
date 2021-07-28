import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";

const useTLSearch = (params, config) => {
  return async () => {
    const data = await Digit.TLService.search(params, config);
    let UpdatedData = [];

    if (data && data?.Licenses && Array.isArray(data.Licenses) && data.Licenses.length > 0) {
    
      return(UpdatedData = await Promise.all(
        data.Licenses?.map(async (service) => {
        const workflowdata = await Digit.WorkflowService.getDetailsById({ tenantId:service.tenantId, id : service.applicationNumber, moduleCode : "TL", role:"CITIZEN" }).then((workflowdata) => workflowdata);
        const res = Object.assign({}, service, {
          SLA: workflowdata?.processInstances[0].businesssServiceSla,
        });
        return res;
      })
      ));
    }
  };
}

export const useTLSearchApplication = (params, config = {}) => {
  
  const client = useQueryClient();
  let multiownername = "";
  const result = useQuery(["TL_APPLICATIONS_LIST", params], useTLSearch( params, config ), { staleTime: Infinity, 
    select: (data) => {
      return data.map(i => ({
        TL_COMMON_TABLE_COL_APP_NO: i.applicationNumber,
        TL_APPLICATION_CATEGORY: "ACTION_TEST_TRADE_LICENSE",
        TL_COMMON_TABLE_COL_OWN_NAME: i?.tradeLicenseDetail?.owners?.map((ele,index) => index == 0 ? multiownername = ele.name : multiownername = multiownername + " , " + ele.name),
        TL_COMMON_TABLE_COL_STATUS: `WF_NEWTL_${i?.status}`,
        TL_COMMON_TABLE_COL_SLA_NAME: `${Math.round(i?.SLA / (1000 * 60 * 60 * 24))} Days`,
        TL_COMMON_TABLE_COL_TRD_NAME: i?.tradeName,
        raw: i
      }))
    }
  });
  return { ...result, revalidate: () => client.invalidateQueries(["TL_APPLICATIONS_LIST", params]) };
};


export const useTLApplicationDetails = (params, config) => {
  const client = useQueryClient();

  const result = useQuery(["TL_APPLICATION_DETAILS", params], useTLSearch( params, config ), { staleTime: Infinity, 
    // select: (data) => {
    //   return data.map(i => ({
    //     TL_COMMON_TABLE_COL_APP_NO: i.applicationNumber,
    //     TL_APPLICATION_CATEGORY: "ACTION_TEST_TRADE_LICENSE",
    //     TL_COMMON_TABLE_COL_OWN_NAME: i?.tradeLicenseDetail?.owners?.map((ele) => ele?.name),
    //     TL_COMMON_TABLE_COL_STATUS: `WF_NEWTL_${i?.status}`,
    //     TL_COMMON_TABLE_COL_SLA_NAME: `${i?.SLA / (1000 * 60 * 60 * 24)} Days`,
    //     TL_COMMON_TABLE_COL_TRD_NAME: i?.tradeName,
    //     TL_COMMON_CITY_NAME: i.tenantId,
    //     raw: i
    //   }))
    // }
  });
  return { ...result, revalidate: () => client.invalidateQueries(["TL_APPLICATION_DETAILS", params]) };
}

export default useTLSearchApplication;
