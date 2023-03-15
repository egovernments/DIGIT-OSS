import { getPropertySubtypeLocale, getPropertyTypeLocale } from "../../../utils/pt";
import { PTService } from "../../elements/PT";

export const PTSearch = {
  all: async (tenantId, filters = {}) => {
    const response = await PTService.search({ tenantId, filters });
    return response;
  },
  /**
   * Custom service which can be make a
   * property search using property id and tenant id
   * and return the property generic template to show employee and citizen view
   *
   * @author jagankumar-egov
   *
   * @example
   *  PTSearch.genericPropertyDetails(t,
   *                                  tenantId,
   *                                  propertyId)
   *
   * @returns {Object} Returns the object which contains
   *                   applicationDetails [which is a template of property details ]
   *                   applicationData  {which is a property object itself}
   */
  genericPropertyDetails: async (t, tenantId, propertyIds) => {
    const filters = { propertyIds };
    const property = await PTSearch.application(tenantId, filters);
    const addressDetails = {
      title: "PT_PROPERTY_ADDRESS_SUB_HEADER",
      asSectionHeader: true,
      values: [
        { title: "PT_PROPERTY_ADDRESS_PINCODE", value: property?.address?.pincode },
        { title: "PT_PROPERTY_ADDRESS_CITY", value: property?.address?.city },
        {
          title: "PT_PROPERTY_ADDRESS_MOHALLA",
          value: `${property?.tenantId?.toUpperCase()?.split(".")?.join("_")}_REVENUE_${property?.address?.locality?.code}`,
        },
        {
          title: "PT_PROPERTY_ADDRESS_HOUSE_NO",
          value: property?.address?.doorNo,
          privacy: { uuid: property?.owners?.[0]?.uuid, fieldName: "doorNo", model: "Property",
          showValue: false,
          loadData: {
            serviceName: "/property-services/property/_search",
            requestBody: {},
            requestParam: { tenantId, propertyIds },
            jsonPath: "Properties[0].address.doorNo",
            isArray: false,
          }, },
        },
        {
          title: "PT_PROPERTY_ADDRESS_STREET_NAME",
          value: property?.address?.street,
          privacy: {
            uuid: property?.owners?.[0]?.uuid,
            fieldName: "street",
            model: "Property",
            showValue: false,
            loadData: {
              serviceName: "/property-services/property/_search",
              requestBody: {},
              requestParam: { tenantId, propertyIds },
              jsonPath: "Properties[0].address.street",
              isArray: false,
            },
          },
        },
      ],
    };
    const assessmentDetails = {
      title: "PT_ASSESMENT_INFO_SUB_HEADER",
      values: [
        { title: "PT_ASSESMENT_INFO_TYPE_OF_BUILDING", value: getPropertyTypeLocale(property?.propertyType) },
        { title: "PT_ASSESMENT_INFO_USAGE_TYPE", value: getPropertySubtypeLocale(property?.usageCategory) },
        { title: "PT_ASSESMENT_INFO_PLOT_SIZE", value: property?.landArea },
        { title: "PT_ASSESMENT_INFO_NO_OF_FLOOR", value: property?.noOfFloors },
      ],
    };
    const propertyDetail = {
      title: "PT_DETAILS",
      values: [
        { title: "TL_PROPERTY_ID", value: property?.propertyId || "NA" },
        { title: "PT_OWNER_NAME", value: property?.owners?.map((owner) => owner.name).join(",") || "NA" },
        { title: "PT_SEARCHPROPERTY_TABEL_STATUS", value: Digit.Utils.locale.getTransformedLocale(`WF_PT_${property?.status}`) || "NA" },
      ],
    };
    const ownerdetails = {
      title: "PT_OWNERSHIP_INFO_SUB_HEADER",
      additionalDetails: {
        owners: property?.owners
          ?.filter((owner) => owner.status === "ACTIVE")
          .map((owner, index) => {
            return {
              status: owner.status,
              title: "ES_OWNER",
              values: [
                { title: "PT_OWNERSHIP_INFO_NAME", value: owner?.name, privacy: { uuid: owner?.uuid, fieldName: "name", model: "User",showValue: false,
                loadData: {
                  serviceName: "/property-services/property/_search",
                  requestBody: {},
                  requestParam: { tenantId, propertyIds },
                  jsonPath: "Properties[0].owners[0].name",
                  isArray: false,
                }, } },
                { title: "PT_OWNERSHIP_INFO_GENDER", value: owner?.gender, privacy: { uuid: owner?.uuid, fieldName: "gender", model: "User",showValue: false,
                loadData: {
                  serviceName: "/property-services/property/_search",
                  requestBody: {},
                  requestParam: { tenantId, propertyIds },
                  jsonPath: "Properties[0].owners[0].gender",
                  isArray: false,
                }, }  },
                {
                  title: "PT_OWNERSHIP_INFO_MOBILE_NO",
                  value: owner?.mobileNumber,
                  privacy: { uuid: owner?.uuid, fieldName: "mobileNumber", model: "User",showValue: false,
                  loadData: {
                    serviceName: "/property-services/property/_search",
                    requestBody: {},
                    requestParam: { tenantId, propertyIds },
                    jsonPath: "Properties[0].owners[0].mobileNumber",
                    isArray: false,
                  }, },
                },
                {
                  title: "PT_OWNERSHIP_INFO_USER_CATEGORY",
                  value: `COMMON_MASTERS_OWNERTYPE_${owner?.ownerType}` || "NA",
                  privacy: { uuid: owner?.uuid, fieldName: "ownerType", model: "User",showValue: false,
                  loadData: {
                    serviceName: "/property-services/property/_search",
                    requestBody: {},
                    requestParam: { tenantId, propertyIds },
                    jsonPath: "Properties[0].owners[0].ownerType",
                    //function needed here for localisation
                    isArray: false,
                  }, },
                },
                {
                  title: "PT_SEARCHPROPERTY_TABEL_GUARDIANNAME",
                  value: owner?.fatherOrHusbandName,
                  privacy: { uuid: owner?.uuid, fieldName: "guardian", model: "User",showValue: false,
                  loadData: {
                    serviceName: "/property-services/property/_search",
                    requestBody: {},
                    requestParam: { tenantId, propertyIds },
                    jsonPath: "Properties[0].owners[0].fatherOrHusbandName",
                    isArray: false,
                  }, },
                },
                { title: "PT_FORM3_OWNERSHIP_TYPE", value: property?.ownershipCategory },
                {
                  title: "PT_OWNERSHIP_INFO_EMAIL_ID",
                  value: owner?.emailId,
                  privacy: { uuid: owner?.uuid, fieldName: "emailId", model: "User", hide: !(owner?.emailId && owner?.emailId !== "NA"),showValue: false,
                  loadData: {
                    serviceName: "/property-services/property/_search",
                    requestBody: {},
                    requestParam: { tenantId, propertyIds },
                    jsonPath: "Properties[0].owners[0].emailId",
                    isArray: false,
                  }, },
                },
                {
                  title: "PT_OWNERSHIP_INFO_CORR_ADDR",
                  value: owner?.permanentAddress || owner?.correspondenceAddress,
                  privacy: {
                    uuid: owner?.uuid,
                    fieldName: owner?.permanentAddress ? "permanentAddress" : "correspondenceAddress",
                    model: "User",
                    hide: !(owner?.permanentAddress || owner?.correspondenceAddress),
                    showValue: false,
                loadData: {
                  serviceName: "/property-services/property/_search",
                  requestBody: {},
                  requestParam: { tenantId, propertyIds },
                  jsonPath: owner?.permanentAddress ? "Properties[0].owners[0].permanentAddress" :"Properties[0].owners[0].correspondenceAddress",
                  isArray: false,
                },
                  },
                },
              ],
            };
          }),
      },
    };

    const applicationDetails = [propertyDetail, addressDetails, assessmentDetails, ownerdetails];
    return {
      tenantId: property?.tenantId,
      applicationDetails,
      applicationData: property,
    };
  },
  application: async (tenantId, filters = {}) => {
    const response = await PTService.search({ tenantId, filters });
    return response.Properties[0];
  },
  transformPropertyToApplicationDetails: ({ property: response, t }) => {
    return [
      {
        title: "PT_PROPERTY_ADDRESS_SUB_HEADER",
        asSectionHeader: true,
        values: [
          { title: "PT_PROPERTY_ADDRESS_PINCODE", value: response?.address?.pincode },
          { title: "PT_PROPERTY_ADDRESS_CITY", value: response?.address?.city },
          {
            title: "PT_PROPERTY_ADDRESS_MOHALLA",
            value: `${response?.tenantId?.toUpperCase()?.split(".")?.join("_")}_REVENUE_${response?.address?.locality?.code}`,
          },
          {
            title: "PT_PROPERTY_ADDRESS_STREET_NAME",
            value: response?.address?.street,
            privacy: {
              uuid: response?.owners?.[0]?.uuid,
              fieldName: "street",
              model: "Property",
              showValue: false,
              loadData: {
                serviceName: "/property-services/property/_search",
                requestBody: {},
                requestParam: { tenantId : response?.tenantId, propertyIds:response?.propertyId },
                jsonPath: "Properties[0].address.street",
                isArray: false,
              },
            },
          },
          {
            title: "PT_PROPERTY_ADDRESS_HOUSE_NO",
            value: response?.address?.doorNo,
            privacy: {
              uuid: response?.owners?.[0]?.uuid,
              fieldName: "doorNo",
              model: "Property",
              showValue: false,
              loadData: {
                serviceName: "/property-services/property/_search",
                requestBody: {},
                requestParam: { tenantId : response?.tenantId, propertyIds:response?.propertyId },
                jsonPath: "Properties[0].address.doorNo",
                isArray: false,
              },
            },
          },
        ],
      },
      {
        title: "PT_ASSESMENT_INFO_SUB_HEADER",
        values: [
          { title: "PT_ASSESMENT_INFO_TYPE_OF_BUILDING", value: getPropertyTypeLocale(response?.propertyType) },
          { title: "PT_ASSESMENT_INFO_USAGE_TYPE", value: response?.usageCategory ? getPropertySubtypeLocale(response?.usageCategory) : `N/A` },
          { title: "PT_ASSESMENT_INFO_PLOT_SIZE", value: response?.landArea },
          { title: "PT_ASSESMENT_INFO_NO_OF_FLOOR", value: response?.noOfFloors },
        ],
        additionalDetails: {
          floors: response?.units
            ?.filter((e) => e.active)
            ?.sort?.((a, b) => a.floorNo - b.floorNo)
            ?.map((unit, index) => {
              let floorName = `PROPERTYTAX_FLOOR_${unit.floorNo}`;
              const values = [
                {
                  title: "PT_ASSESSMENT_UNIT_USAGE_TYPE",
                  value: `PROPERTYTAX_BILLING_SLAB_${
                    unit?.usageCategory != "RESIDENTIAL" ? unit?.usageCategory?.split(".")[1] : unit?.usageCategory
                  }`,
                },
                {
                  title: "PT_ASSESMENT_INFO_OCCUPLANCY",
                  value: unit?.occupancyType,
                },
                {
                  title: "PT_FORM2_BUILT_AREA",
                  value: unit?.constructionDetail?.builtUpArea,
                },
              ];

              if (unit.occupancyType === "RENTED") values.push({ title: "PT_FORM2_TOTAL_ANNUAL_RENT", value: unit.arv });

              return {
                title: floorName,
                values: [
                  {
                    title: `${t("ES_APPLICATION_DETAILS_UNIT")} ${index + 1}`,
                    values,
                  },
                ],
              };
            }),
        },
      },
      {
        title: "PT_OWNERSHIP_INFO_SUB_HEADER",
        additionalDetails: {
          owners: response?.owners?.map((owner, index) => {
            return {
              status: owner.status,
              title: "ES_OWNER",
              values: [
                {
                  title: "PT_OWNERSHIP_INFO_NAME",
                  value: owner?.name,
                  /* 
                  Feature :: Privacy
                  
                  Desc :: if field requires a demasking option then privacy object has to set with uuid, fieldName, model
                  */
                  // privacy: { uuid: owner?.uuid, fieldName: "name", model: "User" },
                },
                { title: "PT_OWNERSHIP_INFO_GENDER", value: owner?.gender, privacy: { uuid: owner?.uuid, fieldName: "gender", model: "User",showValue: false,
                  loadData: {
                    serviceName: "/property-services/property/_search",
                    requestBody: {},
                    requestParam: { tenantId:response?.tenantId, propertyIds:response?.propertyId },
                    jsonPath: "Properties[0].owners[0].gender",
                    isArray: false,
                  }, } },
                {
                  title: "PT_OWNERSHIP_INFO_MOBILE_NO",
                  value: owner?.mobileNumber,
                  privacy: { uuid: owner?.uuid, fieldName: "mobileNumber", model: "User",showValue: false,
                  loadData: {
                    serviceName: "/property-services/property/_search",
                    requestBody: {},
                    requestParam: { tenantId:response?.tenantId, propertyIds:response?.propertyId },
                    jsonPath: "Properties[0].owners[0].mobileNumber",
                    isArray: false,
                  }, },
                },
                {
                  title: "PT_OWNERSHIP_INFO_USER_CATEGORY",
                  value: `COMMON_MASTERS_OWNERTYPE_${owner?.ownerType}` || "NA",
                  privacy: { uuid: owner?.uuid, fieldName: "ownerType", model: "User",showValue: false,
                  loadData: {
                    serviceName: "/property-services/property/_search",
                    requestBody: {},
                    requestParam: { tenantId:response?.tenantId, propertyIds:response?.propertyId },
                    //function needed here for localisation
                    jsonPath: "Properties[0].owners[0].ownerType",
                    isArray: false,
                  }, },
                },
                {
                  title: "PT_SEARCHPROPERTY_TABEL_GUARDIANNAME",
                  value: owner?.fatherOrHusbandName,
                  privacy: { uuid: owner?.uuid, fieldName: "guardian", model: "User",showValue: false,
                  loadData: {
                    serviceName: "/property-services/property/_search",
                    requestBody: {},
                    requestParam: { tenantId:response?.tenantId, propertyIds:response?.propertyId },
                    jsonPath: "Properties[0].owners[0].fatherOrHusbandName",
                    isArray: false,
                  }, },
                },
                { title: "PT_FORM3_OWNERSHIP_TYPE", value: response?.ownershipCategory },
                {
                  title: "PT_OWNERSHIP_INFO_EMAIL_ID",
                  value: owner?.emailId,
                  privacy: { uuid: owner?.uuid, fieldName: "emailId", model: "User", hide: !(owner?.emailId && owner?.emailId !== "NA"),showValue: false,
                  loadData: {
                    serviceName: "/property-services/property/_search",
                    requestBody: {},
                    requestParam: { tenantId:response?.tenantId, propertyIds:response?.propertyId },
                    jsonPath: "Properties[0].owners[0].emailId",
                    isArray: false,
                  }, },
                },
                {
                  title: "PT_OWNERSHIP_INFO_CORR_ADDR",
                  value: owner?.correspondenceAddress || owner?.permanentAddress,
                  privacy: {
                    uuid: owner?.uuid,
                    fieldName: owner?.permanentAddress ? "permanentAddress" : "correspondenceAddress",
                    model: "User",
                    hide: !(owner?.permanentAddress || owner?.correspondenceAddress),
                    showValue: false,
                    loadData: {
                      serviceName: "/property-services/property/_search",
                      requestBody: {},
                      requestParam: { tenantId:response?.tenantId, propertyIds:response?.propertyId },
                      jsonPath: owner?.permanentAddress ? "Properties[0].owners[0].permanentAddress" : "Properties[0].owners[0].correspondenceAddress",
                      isArray: false,
                    },
                  },
                },
              ],
            };
          }),
          documents: [
            {
              title: "PT_COMMON_DOCS",
              values: response?.documents
                // ?.filter((e) => e.status === "ACTIVE")
                ?.map((document) => {
                  return {
                    title: `PT_${document?.documentType.replace(".", "_")}`,
                    documentType: document?.documentType,
                    documentUid: document?.documentUid,
                    fileStoreId: document?.fileStoreId,
                    status: document.status,
                  };
                }),
            },
          ],
        },
      },
    ];
  },
  applicationDetails: async (t, tenantId, propertyIds, userType, args) => {
    const filter = { propertyIds, ...args };
    const response = await PTSearch.application(tenantId, filter);

    return {
      tenantId: response.tenantId,
      applicationDetails: PTSearch.transformPropertyToApplicationDetails({ property: response, t }),
      additionalDetails: response?.additionalDetails,
      applicationData: response,
      transformToAppDetailsForEmployee: PTSearch.transformPropertyToApplicationDetails,
    };
  },
};
