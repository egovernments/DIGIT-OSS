export const PGR_BASE = "/digit-ui/pgr/citizen/";

const CREATE_COMPLAINT_PATH = "/create-complaint/";
const REOPEN_COMPLAINT_PATH = "/reopen/";

export const PgrRoutes = {
  ComplaintsPage: "/complaints",
  RatingAndFeedBack: "/rate/:id",
  ComplaintDetailsPage: "/complaint/details/:id",
  ReasonPage: `/:id`,
  UploadPhoto: `/upload-photo/:id`,
  AddtionalDetails: `/addional-details/:id`,
  CreateComplaint: "/create-complaint",
  ReopenComplaint: "/reopen",
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
