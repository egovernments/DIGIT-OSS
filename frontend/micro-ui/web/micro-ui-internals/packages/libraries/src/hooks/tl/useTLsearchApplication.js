import { useQuery, useQueryClient } from "react-query";

const mapWfBybusinessId = (workflowData) => {
  return workflowData?.reduce((acc, item) => {
    acc[item?.businessId] = item;
    return acc;
  }, {});
};

const combineResponse = (applications, workflowData, totalCount) => {
  const workflowInstances = mapWfBybusinessId(workflowData);
  return applications.map((application) => ({
    ...application,
    appAssignee: workflowInstances[application?.applicationNumber]?.assignes?.[0]?.name,
    SLA: workflowInstances[application?.applicationNumber]?.businesssServiceSla,
    appState: workflowInstances[application?.applicationNumber]?.state?.state,
    Count: totalCount,
  }));
};

const useTLSearch = (params, config) => {
  return async () => {
    const data = await Digit.TLService.search(params, config);
    const tenant = data?.Licenses?.[0]?.tenantId;
    const businessIds = data?.Licenses.map((application) => application.applicationNumber);
    const workflowRes = await Digit.WorkflowService.getAllApplication(tenant, { businessIds: businessIds.join() });
    return combineResponse(data?.Licenses, workflowRes?.ProcessInstances, data?.Count);
  };
};

export const useTLSearchApplication = (params, config = {}, t) => {
  const client = useQueryClient();
  let multiownername = "";
  const result = useQuery(["TL_APPLICATIONS_LIST", params], useTLSearch(params, config), {
    staleTime: Infinity,
    select: (data) => {
      return data.map((i) => ({
        TL_COMMON_TABLE_COL_APP_NO: i.applicationNumber,
        TL_APPLICATION_CATEGORY: "ACTION_TEST_TRADE_LICENSE",
        TL_COMMON_TABLE_COL_OWN_NAME: i?.tradeLicenseDetail?.subOwnerShipCategory.includes("INSTITUTION")
          ? i?.tradeLicenseDetail?.institution?.name
          : i?.tradeLicenseDetail?.owners?.map((ele, index) =>
              index == 0 ? (multiownername = ele.name) : (multiownername = multiownername + " , " + ele.name)
            ),
        TL_COMMON_TABLE_COL_STATUS: `WF_NEWTL_${i?.status}`,
        TL_COMMON_TABLE_COL_SLA_NAME: `${Math.round(i?.SLA / (1000 * 60 * 60 * 24))} ${t("TL_SLA_DAYS")}`,
        TL_COMMON_TABLE_COL_TRD_NAME: i?.tradeName,
        TL_INSTITUTION_TYPE_LABEL: i?.tradeLicenseDetail?.subOwnerShipCategory.includes("INSTITUTION")
          ? `TL_${i?.tradeLicenseDetail?.subOwnerShipCategory}`
          : null,
        raw: i,
      }));
    },
  });
  return { ...result, revalidate: () => client.invalidateQueries(["TL_APPLICATIONS_LIST", params]) };
};

export const useTLApplicationDetails = (params, config) => {
  const client = useQueryClient();

  const result = useQuery(["TL_APPLICATION_DETAILS", params], useTLSearch(params, config), {
    staleTime: Infinity,
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
};

export default useTLSearchApplication;
