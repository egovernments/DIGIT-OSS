import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const Engagement = {
  search: (filters = {}) =>
    Request({
      url: Urls.engagement.document.search,
      useCache: false,
      method: "POST",
      auth: true,
      userService: false,
      params: { ...filters },
    }),
  create: (details) =>
    Request({
      url: Urls.engagement.document.create,
      data: details,
      useCache: true,
      userService: true,
      method: "POST",
      auth: true,
      locale: true
    }),
  delete: (details) =>
    Request({
      url: Urls.engagement.document.delete,
      data: details,
      useCache: true,
      userService: true,
      method: "POST",
      auth: true,
    }),
  update: (details) =>
    Request({
      url: Urls.engagement.document.update,
      data: details,
      useCache: true,
      userService: true,
      method: "POST",
      auth: true,
    }),
};
