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
      })
}

export default Events