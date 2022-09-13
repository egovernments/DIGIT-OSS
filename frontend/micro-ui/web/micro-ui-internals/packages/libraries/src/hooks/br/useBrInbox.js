import { useQuery } from "react-query"

const combineResponse = (data, users) => {
  data.br = data?.br?.map(brr => {
    const user = users.find(user => user.uuid === brr?.auditDetails?.lastModifiedBy)
    return { ...brr, user }
  });
  console.log("getdata!!",data);
  return data;
}


const useBrInbox= (tenantId, data, filter = {}, config = {}) => {
  return useQuery(["BR_INBOX", tenantId, data, filter], async () => {
    const brData = await Digit.BRService.search({ tenantId, data, filter });
    const uuids = []
    const usersResponse = await Digit.UserService.userSearch(null, { uuid: uuids }, {});
    brData?.br?.forEach(br => uuids.push(br?.auditDetails?.lastModifiedBy));
    return combineResponse(brData, usersResponse?.user);
  }, 
  config);
}

export default useBrInbox;