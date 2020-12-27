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
    var data =
      Digit.SessionStorage.get("user_type") === "employee"
        ? {
            service: {
              citizen: {
                name: name,
                type: "CITIZEN",
                mobileNumber: mobileNumber,
                roles: [
                  {
                    id: null,
                    name: "Citizen",
                    code: "CITIZEN",
                    tenantId: "pb",
                  },
                ],
                tenantId: "pb",
              },
              tenantId: cityCode,
              serviceCode: complaintType,
              description: description,
              additionalDetail: {},
              source: "whatsapp",
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
          }
        : {
            service: {
              tenantId: cityCode,
              serviceCode: complaintType,
              description: description,
              additionalDetail: {},
              source: "whatsapp",
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
    const response = await Digit.PGRService.create(data, cityCode);

    return response;
  },

  assign: async (complaintDetails, action, employeeData, comments, uploadedDocument) => {
    console.log("assign complaint srvice acall", action, employeeData, comments, uploadedDocument, complaintDetails);
    complaintDetails.workflow.action = action;
    complaintDetails.workflow.assignes = employeeData ? [employeeData.uuid] : null;
    complaintDetails.workflow.comments = comments;
    uploadedDocument
      ? complaintDetails.workflow.verificationDocuments
        ? complaintDetails.workflow.verificationDocuments.push({
            documentType: "PHOTO",
            fileStore: uploadedDocument,
            documentUid: "",
            additionalDetails: {},
          })
        : (complaintDetails.workflow.verificationDocuments = [
            {
              documentType: "PHOTO",
              fileStore: uploadedDocument,
              documentUid: "",
              additionalDetails: {},
            },
          ])
      : null;

    console.log("assign complaintg whole call", complaintDetails);

    //TODO: get tenant id
    const response = await Digit.PGRService.update(complaintDetails, "pb.amritsar");
    console.log(response);
    return response;
  },
};
