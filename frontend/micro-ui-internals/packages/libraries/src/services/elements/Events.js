import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

const Events = {
    Search: ({tenantId, filter= {}}) => Request({
        url: Urls.events.search,
        useCache: false,
        method: "POST",
        auth: true,
        userService: false,
        params: { tenantId, ...filter },
    }),
    
}

export default Events