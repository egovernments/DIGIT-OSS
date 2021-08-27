import { Request } from "../atoms/Utils/Request"
import Urls from "../atoms/urls";

export const OBPSService = {
  scrutinyDetails: (tenantId, params) =>
    Request({
      url: Urls.obps.scrutinyDetails,
      params: { tenantId, ...params },
      auth: true,
      userService: true,
      method: "POST"
    }),
  create: (details, tenantId) =>
    Request({
      url: Urls.obps.create,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: {},
      auth: true,
    }),
  NOCSearch: (tenantId, sourceRefId) =>
    Request({
      url: Urls.obps.nocSearch,
      params: { tenantId, ...sourceRefId },
      auth: true,
      userService: true,
      method: "POST"
    }),
  update: (details, tenantId) =>
    Request({
      url: Urls.obps.update,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: {},
      auth: true,
    }),
    updateNOC: (details, tenantId) =>
    Request({
      url: Urls.obps.updateNOC,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: {},
      auth: true,
    }),
  BPASearch:(tenantId, params) =>
    Request({
      url: Urls.obps.bpaSearch,
      params: { tenantId, ...params },
      auth: true,
      userService: true,
      method: "POST"
    }),
  BPAREGSearch:(tenantId, details) =>
    Request({
      url: Urls.obps.bpaRegSearch,
      params: {},
      auth: true,
      userService: true,
      method: "POST",
      data: details,
    }),
}