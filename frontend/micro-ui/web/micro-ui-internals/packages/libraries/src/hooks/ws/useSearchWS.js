import React, { useState } from "react";
import { useQuery } from "react-query";
import { WSService } from "../../services/elements/WS";
import { PTService } from "../../services/elements/PT";

const getAddress = (address, t) => {
  return `${address?.doorNo ? `${address?.doorNo}, ` : ""} ${address?.street ? `${address?.street}, ` : ""}${
    address?.landmark ? `${address?.landmark}, ` : ""
  }${t(address?.locality?.code)}, ${t(address?.city)},${t(address?.pincode) ? `${address?.pincode}` : " "}`;
};

const getOwnerNames = (propertyData) => {
  const getActiveOwners = propertyData?.owners?.filter(owner => owner?.active);
  const getOwnersList = getActiveOwners?.map(activeOwner => activeOwner?.name)?.join(",");
  return getOwnersList ? getOwnersList : t("NA");
}

const combineResponse = (WaterConnections, SewerageConnections, businessService, Properties, billData, t) => {
  const data = businessService ? (businessService === "WS" ? WaterConnections : SewerageConnections) : WaterConnections?.concat(SewerageConnections);
  if (billData) {
    data.forEach((app) => {
      const bill = billData?.filter((bill) => bill?.consumerCode === app?.connectionNo)[0];
      if (bill) {
        app.due = bill.totalAmount;
        app.dueDate = bill.billDate;
      }
    });
  }

  data?.map((row) => {
    Properties?.map((property) => {
      if (row?.propertyId === property?.propertyId) {
        row["owner"] = property?.owners[0]?.name;
        row["address"] = getAddress(property?.address, t);
        row["ownerNames"] = getOwnerNames(property);
      }
    });
  });
  return data;
};

const useSearchWS = ({ tenantId, filters, config = {}, bussinessService, t }) => {
  let responseSW = "";
  let responseWS = "";
  let propertyids = "";
  let consumercodes = [];
  let billData = "";
  if (bussinessService === "WS") {
    responseWS = useQuery(
      ["WS_WATER_SEARCH", tenantId, ...Object.keys(filters)?.map((e) => filters?.[e]), bussinessService],
      async () => await WSService.WSWatersearch({ tenantId, filters }),
      {
        ...config,
      }
    );
  } else if (bussinessService === "SW") {
    responseSW = useQuery(
      ["WS_SEW_SEARCH", tenantId, ...Object.keys(filters)?.map((e) => filters?.[e]), bussinessService],
      async () => await WSService.WSSewsearch({ tenantId, filters }),
      {
        ...config,
      }
    );
  } else {
    responseWS = useQuery(
      ["WS_WATER_SEARCH", tenantId, ...Object.keys(filters)?.map((e) => filters?.[e]), bussinessService],
      async () => await WSService.WSWatersearch({ tenantId, filters }),
      {
        ...config,
      }
    );

    responseSW = useQuery(
      ["WS_SEW_SEARCH", tenantId, ...Object.keys(filters)?.map((e) => filters?.[e]), bussinessService],
      async () => await WSService.WSSewsearch({ tenantId, filters }),
      {
        ...config,
      }
    );
  }

  responseWS?.data?.WaterConnection?.forEach((item) => {
    propertyids = propertyids + item?.propertyId + ",";
    item?.connectionNo && consumercodes.push(item?.connectionNo);
  });

  responseSW?.data?.SewerageConnections?.forEach((item) => {
    propertyids = propertyids + item?.propertyId + ",";
    item?.connectionNo && consumercodes.push(item?.connectionNo);
  });

  let propertyfilter = { propertyIds: propertyids.substring(0, propertyids.length - 1) };
  billData = useQuery(
    ["BILL_SEARCH", tenantId, consumercodes.join(","), bussinessService],
    async () =>
      await Digit.PaymentService.fetchBill(tenantId, {
        businessService: bussinessService,
        consumerCode: consumercodes.join(","),
      }),
    { ...config, enabled: consumercodes.length > 0 }
  );

  const properties = useQuery(
    ["WSP_SEARCH", tenantId, propertyfilter, bussinessService],
    async () => await PTService.search({ tenantId: tenantId, filters: propertyfilter, auth: true }),
    {
      ...config,
      enabled: !!(propertyids !== ""),
    }
  );

  if (bussinessService === "WS") {
    return responseWS?.isLoading || properties?.isLoading || billData?.isLoading
      ? {isLoading:true}
      : combineResponse(responseWS?.data?.WaterConnection, [], bussinessService, properties?.data?.Properties, billData?.data?.Bill, t);
  } else if (bussinessService === "SW") {
    return responseSW?.isLoading || properties?.isLoading || billData?.isLoading
      ? { isLoading: true }
      : combineResponse([], responseSW?.data?.SewerageConnections, bussinessService, properties?.data?.Properties, billData?.data?.Bill, t);
  } else {
    return responseWS?.isLoading || responseSW?.isLoading || properties?.isLoading || billData?.isLoading
      ? undefined
      : combineResponse(
          responseWS?.data?.WaterConnection,
          responseSW?.data?.SewerageConnections,
          bussinessService,
          properties?.data?.Properties,
          billData?.data?.Bill,
          t
        );
  }
};

export default useSearchWS;
