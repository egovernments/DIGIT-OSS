import Axios from "axios";
import { CREATE_COMPLAINT } from "./types";

const createComplaint = (complaintParams) => async (dispatch, getState) => {
  // var data = JSON.stringify({
  //   RequestInfo: {
  //     apiId: "Rainmaker",
  //     action: "",
  //     did: 1,
  //     key: "",
  //     msgId: "20170310130900|en_IN",
  //     requesterId: "",
  //     ts: 1513579888683,
  //     ver: ".01",
  //     userInfo: {
  //       id: 23349,
  //       uuid: "530968f3-76b3-4fd1-b09d-9e22eb1f85df",
  //       userName: "9404052047",
  //       name: "Aniket T",
  //       mobileNumber: "9404052047",
  //       emailId: "xc@gmail.com",
  //       locale: null,
  //       type: "CITIZEN",
  //       roles: [
  //         {
  //           name: "Citizen",
  //           code: "CITIZEN",
  //           tenantId: "pb",
  //         },
  //       ],
  //       active: true,
  //       tenantId: "pb",
  //     },
  //     authToken: "37fc8b3a-ef66-4c05-aa87-5182e19b5dec",
  //   },
  //   service: {
  //     tenantId: "pb.amritsar",
  //     serviceCode: "StreetLightNotWorking",
  //     description: "StreetLight is not working",
  //     accountId: "7b2561e8-901b-40a2-98b7-7e627fc5b1d6",
  //     additionalDetail: {},
  //     applicationStatus: null,
  //     source: "whatsapp",
  //     rating: 4,
  //     address: {
  //       doorNo: "2",
  //       plotNo: "10",
  //       landmark: "Near City Hall",
  //       city: "Amritsar",
  //       district: "Amritsar",
  //       region: "Amritsar",
  //       state: "Punjab",
  //       country: "India",
  //       pincode: "111111",
  //       buildingName: "Safalya",
  //       street: "10th main",
  //       locality: {
  //         code: "SUN01",
  //         name: "Ajit Nagar",
  //       },
  //       geoLocation: {
  //         latitude: 21,
  //         longitude: 56,
  //         additionalDetails: {},
  //       },
  //     },
  //   },
  //   workflow: {
  //     action: "APPLY",
  //     assignes: [],
  //     comments: "Stright light is not working",
  //     verificationDocuments: [],
  //   },
  // });

  var config = {
    method: "post",
    url: "/pgr-services/v2/request/_create",
    headers: {
      "Content-Type": "application/json",
    },
    data: complaintParams,
  };

  const res = await Axios(config);
  dispatch({
    type: CREATE_COMPLAINT,
    payload: res.data,
  });
};

export default createComplaint;
