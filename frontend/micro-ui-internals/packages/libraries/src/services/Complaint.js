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
  }) => {
    var data = {
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
};
