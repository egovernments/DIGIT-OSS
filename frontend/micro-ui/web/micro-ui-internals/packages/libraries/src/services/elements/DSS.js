import { getCustomFiltersDynamicValues, getFilterOptionsForConfig } from "../../utils/dss";
import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";
import { MdmsService } from "./MDMS";

export const DSSService = {
  getDashboardConfig: (moduleCode) =>
    Request({
      url: Urls.dss.dashboardConfig + `/${moduleCode}`,
      useCache: false,
      userService: false,
      method: "GET",
      authHeader: true,
    }),
  getCharts: (data) =>
    Request({
      url: Urls.dss.getCharts,
      useCache: false,
      userService: false,
      method: "POST",
      auth: true,
      data,
    }),
  getFiltersConfigData: (data) => getFilterOptionsForConfig(data),
  getCustomFiltersDynamicValues: async (data) => {
    let tenantId = Digit.ULBService.getCurrentTenantId() || Digit.ULBService.getStateId();
    let mdmsResp = await MdmsService.call(tenantId, {
      moduleDetails: [
        {
          moduleName: "dss-dashboard",
          masterDetails: [
            {
              name: "CustomFilterValues",
            },
          ],
        },
      ]
    })
    if (!mdmsResp) mdmsResp = {};
    if (!mdmsResp?.tenantId) {
      _.set(mdmsResp, 'tenantId', tenantId)
    }
    return getCustomFiltersDynamicValues(data, mdmsResp);
  }
};
