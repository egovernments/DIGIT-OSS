import { Request } from "../atoms/Utils/Request";

export const CustomService = {

  getResponse: ({url,params,data,plainAccessRequest}) =>
    Request({
      url: url,
      data: data,
      useCache: true,
      userService: true,
      method: "POST",
      auth: true,
      params: params,
      plainAccessRequest:plainAccessRequest
    }),
};
