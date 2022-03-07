import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import AccessControlService from "../services/elements/Access";
const useAccessControl = (tenantId) => {
  // const fetch = async () => {
  //   await AccessControlService.getAccessControl(tenantId);
  // };
  // const queryData = useQuery(["AccessControl", tenantId], () => fetch());
  // console.log("queryyy", queryData);
  // return queryData;
  // console.log(fetch);


  //use some logic to form this roles array
  const response = useQuery(["ACCESS_CONTROL", tenantId], async () => await AccessControlService.getAccessControl(["EMPLOYEE","NATADMIN"]));
  console.log("resssss", response);
  return response;
};
export default useAccessControl;
