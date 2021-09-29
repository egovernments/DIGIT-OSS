import { useQuery } from 'react-query';

const useEventDetails = (tenantId, filters) => {
  return useQuery(['EVENT_DETAILS', tenantId, filters], () => Digit.EventsServices.EventDetails(tenantId, filters))
}

export default useEventDetails;