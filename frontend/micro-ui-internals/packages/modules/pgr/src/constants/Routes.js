const CREATE_COMPLAINT_PATH = "/create-complaint/";
const REOPEN_COMPLAINT_PATH = "/reopen/";

export const PgrRoutes = {
  ComplaintsPage: "/complaints",
  RatingAndFeedBack: "/rate/:id",
  ComplaintDetailsPage: "/complaint/details/:id",
  ReasonPage: `${REOPEN_COMPLAINT_PATH}:id`,
  UploadPhoto: `${REOPEN_COMPLAINT_PATH}upload-photo/:id`,
  AddtionalDetails: `${REOPEN_COMPLAINT_PATH}addional-details/:id`,
  CreateComplaint: "/create-complaint",
  Response: "/response",
  SubType: `${CREATE_COMPLAINT_PATH}subtype`,
  LocationSearch: `${CREATE_COMPLAINT_PATH}location`,
  Pincode: `${CREATE_COMPLAINT_PATH}pincode`,
  Address: `${CREATE_COMPLAINT_PATH}address`,
  Landmark: `${CREATE_COMPLAINT_PATH}landmark`,
  UploadPhotos: `${CREATE_COMPLAINT_PATH}upload-photos`,
  Details: `${CREATE_COMPLAINT_PATH}details`,
  DynamicConfig: `${CREATE_COMPLAINT_PATH}dynamic-config`,
};
