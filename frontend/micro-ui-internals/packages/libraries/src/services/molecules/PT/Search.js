import { PTService } from "../../elements/PT";
import { getPropertyTypeLocale, getPropertySubtypeLocale } from "../../../utils/pt";

export const PTSearch = {
  all: async (tenantId, filters = {}) => {
    const response = await PTService.search({ tenantId, filters });
    return response;
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
          { title: "PT_PROPERTY_ADDRESS_STREET_NAME", value: response?.address?.street },
          { title: "PT_PROPERTY_ADDRESS_HOUSE_NO", value: response?.address?.doorNo },
        ],
      },
      {
        title: "PT_ASSESMENT_INFO_SUB_HEADER",
        values: [
          { title: "PT_ASSESMENT_INFO_TYPE_OF_BUILDING", value: getPropertyTypeLocale(response?.propertyType) },
          { title: "PT_ASSESMENT_INFO_USAGE_TYPE", value: getPropertySubtypeLocale(response?.usageCategory) },
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
                { title: "PT_OWNERSHIP_INFO_NAME", value: owner?.name },
                { title: "PT_OWNERSHIP_INFO_GENDER", value: owner?.gender },
                { title: "PT_OWNERSHIP_INFO_MOBILE_NO", value: owner?.mobileNumber },
                { title: "PT_OWNERSHIP_INFO_USER_CATEGORY", value: `COMMON_MASTERS_OWNERTYPE_${owner?.ownerType}` || "NA" },
                { title: "PT_SEARCHPROPERTY_TABEL_GUARDIANNAME", value: owner?.fatherOrHusbandName },
                { title: "PT_FORM3_OWNERSHIP_TYPE", value: response?.ownershipCategory },
                { title: "PT_OWNERSHIP_INFO_EMAIL_ID", value: owner?.emailId },
                { title: "PT_OWNERSHIP_INFO_CORR_ADDR", value: owner?.permanentAddress },
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
    // console.log(response, "from hook");

    return {
      tenantId: response.tenantId,
      applicationDetails: PTSearch.transformPropertyToApplicationDetails({ property: response, t }),
      additionalDetails: response?.additionalDetails,
      applicationData: response,
      transformToAppDetailsForEmployee: PTSearch.transformPropertyToApplicationDetails,
    };
  },
};

// const employeeResponse = [
//   {
//     title: "PT_PROPERTY_ADDRESS_SUB_HEADER",
//     asSectionHeader: true,
//     values: [
//       { title: "PT_PROPERTY_ADDRESS_PINCODE", value: response?.address?.pincode },
//       { title: "PT_PROPERTY_ADDRESS_CITY", value: response?.address?.city },
//       {
//         title: "PT_PROPERTY_ADDRESS_MOHALLA",
//         value: `${response?.tenantId?.toUpperCase()?.split(".")?.join("_")}_REVENUE_${response?.address?.locality?.code}`,
//       },
//       { title: "PT_PROPERTY_ADDRESS_STREET_NAME", value: response?.address?.street },
//       { title: "PT_PROPERTY_ADDRESS_HOUSE_NO", value: response?.address?.doorNo },
//     ],
//   },
//   {
//     title: "PT_ASSESMENT_INFO_SUB_HEADER",
//     values: [
//       { title: "PT_ASSESMENT_INFO_TYPE_OF_BUILDING", value: getPropertyTypeLocale(response?.propertyType) },
//       { title: "PT_ASSESMENT_INFO_USAGE_TYPE", value: getPropertySubtypeLocale(response?.usageCategory) },
//       { title: "PT_ASSESMENT_INFO_PLOT_SIZE", value: response?.landArea },
//       { title: "PT_ASSESMENT_INFO_NO_OF_FLOOR", value: response?.noOfFloors },
//     ],
//     additionalDetails: {
//       floors: response?.units
//         ?.sort?.((a, b) => a.floorNo - b.floorNo)
//         ?.map((unit, index) => {
//           let floorName = `PROPERTYTAX_FLOOR_${unit.floorNo}`;
//           const values = [
//             {
//               title: "PT_ASSESSMENT_UNIT_USAGE_TYPE",
//               value: `PROPERTYTAX_BILLING_SLAB_${
//                 unit?.usageCategory != "RESIDENTIAL" ? unit?.usageCategory?.split(".")[1] : unit?.usageCategory
//               }`,
//             },
//             {
//               title: "PT_ASSESMENT_INFO_OCCUPLANCY",
//               value: unit?.occupancyType,
//             },
//             {
//               title: "PT_FORM2_BUILT_AREA",
//               value: unit?.constructionDetail?.builtUpArea,
//             },
//           ];

//           if (unit.occupancyType === "RENTED") values.push({ title: "PT_FORM2_TOTAL_ANNUAL_RENT", value: unit.arv });

//           return {
//             title: floorName,
//             values: [
//               {
//                 title: `${t("ES_APPLICATION_DETAILS_UNIT")} ${index + 1}`,
//                 values,
//               },
//             ],
//           };
//         }),
//     },
//   },
//   {
//     title: "PT_OWNERSHIP_INFO_SUB_HEADER",
//     additionalDetails: {
//       owners: response?.owners?.map((owner, index) => {
//         return {
//           status: owner.status,
//           title: "ES_OWNER",
//           values: [
//             { title: "PT_OWNERSHIP_INFO_NAME", value: owner?.name },
//             { title: "PT_OWNERSHIP_INFO_GENDER", value: owner?.gender },
//             { title: "PT_OWNERSHIP_INFO_MOBILE_NO", value: owner?.mobileNumber },
//             { title: "PT_OWNERSHIP_INFO_USER_CATEGORY", value: `COMMON_MASTERS_OWNERTYPE_${owner?.ownerType}` || "NA" },
//             { title: "PT_SEARCHPROPERTY_TABEL_GUARDIANNAME", value: owner?.fatherOrHusbandName },
//             { title: "PT_FORM3_OWNERSHIP_TYPE", value: response?.ownershipCategory },
//             { title: "PT_OWNERSHIP_INFO_EMAIL_ID", value: owner?.emailId },
//             { title: "PT_OWNERSHIP_INFO_CORR_ADDR", value: owner?.permanentAddress },
//           ],
//         };
//       }),
//       documents: [
//         {
//           title: "PT_COMMON_DOCS",
//           values: response?.documents
//             // ?.filter((e) => e.status === "ACTIVE")
//             ?.map((document) => {
//               return {
//                 title: `PT_${document?.documentType.replace(".", "_")}`,
//                 documentType: document?.documentType,
//                 documentUid: document?.documentUid,
//                 fileStoreId: document?.fileStoreId,
//                 status: document.status,
//               };
//             }),
//         },
//       ],
//     },
//   },
// ];
