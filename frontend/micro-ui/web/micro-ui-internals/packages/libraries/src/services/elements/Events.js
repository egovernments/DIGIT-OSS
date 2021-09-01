import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

const Events = {
    Search: ({tenantId, data, filters = {}}) => Request({
        url: Urls.events.search,
        useCache: false,
        method: "POST",
        auth: true,
        userService: false,
        data: data,
        params: { tenantId, ...filters },
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