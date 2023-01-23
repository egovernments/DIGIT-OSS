import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

const AttendanceService = {
    search: (tenantId, searchParams) =>
      Request({
        url: Urls.attendencemgmt.mustorRoll.search,
        useCache: false,
        method: "POST",
        auth: true,
        userService: true,
        params: { tenantId, ...searchParams },
      }),

    update: (data) => 
      Request({
        url: Urls.attendencemgmt.mustorRoll.update,
        useCache: false,
        method: "POST",
        auth: true,
        userService: true,
        data: data
      })
  };

export default AttendanceService