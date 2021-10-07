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
    const details = [
      License?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType.includes("ARCHITECT") ? {
      title: "BPA_LICENSE_DET_CAPTION",
      asSectionHeader: true,
      values: [
        { title: "BPA_LICENSE_TYPE_LABEL", value: `TRADELICENSE_TRADETYPE_${License?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType?.split(".")[0]}` || "NA" },
        { title: "BPA_COUNCIL_OF_ARCH_NO_LABEL", value: License?.tradeLicenseDetail?.additionalDetail?.counsilForArchNo || "NA" }
      ]
    } : {
      title: "BPA_LICENSE_DET_CAPTION",
      asSectionHeader: true,
      values: [
        { title: "BPA_LICENSE_TYPE_LABEL", value: `TRADELICENSE_TRADETYPE_${License?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType?.split(".")[0]}` || "NA"  }
      ]
    }, {
      title: "BPA_LICENSEE_DETAILS_HEADER_OWNER_INFO",
      asSectionHeader: true,
      values: [
        { title: "BPA_APPLICANT_NAME_LABEL", value: License?.tradeLicenseDetail?.owners?.[0]?.name || "NA"  },
        { title: "BPA_APPLICANT_GENDER_LABEL", value: License?.tradeLicenseDetail?.owners?.[0]?.gender || "NA"  },
        { title: "BPA_OWNER_MOBILE_NO_LABEL", value: License?.tradeLicenseDetail?.owners?.[0]?.mobileNumber || "NA"  },
        { title: "BPA_APPLICANT_EMAIL_LABEL", value: License?.tradeLicenseDetail?.owners?.[0]?.emailId || "NA"   },
        { title: "BPA_APPLICANT_PAN_NO", value: License?.tradeLicenseDetail?.owners?.[0]?.pan || "NA" }
      ]
    }, {
      title: "BPA_PERMANANT_ADDRESS_LABEL",
      asSectionHeader: true,
      values: [
        { title: "BPA_PERMANANT_ADDRESS_LABEL", value: License?.tradeLicenseDetail?.owners?.[0]?.permanentAddress || "NA" }
      ]
    }, {
      title: "BPA_APPLICANT_CORRESPONDENCE_ADDRESS_LABEL",
      asSectionHeader: true,
      values: [
        { title: "BPA_APPLICANT_CORRESPONDENCE_ADDRESS_LABEL", value: License?.tradeLicenseDetail?.owners?.[0]?.correspondenceAddress || "NA"  }
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
    const mdmsRes = await MdmsService.getMultipleTypes(tenantId, "BPA", ["RiskTypeComputation", "CheckList"]);
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

    const detailsOfBPA = [
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
    ];

    let details = [];

    const basicDetails = {
      title: "BPA_BASIC_DETAILS_TITLE",
      asSectionHeader: true,
      isInsert: true,
      values: [
        { title: "BPA_BASIC_DETAILS_APP_DATE_LABEL", value: BPA?.applicationDate ? format(new Date(BPA?.applicationDate), 'dd/MM/yyyy') : '' },
        { title: "BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL", value: `WF_BPA_${edcr?.appliactionType}` },
        { title: "BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL", value: edcr?.applicationSubType },
        { title: "BPA_BASIC_DETAILS_OCCUPANCY_LABEL", value: edcr?.planDetail?.planInformation?.occupancy },
        { title: "BPA_BASIC_DETAILS_RISK_TYPE_LABEL", value: "", isInsert: true, },
        { title: "BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL", value: edcr?.planDetail?.planInformation?.applicantName },
      ]
    };

    const plotDetails =  {
      title: "BPA_PLOT_DETAILS_TITLE",
      asSectionHeader: true,
      values: [
        { title: "BPA_BOUNDARY_PLOT_AREA_LABEL", value: edcr?.planDetail?.planInformation?.plotArea || "NA"  },
        { title: "BPA_PLOT_NUMBER_LABEL", value: edcr?.planDetail?.planInformation?.plotNo || "NA"  },
        { title: "BPA_KHATHA_NUMBER_LABEL", value: edcr?.planDetail?.planInformation?.khataNo || "NA"  },
        { title: "BPA_HOLDING_NUMBER_LABEL", value: BPA?.additionalDetails?.holdingNo || "NA"  },
        { title: "BPA_BOUNDARY_LAND_REG_DETAIL_LABEL", value: BPA?.additionalDetails?.registrationDetails || "NA" }
      ]
    };

    const scrutinyDetails = {
      title: "BPA_STEPPER_SCRUTINY_DETAILS_HEADER",
      additionalDetails: {
        values: [
          { title: "BPA_EDCR_DETAILS", value: " " },
          { title: BPA?.businessService !== "BPA_OC" ? "BPA_EDCR_NO_LABEL" : "BPA_OC_EDCR_NO_LABEL", value: BPA?.edcrNumber || "NA" },
        ],
        scruntinyDetails: [
          { title: "BPA_UPLOADED_PLAN_DIAGRAM", value: edcr?.updatedDxfFile, text: "BPA_UPLOADED_PLAN_DXF" },
          { title: "BPA_SCRUNTINY_REPORT_OUTPUT", value: edcr?.planReport, text: "BPA_SCRUTINY_REPORT_PDF" },
        ]
      }
    };

    const buildingExtractionDetails = {
      title: "",
      additionalDetails: {
        values: [
          { title: "BPA_BUILDING_EXTRACT_HEADER", value : " "},
          { title: "BPA_BUILTUP_AREA_HEADER", value: edcr?.planDetail?.blocks?.[0]?.building?.totalBuitUpArea || "NA"},
          { title: "BPA_SCRUTINY_DETAILS_NUMBER_OF_FLOORS_LABEL", value: edcr?.planDetail?.blocks?.[0]?.building?.totalFloors || "NA" },
          { title: "BPA_APPLICATION_HIGH_FROM_GROUND", value: edcr?.planDetail?.blocks?.[0]?.building?.declaredBuildingHeigh || "NA" }
        ],
        scruntinyDetails: []
      }
    };

    const demolitionAreaDetails = {
      title: "",
      additionalDetails: {
        values: [
          { title: "BPA_APP_DETAILS_DEMOLITION_DETAILS_LABEL", value : " "},
          { title: "BPA_APPLICATION_DEMOLITION_AREA_LABEL", value: edcr?.planDetail?.planInformation?.demolitionArea ? `${edcr?.planDetail?.planInformation?.demolitionArea} sq.mtrs` : "" } 
        ],
        scruntinyDetails: []
      }
    };

    const subOccupancyTableDetails = {
      title: "",
      additionalDetails: {
        values: [
          { title: "BPA_OCC_SUBOCC_HEADER", value : " "} 
        ],
        subOccupancyTableDetails: [
          { title: "BPA_APPLICATION_DEMOLITION_AREA_LABEL", value: edcr }
        ]
      }
    }

    const addressDetails = {
      title: "BPA_NEW_TRADE_DETAILS_HEADER_DETAILS",
      asSectionHeader: true,
      values: [
        { title: "BPA_DETAILS_PIN_LABEL", value: BPA?.landInfo?.address?.pincode },
        { title: "BPA_CITY_LABEL", value: BPA?.landInfo?.address?.city },
        { title: "BPA_LOC_MOHALLA_LABEL", value: BPA?.landInfo?.address?.locality?.name },
        { title: "BPA_DETAILS_SRT_NAME_LABEL", value: BPA?.landInfo?.address?.street },
        { title: "ES_NEW_APPLICATION_LOCATION_LANDMARK", value: BPA?.landInfo?.address?.landmark }
      ]
    };


    const checkOwnerLength = BPA?.landInfo?.owners?.length || 1;
    const ownerDetails = {
      title: "BPA_APPLICANT_DETAILS_HEADER",
      additionalDetails: {
        owners: BPA?.landInfo?.owners?.map((owner, index) => {
          return {
            title: (Number(checkOwnerLength) > 1)  ? "COMMON_OWNER" : "",
            values: [
              { title: "CORE_COMMON_NAME", value: owner?.name },
              { title: "BPA_APPLICANT_GENDER_LABEL", value: owner?.gender },
              { title: "CORE_COMMON_MOBILE_NUMBER", value: owner?.mobileNumber },
            ],
          };
        })
      },
    };

    const documentDetails =  {
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
            id: doc?.id
          }))
        }]
      },
    };


    let approvalChecks = [];
    let approvalChecksDetails = {}
    if (BPA?.status === "APPROVAL_INPROGRESS") {
      mdmsRes?.BPA?.CheckList.forEach(checklist => {
        if (checklist?.RiskType === riskType && checklist?.applicationType === edcr?.appliactionType && checklist?.ServiceType === edcr?.applicationSubType && checklist?.WFState === "PENDINGAPPROVAL" && checklist?.conditions?.length > 0) {
          approvalChecks.push(...checklist?.conditions)
        }
      })
      
      approvalChecksDetails = {
        title: "BPA_PERMIT_CONDITIONS",
        asSectionHeader: true,
        additionalDetails: {
          permissions: approvalChecks
        }
      }
    }

    // if(inspectionReport) details.push(inspectionReport);\
    let val;
    var i;
    inspectionReport && inspectionReport.map((ob,index) => {
      if(ob.title.includes("FI_REPORT"))
      details = [...details, {title:ob.title,additionalDetails:{inspectionReport:[],values:ob.values}} ];
      else if(ob.title.includes("CHECK_LIST"))
      details = [...details, {title:ob.title,additionalDetails:{isChecklist:true,inspectionReport:[],values:ob.values}}]
      else
      {
        let improvedDoc = [...inspectionReport[2].additionalDetails.obpsDocuments?.[0]?.values];
        improvedDoc.map((ob) => { ob["isNotDuplicate"] = true; })
        improvedDoc.map((ob,index) => {
        val = ob.documentType;
          if(ob.isNotDuplicate == true)
          for(i=index+1; i<improvedDoc.length;i++)
          {
            if(val === improvedDoc[i].documentType)
            improvedDoc[i].isNotDuplicate=false;
          }
      });
      details = [...details,{title:ob.title,additionalDetails:{FIdocuments:[],values:improvedDoc}} ]
      }
    })

    if(BPA?.businessService !== "BPA_OC") {
      details = [...details, basicDetails, plotDetails, scrutinyDetails, buildingExtractionDetails, subOccupancyTableDetails, demolitionAreaDetails,addressDetails, ownerDetails, documentDetails, ...nocDetails, approvalChecksDetails ]
    } else {
      details = [...details, basicDetails, plotDetails, scrutinyDetails, buildingExtractionDetails, subOccupancyTableDetails, demolitionAreaDetails, documentDetails, ...nocDetails ]
    }
    
    const isEmployee = sessionStorage.getItem("bpaApplicationDetails") === "true" || true ? true : false;

    let bpaFilterDetails = detailsOfBPA?.filter(data => data);
        bpaFilterDetails = details?.filter(data => data);
    

    return {
      applicationData: BPA,
      applicationDetails: bpaFilterDetails,
      tenantId: BPA?.tenantId,
      edcrDetails: edcr
    }
  }
}