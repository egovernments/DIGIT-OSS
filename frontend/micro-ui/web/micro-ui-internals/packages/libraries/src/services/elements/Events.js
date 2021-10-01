import { format } from "date-fns";
import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

const Events = {
    Search: ({tenantId, data, filter= {}}) => {
        return Request({
            url: Urls.events.search,
            useCache: false,
            data: data,
            method: "POST",
            auth: true,
            userService: false,
            params: { tenantId, ...filter },
        })
    },
    ClearNotification: ({tenantId}) => Request({
        url: Urls.events.update,
        useCache: false,
        method: "POST",
        auth: true,
        userService: false,
        params: { tenantId },
    }),
    NotificationCount: ({tenantId}) => Request({
        url: Urls.events.count,
        useCache: false,
        method: "POST",
        auth: true,
        userService: false,
        params: { tenantId },
    }),
    Create: (data) =>
      Request({
        url: Urls.events.create,
        useCache: false,
        method: "POST",
        auth: true,
        data: data,
        userService: false,
      }),
    Update: (data) =>
      Request({
        url: Urls.events.updateEvent,
        useCache: false,
        method: "POST",
        auth: true,
        data: data,
        userService: false,
      }),
    EventDetails: async (tenantId, filter) => {
      const eventRes = await Events.Search({ tenantId, filter });
      if (eventRes?.events?.length < 1) return;
      const [event] = eventRes?.events;
      console.log(eventRes, 'eventRes');
      const details = [{
        title: "",
        asSectionHeader: true,
        values: [
          { title: "EVENTS_ULB_LABEL", value: event?.tenantId },
          { title: "EVENTS_NAME_LABEL", value: event?.name },
          { title: "EVENTS_CATEGORY_LABEL", value: event?.eventCategory },
          { title: "EVENTS_DESCRIPTION_LABEL", value: event?.description },
          { title: "EVENTS_FROM_DATE_LABEL", value: Digit.DateUtils.ConvertTimestampToDate(event?.eventDetails?.fromDate) },
          { title: "EVENTS_TO_DATE_LABEL", value: Digit.DateUtils.ConvertTimestampToDate(event?.eventDetails?.toDate) },
          { title: "EVENTS_FROM_TIME_LABEL", value: format(new Date(event?.eventDetails?.fromDate), 'hh:mm'), skip: true },
          { title: "EVENTS_TO_TIME_LABEL", value: format(new Date(event?.eventDetails?.toDate), 'hh:mm'), skip: true },
          { title: "EVENTS_ADDRESS_LABEL", value: event?.eventDetails?.address },
          { title: "EVENTS_MAP_LABEL",
            map: true,
            value: event?.eventDetails?.latitude && event?.eventDetails?.longitude ?
              Digit.Utils.getStaticMapUrl(event?.eventDetails?.latitude, event?.eventDetails?.longitude) :
              'N/A' 
          },
          { title: "EVENTS_ORGANIZER_NAME_LABEL", value: event?.eventDetails?.organizer },
          { title: "EVENTS_ENTRY_FEE_INR_LABEL", value: event?.eventDetails?.fees },
        ]
      }]

      return {
        applicationData: event,
        applicationDetails: details,
        tenantId: tenantId
      }
    }
}

export default Events