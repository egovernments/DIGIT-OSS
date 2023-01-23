import { useQuery } from 'react-query';
import { format } from "date-fns";

const useEventDetails = (tenantId, filters, config = {}) => {
  return useQuery(
    ['EVENT_DETAILS', tenantId, filters],
    () => Digit.EventsServices.EventDetails(tenantId, filters),
    {
      select: (data) => {
        const details = [{
          title:" ",
          asSectionHeader: true,
          values: [
            { title: "EVENTS_ULB_LABEL", value: data?.tenantId },
            { title: "EVENTS_NAME_LABEL", value: data?.name },
            { title: "EVENTS_CATEGORY_LABEL", value: data?.eventCategory },
            { title: "EVENTS_DESCRIPTION_LABEL", value: data?.description },
            { title: "EVENTS_FROM_DATE_LABEL", value: format(new Date(data?.eventDetails?.fromDate), 'dd/MM/yyyy') },
            { title: "EVENTS_TO_DATE_LABEL", value: format(new Date(data?.eventDetails?.toDate), 'dd/MM/yyyy') },
            { title: "EVENTS_FROM_TIME_LABEL", value: format(new Date(data?.eventDetails?.fromDate), 'hh:mm'), skip: true },
            { title: "EVENTS_TO_TIME_LABEL", value: format(new Date(data?.eventDetails?.toDate), 'hh:mm'), skip: true },
            { title: "EVENTS_ADDRESS_LABEL", value: data?.eventDetails?.address },
            { title: "EVENTS_MAP_LABEL",
              map: true,
              value: data?.eventDetails?.latitude && data?.eventDetails?.longitude ?
                Digit.Utils.getStaticMapUrl(data?.eventDetails?.latitude, data?.eventDetails?.longitude) :
                'N/A' 
            },
            { title: "EVENTS_ORGANIZER_NAME_LABEL", value: data?.eventDetails?.organizer },
            { title: "EVENTS_ENTRY_FEE_INR_LABEL", value: data?.eventDetails?.fees },
          ]
        }]
        return {
          applicationData: data,
          applicationDetails: details,
          tenantId: tenantId
        }
      },
      ...config
    }
  )
}

export default useEventDetails;