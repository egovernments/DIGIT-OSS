import { useQuery } from "react-query"

const useInbox = (tenantId, data, filter = {}, config = {}) => {
  return useQuery(["EVENT_INBOX", data, filter], () => Digit.EventsServices.Search({ tenantId, data, filter }), config);
}

export default useInbox;