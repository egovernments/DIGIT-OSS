export const Complaint = {
  create: async ({
    cityCode,
    complaintType,
    description,
    landmark,
    city,
    district,
    region,
    state,
    pincode,
    localityCode,
    localityName,
    uploadedImages,
    mobileNumber,
    name,
  }) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const defaultData = {
      service: {
        tenantId: cityCode,
        serviceCode: complaintType,
        description: description,
        additionalDetail: {},
        source: Digit.Utils.browser.isWebview() ? "mobile" : "web",
        address: {
          landmark: landmark,
          city: city,
          district: district,
          region: region,
          state: state,
          pincode: pincode,
          locality: {
            code: localityCode,
            name: localityName,
          },
          geoLocation: {},
        },
      },
      workflow: {
        action: "APPLY",
        verificationDocuments: uploadedImages,
      },
    };

    if (Digit.SessionStorage.get("user_type") === "employee") {
      defaultData.service.citizen = {
        name: name,
        type: "CITIZEN",
        mobileNumber: mobileNumber,
        roles: [
          {
            id: null,
            name: "Citizen",
            code: "CITIZEN",
            tenantId: tenantId,
          },
        ],
        tenantId: tenantId,
      };
    }
    const response = await Digit.PGRService.create(defaultData, cityCode);
    return response;
  },

  assign: async (complaintDetails, action, employeeData, comments, uploadedDocument, tenantId) => {
    // console.log("assign complaint service call", action, employeeData, comments, uploadedDocument, complaintDetails);
    complaintDetails.workflow.action = action;
    complaintDetails.workflow.assignes = employeeData ? [employeeData.uuid] : null;
    complaintDetails.workflow.comments = comments;
    uploadedDocument
      ? complaintDetails.workflow.verificationDocuments
        ? complaintDetails.workflow.verificationDocuments.push({
            documentType: "PHOTO",
            fileStoreId: uploadedDocument,
            documentUid: "",
            additionalDetails: {},
          })
        : (complaintDetails.workflow.verificationDocuments = [
            {
              documentType: "PHOTO",
              fileStoreId: uploadedDocument,
              documentUid: "",
              additionalDetails: {},
            },
          ])
      : null;

    // console.log("assign complaintg whole call", complaintDetails);

    //TODO: get tenant id
    const response = await Digit.PGRService.update(complaintDetails, tenantId);
    // console.log("find complaint assign response", response);
    return response;
  },
};
