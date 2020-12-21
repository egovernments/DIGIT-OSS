import Urls from "./urls";
import { ServiceRequest } from "./Utils/Request";

export const LocationService = {
  getLocalities: ({ tenantId }) => {
    return ServiceRequest({
      serviceName: "getLocalities",
      url: Urls.location.localities,
      params: { tenantId: tenantId.toLowerCase() },
      useCache: true,
    });
  },
};
