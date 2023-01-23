import { useQuery } from "react-query"

const combineResponse = (data, users) => {
  data.events = data?.events?.map(event => {
    const user = users.find(user => user.uuid === event?.auditDetails?.lastModifiedBy)
    return { ...event, user }
  });
  return data;
}


const useInbox = (tenantId, data, filter = {}, config = {}) => {
  return useQuery(["EVENT_INBOX", tenantId, data, filter], async () => {
    const eventData = await Digit.EventsServices.Search({ tenantId, data, filter });
    const uuids = []
    eventData?.events?.forEach(event => uuids.push(event?.auditDetails?.lastModifiedBy));
    const usersResponse = await Digit.UserService.userSearch(null, { uuid: uuids }, {});
    return combineResponse(eventData, usersResponse?.user);
  }, 
  config);
}

export default useInbox;