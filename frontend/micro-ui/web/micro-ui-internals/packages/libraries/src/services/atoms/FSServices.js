import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

const FSService = {
    get: (data, tenantId) =>
        Request({
            data: data,
            url: Urls.fs.get,
            useCache: false,
            method: "GET",
            auth: true,
            userService: true,
            params: { tenantId },
        }),
};

export default FSService;
