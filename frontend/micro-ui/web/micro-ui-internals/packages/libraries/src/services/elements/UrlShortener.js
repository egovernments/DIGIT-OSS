import { Request } from "../atoms/Utils/Request";
import Urls from "../atoms/urls";

const UrlShortener = (fileStoreId) =>
  Request({
    data: { url: fileStoreId },
    url: Urls.Shortener,
    useCache: false,
    method: "POST",
    auth: false,
    userService: false,
    noRequestInfo: true,
  });

export default UrlShortener;
