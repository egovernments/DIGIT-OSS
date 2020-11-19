import { CREATE_COMPLAINT } from "./types";

const createComplaint = ({
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
}) => async (dispatch, getState) => {
  var data = {
    service: {
      tenantId: cityCode,
      serviceCode: complaintType,
      description: description,
      accountId: "7b2561e8-901b-40a2-98b7-7e627fc5b1d6",
      additionalDetail: {},
      applicationStatus: null,
      source: "whatsapp",
      rating: 4,
      address: {
        doorNo: "2",
        plotNo: "10",
        landmark: landmark,
        city: city,
        district: district,
        region: region,
        state: state,
        country: "India",
        pincode: pincode,
        buildingName: "Safalya",
        street: "10th main",
        locality: {
          code: localityCode,
          name: localityName,
        },
        geoLocation: {},
      },
    },
    workflow: {
      action: "APPLY",
      assignes: [],
      comments: "",
      verificationDocuments: uploadedImages,
    },
  };

  const response = await Digit.PGRService.create(data, cityCode);
  dispatch({
    type: CREATE_COMPLAINT,
    payload: response,
  });
};

export default createComplaint;
