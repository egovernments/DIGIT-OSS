import { PTService } from "../../elements/PT";
import { getPropertyTypeLocale, getPropertySubtypeLocale } from "../../../utils/fsm";

export const PTSearch = {
  all: async (tenantId, filters = {}) => {
    const response = await PTService.search({ tenantId, filters });
    return response;
  },
  application: async (tenantId, filters = {}) => {
    const response = await PTService.search({ tenantId, filters });
    return response.Properties[0];
  },
  applicationDetails: async (t, tenantId, propertyIds, userType) => {
    const filter = { propertyIds };
    const response = await PTSearch.application(tenantId, filter);

    const employeeResponse = [
      {
        title: "ES_APPLICATION_DETAILS_PROPERTY_ADDRESS",
        values: [
          { title: "ES_APPLICATION_DETAILS_LOCATION_PINCODE", value: response?.address?.pincode },
          { title: "ES_APPLICATION_DETAILS_LOCATION_CITY", value: response?.address?.city },
          {
            title: "ES_APPLICATION_DETAILS_LOCATION_LOCALITY",
            value: `${response?.tenantId?.toUpperCase()?.split(".")?.join("_")}_REVENUE_${response?.address?.locality?.code}`,
          },
          { title: "ES_APPLICATION_DETAILS_LOCATION_STREET_NAME", value: response?.address?.street },
          { title: "ES_APPLICATION_DETAILS_LOCATION_BUILDING_NUMBER", value: response?.address?.buildingName },
        ],
      },
      {
        title: "ES_APPLICATION_DETAILS_PROPERTY_ASSESSMENT_DETAILS",
        values: [
          { title: "ES_APPLICATION_DETAILS_PROPERTY_USAGE_TYPE", value: getPropertyTypeLocale(response?.propertyType) },
          { title: "ES_APPLICATION_DETAILS_PROPERTY_TYPE", value: getPropertySubtypeLocale(response?.usageCategory) },
          { title: "ES_APPLICATION_DETAILS_PROPERTY_PLOT_SIZE", value: response?.superBuiltUpArea },
          { title: "ES_APPLICATION_DETAILS_PROPERTY_NO_OF_FLOORS", value: response?.noOfFloors },
        ],
        additionalDetails: {
          floors: response?.units?.map((unit, index) => {
            let floorName = "ES_APPLICATION_DETAILS_GROUND_FLOOR";
            if (unit?.floorNo === 1) floorName = "ES_APPLICATION_DETAILS_FIRST_FLOOR";
            if (unit?.floorNo === 2) floorName = "ES_APPLICATION_DETAILS_SECOND_FLOOR";
            if (unit?.floorNo === 3) floorName = "ES_APPLICATION_DETAILS_THIRD_FLOOR";

            const values = [
              {
                title: "ES_APPLICATION_DETAILS_UNIT_USAGE_TYPE",
                value: unit?.usageCategory,
              },
              {
                title: "ES_APPLICATION_DETAILS_UNIT_OCCUPANCY_TYPE",
                value: unit?.occupancyType,
              },
              {
                title: "ES_APPLICATION_DETAILS_UNIT_BUILD_UP_AREA",
                value: unit?.constructionDetail?.builtUpArea,
              },
            ];

            return {
              title: floorName,
              values: [
                {
                  title: `${t("ES_APPLICATION_DETAILS_UNIT")} ${index}`,
                  values,
                },
              ],
            };
          }),
        },
      },
      {
        title: "ES_APPLICATION_DETAILS_PROPERTY_OWNERSHIP_DETAILS",
        values: [
          { title: "ES_APPLICATION_DETAILS_OWNER_NAME", value: response?.owners[0]?.name },
          { title: "ES_APPLICATION_DETAILS_GENDER", value: response?.owners[0]?.gender },
          { title: "ES_APPLICATION_DETAILS_MOBILE_NUMBER", value: response?.owners[0]?.mobileNumber },
          { title: "ES_APPLICATION_DETAILS_SPECIAL_CATEGORY", value: response?.specialCategory || "NA" },
          { title: "ES_APPLICATION_DETAILS_GUARDIAN_NAME", value: response?.owners[0]?.name },
          { title: "ES_APPLICATION_DETAILS_OWNERSHIP_TYPE", value: response?.ownershipCategory },
          { title: "ES_APPLICATION_DETAILS_EMAIL", value: response?.owners[0]?.emailId },
          { title: "ES_APPLICATION_DETAILS_CORRESPONDENCE_ADDRESS", value: response?.owners[0]?.permanentAddress },
        ],
        additionalDetails: {
          documents: [
            {
              title: "ES_APPLICATION_DETAILS_DOCUMENTS",
              values: response?.documents?.map((document) => ({
                title: "ES_APPLICATION_DETAILS_ADDRESS_PROOF",
                documentType: document?.documentType,
                documentUid: document?.documentUid,
                fileStoreId: document?.fileStoreId,
              })),
            },
          ],
        },
      },
    ];

    return {
      tenantId: response.tenantId,
      applicationDetails: employeeResponse,
      additionalDetails: response?.additionalDetails,
      applicationData: response,
    };
  },
};
