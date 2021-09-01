import { useQuery } from "react-query"

const useInbox = (tenantId, data, filters = {}, config = {}) => {
  return useQuery(["EVENT_INBOX", data, filters], () => Digit.EventsServices.Search({ tenantId, data, filters }), config);
}

export default useInbox;