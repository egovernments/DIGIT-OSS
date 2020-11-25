export const PGR_BASE = "/digit-ui/pgr/citizen/";

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

  CreateComplaintStart: "",
  SubType: `/subtype`,
  LocationSearch: `/location`,
  Pincode: `/pincode`,
  Address: `/address`,
  Landmark: `/landmark`,
  UploadPhotos: `/upload-photos`,
  Details: `/details`,
  CreateComplaintResponse: `/response`,
};

export const getRoute = (match, route) => `${match.path}${route}`;
