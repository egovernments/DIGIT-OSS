import { ServiceRequest } from "../services/Utils/Request";
import Urls from "../services/urls";

class LocationService {
  getLocalities = ({ tenantId }) => {
    return ServiceRequest({
      serviceName: "getLocalities",
      url: Urls.location.localities,
      params: { tenantId: tenantId.toLowerCase() },
      useCache: true,
    });
  };
}

export const locationService = new LocationService();
