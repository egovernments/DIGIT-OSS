import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

const Events = {
    Search: ({tenantId, data, filter= {}, auth = false}) => {
      // const userType = Digit.UserService.getType();
      // if(userType==="employee") auth = true 
      // else auth = false 
      //reverting these changes as it is working fine without sending authToken
      return Request({
            url: Urls.events.search,
            useCache: false,
            data: data,
            method: "POST",
            auth,
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
        url: window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE") ? Urls.events.updateEventCDG : Urls.events.updateEvent ,
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
      const fileStoresIds = event?.eventDetails?.documents?.map(document => document?.fileStoreId);
      const uploadedFilesData = fileStoresIds?.length > 0 ? await Digit.UploadServices.Filefetch(fileStoresIds, tenantId) : null
      return {...event, uploadedFilesData}
    }
}

export default Events