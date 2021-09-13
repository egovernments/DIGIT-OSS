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
  comparisionReport: (tenantId, params) =>
    Request({
      url: Urls.obps.comparisionReport,
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
  BPAREGSearch:(tenantId, details, params) =>
    Request({
      url: Urls.obps.bpaRegSearch,
      params: { ...params },
      auth: true,
      userService: true,
      method: "POST",
      data: details,
    }),
    BPAREGCreate: (details, tenantId) =>
    Request({
      url: Urls.obps.bpaRegCreate,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: window.location.href.includes("openlink")? false : true,
      method: "POST",
      params: {},
      auth: window.location.href.includes("openlink") ? false : true,
    }),
    BPAREGGetBill: (tenantId, filters = {}) =>
    Request({
      url: Urls.obps.bpaRegGetBill,
      useCache: false,
      method: "POST",
      auth: false,
      userService: false,
      params: { tenantId, ...filters },
    })
      .then((d) => {
        return d;
      })
      .catch((err) => {
        if (err?.response?.data?.Errors?.[0]?.code === "EG_BS_BILL_NO_DEMANDS_FOUND") return { Bill: [] };
        else throw err;
      }),
  BPAREGupdate: (details, tenantId) =>
    Request({
      url: Urls.obps.bpaRegUpdate,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService:  window.location.href.includes("openlink") ? false : true,
      method: "POST",
      params: {},
      auth:  window.location.href.includes("openlink") ? false : true,
    }),
  LicenseDetails: async (tenantId, params) => {
    const response = await OBPSService.BPAREGSearch(tenantId, {}, params);
    if (!response?.Licenses?.length) {
      return;
    }

    const [License] = response?.Licenses;
    const details = [{
      title: "BPA_LICENSE_DET_CAPTION",
      asSectionHeader: true,
      values: [
        { title: "BPA_LICENSE_TYPE_LABEL", value: License?.licenseType },
      ]
    }, {
      title: "BPA_LICENSE_DET_CAPTION",
      asSectionHeader: true,
      values: [
        { title: "BPA_APPLICANT_NAME_LABEL", value: License?.tradeLicenseDetail?.owners?.[0]?.name },
        { title: "BPA_APPLICANT_GENDER_LABEL", value: License?.tradeLicenseDetail?.owners?.[0]?.gender },
        { title: "BPA_OWNER_MOBILE_NO_LABEL", value: License?.tradeLicenseDetail?.owners?.[0]?.mobileNumber },
        { title: "BPA_APPLICANT_EMAIL_LABEL", value: License?.tradeLicenseDetail?.owners?.[0]?.emailId  },
        { title: "BPA_APPLICANT_PAN_NO", value: License?.tradeLicenseDetail?.owners?.[0]?.pan || "CS_NA" }
      ]
    }, {
      title: "BPA_LICENSEE_PERMANENT_LABEL",
      asSectionHeader: true,
      values: [
        { title: "BPA_LICENSEE_PERMANENT_LABEL", value: License?.tradeLicenseDetail?.owners?.[0]?.permanentAddress || "CS_NA" }
      ]
    }, {
      title: "BPA_LICENSEE_CORRESPONDENCE_LABEL",
      asSectionHeader: true,
      values: [
        { title: "BPA_LICENSEE_CORRESPONDENCE_LABEL", value: License?.tradeLicenseDetail?.owners?.[0]?.correspondenceAddress }
      ]
    },
  ]
    return {
      applicationData: License,
      applicationDetails: details,
      tenantId: License?.tenantId,
    }
  }
}