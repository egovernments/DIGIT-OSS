import { Request } from "../atoms/Utils/Request"
import Urls from "../atoms/urls";
import { format } from "date-fns";
import { MdmsService } from "./MDMS";

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
  },
  BPADetailsPage: async (tenantId, filters) => {
    const response = await OBPSService.BPASearch(tenantId, filters);
    if (!response?.BPA?.length) {
      return;
    }
    const [BPA] = response?.BPA;
    const edcrResponse = await OBPSService.scrutinyDetails(BPA?.tenantId, { edcrNumber: BPA?.edcrNumber });
    const [edcr] = edcrResponse?.edcrDetail;
    const mdmsRes = await MdmsService.getMultipleTypes(tenantId, "BPA", ["RiskTypeComputation"]);
    const riskType = Digit.Utils.obps.calculateRiskType(mdmsRes?.BPA?.RiskTypeComputation, edcr?.planDetail?.plot?.area, edcr?.planDetail?.blocks);
    BPA.riskType = riskType;
    const nocResponse = await OBPSService.NOCSearch(BPA?.tenantId, { sourceRefId: BPA?.applicationNo });
    const noc = nocResponse?.Noc;

    const nocDetails = noc
      ?.map((nocDetails, index) => ({
        title: index === 0 ? "BPA_NOC_DETAILS_SUMMARY" : "",
        values: [
          {
            title: `BPA_${nocDetails?.nocType}_LABEL`,
            value: nocDetails?.applicationNo,
          },
          {
            title: `BPA_NOC_STATUS`,
            value: nocDetails?.applicationStatus,
          },
          {
            title: "BPA_NOC_SUBMISSION_DATE",
            value: "", //format(new Date(nocDetails?.auditDetaills?.createdTime), 'dd/MM/yyyy')
          },
        ],
        additionalDetails: {
          data: nocDetails,
          noc: [
            {
              title: "BPA_DOCUMENT_DETAILS_LABEL",
              values: nocDetails?.documents?.map((doc) => ({
                title: "",
                documentType: doc?.documentType,
                documentUid: doc?.documentUid,
                fileStoreId: doc?.fileStoreId,
              })),
            },
          ],
        },
      }));
      let inspectionReport = [];
      let checklist = [];
      BPA?.additionalDetails?.fieldinspection_pending?.map((ob,ind) => {
        checklist = [];
        inspectionReport.push({
        title: "BPA_FI_REPORT",
        asSectionHeader: true,
        values: [
          { title: "BPA_FI_DATE_LABEL", value: ob.date },
          { title: "BPA_FI_TIME_LABEL", value: ob.time },
        ]
      });
      ob?.questions?.map((q,index) => {
        checklist.push({title: q.question, value: q.value});
      checklist.push({ title: "BPA_ENTER_REMARKS", value: q.remarks});
    })
      inspectionReport.push(
        {
          title: "BPA_CHECK_LIST_DETAILS",
          asSectionHeader: true,
          values: checklist,
        });
      inspectionReport.push({
        title: "BPA_DOCUMENT_DETAILS_LABEL",
        asSectionHeader: true,
        additionalDetails: {
          obpsDocuments: [{
            title: "",
            values: ob?.docs?.map(doc => ({
              title: doc?.documentType?.replaceAll('.', '_'),
              documentType: doc?.documentType,
              documentUid: doc?.fileStore,
              fileStoreId: doc?.fileStoreId,
            }))
          }]
        }})
      })

    const details = [
      ...inspectionReport,
      {
        title: "BPA_BASIC_DETAILS_TITLE",
        asSectionHeader: true,
        values: [
          { title: "BPA_BASIC_DETAILS_APP_DATE_LABEL", value: BPA?.applicationDate ? format(new Date(BPA?.applicationDate), 'dd/MM/yyyy') : '' },
          { title: "BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL", value: `WF_BPA_${edcr?.appliactionType}` },
          { title: "BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL", value: edcr?.applicationSubType },
          { title: "BPA_BASIC_DETAILS_OCCUPANCY_LABEL", value: edcr?.planDetail?.planInformation?.occupancy },
          { title: "BPA_BASIC_DETAILS_RISK_TYPE_LABEL", value: "" },
          { title: "BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL", value: edcr?.planDetail?.planInformation?.applicantName },
        ]
      },
      {
        title: "BPA_PLOT_DETAILS_TITLE",
        asSectionHeader: true,
        values: [
          { title: "BPA_BOUNDARY_PLOT_AREA_LABEL", value: edcr?.planDetail?.planInformation?.plotArea },
          { title: "BPA_BOUNDARY_PLOT_NO_LABEL", value: edcr?.planDetail?.planInformation?.plotNo },
          { title: "BPA_BOUNDARY_KHATA_NO_LABEL", value: edcr?.planDetail?.planInformation?.khataNo },
          { title: "BPA_BOUNDARY_HOLDING_NO_LABEL", value: "" },
          { title: "BPA_BOUNDARY_LAND_REG_DETAIL_LABEL", value: "" }
        ]
      },
      {
        title: "BPA_STEPPER_SCRUTINY_DETAILS_HEADER",
        asSectionHeader: true,
        values: [
          { title: BPA?.businessService !== "BPA_OC" ? "BPA_EDCR_NO_LABEL" : "BPA_OC_EDCR_NO_LABEL", value: BPA?.edcrNumber },
        ],
        additionalDetails: {
          scruntinyDetails: [
            { title: "BPA_UPLOADED_PLAN_DIAGRAM", value: edcr?.updatedDxfFile },
            { title: "BPA_SCRUNTINY_REPORT_OUTPUT", value: edcr?.planReport },
          ]
        }
      },
      {
        title: "BPA_BUILDING_EXTRACT_HEADER",
        asSectionHeader: true,
        values: [
          { title: "BPA_BUILTUP_AREA_HEADER", value: edcr?.planDetail?.blocks?.[0]?.building?.totalBuitUpArea },
          { title: "BPA_SCRUTINY_DETAILS_NUMBER_OF_FLOORS_LABEL", value: edcr?.planDetail?.blocks?.[0]?.building?.totalFloors },
          { title: "BPA_APPLICATION_HIGH_FROM_GROUND", value: edcr?.planDetail?.blocks?.[0]?.building?.declaredBuildingHeigh }
        ]
      },
      {
        title: "BPA_APP_DETAILS_DEMOLITION_DETAILS_LABEL",
        asSectionHeader: true,
        values: [
          { title: "BPA_APPLICATION_DEMOLITION_AREA_LABEL", value: edcr?.planDetail?.planInformation?.demolitionArea ? `${edcr?.planDetail?.planInformation?.demolitionArea} sq.mtrs` : "" }
        ]
      },
      BPA?.businessService !== "BPA_OC" && {
        title: "BPA_NEW_TRADE_DETAILS_HEADER_DETAILS",
        asSectionHeader: true,
        values: [
          { title: "BPA_DETAILS_PIN_LABEL", value: BPA?.landInfo?.address?.pincode },
          { title: "BPA_CITY_LABEL", value: BPA?.landInfo?.address?.city },
          { title: "BPA_LOC_MOHALLA_LABEL", value: BPA?.landInfo?.address?.locality?.name },
          { title: "BPA_DETAILS_SRT_NAME_LABEL", value: BPA?.landInfo?.address?.street },
          { title: "ES_NEW_APPLICATION_LOCATION_LANDMARK", value: BPA?.landInfo?.address?.landmark }
        ]
      },
      BPA?.businessService !== "BPA_OC" && {
        title: "BPA_APPLICANT_DETAILS_HEADER",
        asSectionHeader: true,
        values: [
          { title: "CORE_COMMON_NAME", value: BPA?.landInfo?.owners?.[0]?.name },
          { title: "BPA_APPLICANT_GENDER_LABEL", value: BPA?.landInfo?.owners?.[0]?.gender },
          { title: "CORE_COMMON_MOBILE_NUMBER`", value: BPA?.landInfo?.owners?.[0]?.mobileNumber },
        ]
      },
      {
        title: "BPA_DOCUMENT_DETAILS_LABEL",
        asSectionHeader: true,
        additionalDetails: {
          obpsDocuments: [{
            title: "",
            values: BPA?.documents?.map(doc => ({
              title: doc?.documentType?.replaceAll('.', '_'),
              documentType: doc?.documentType,
              documentUid: doc?.documentUid,
              fileStoreId: doc?.fileStoreId,
            }))
          }]
        },
      },
      ...nocDetails,
      // {
      //   title: "BPA_NOC_DETAILS_SUMMARY",
      //   asSectionHeader: true,
      //   values: nocDetails
      // },
    ]

    const bpaFilterDetails = details?.filter(data => data);

    return {
      applicationData: BPA,
      applicationDetails: bpaFilterDetails,
      tenantId: BPA?.tenantId,
      edcrDetails: edcr
    }
  }
}