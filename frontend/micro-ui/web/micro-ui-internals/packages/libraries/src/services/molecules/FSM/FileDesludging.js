import { FSMService } from "../../elements/FSM";

export const FileDesludging = {
  create: async (tenantId, data) => {
    // const data =
    //   UserService.getType() === "citizen"
    //     ? {
    //         fsm: {
    //           tenantId: tenantId,
    //           description: "my description",
    //           additionalDetails: {},
    //           propertyUsage: "BUILTUP",
    //           address: {
    //             tenantId: tenantId,
    //             landmark: "my landmark",
    //             city: "amritsar",
    //             pincode: "143001",
    //             additionDetails: null,
    //             locality: {
    //               code: "SUN178",
    //               name: "Mohalla Singh kia - Area2",
    //             },
    //             geoLocation: {
    //               latitude: 0,
    //               longitude: 0,
    //               additionalDetails: {},
    //             },
    //           },
    //         },
    //         workflow: null,
    //       }
    //     : {
    //         fsm: {
    //           citizen: {
    //             // mandatory
    //             name: "test",
    //             mobileNumber: "9999999999",
    //           },
    //           tenantId: tenantId, //mandatory
    //           description: "my description",
    //           source: "TELEPHON1E", //mandatory
    //           sanitationtype: "CONVENTIONAL_DUAL_PIT", //mandatory
    //           propertyUsage: "BUILTUP", //mdnaaotry
    //           additionalDetails: {
    //             tripAmount: 100,
    //           },
    //           noOfTrips: 1,
    //           address: {
    //             // mandatory
    //             tenantId: tenantId,
    //             landmark: "my landmark",
    //             city: "amritsar",
    //             pincode: "143001",
    //             additionDetails: null,
    //             locality: {
    //               code: "SUN178",
    //               name: "Mohalla Singh kia - Area2",
    //               label: "Locality",
    //               latitude: null,
    //               longitude: null,
    //               area: "Area2",
    //               pincode: null,
    //               boundaryNum: 1,
    //               children: [],
    //             },
    //             geoLocation: {
    //               latitude: 0,
    //               longitude: 0,
    //               additionalDetails: {},
    //             },
    //           },
    //         },
    //         workflow: null,
    //       };
    const response = await FSMService.create(data, tenantId);
    return response;
  },
};
