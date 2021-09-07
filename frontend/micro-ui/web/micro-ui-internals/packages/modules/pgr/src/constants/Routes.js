export const PGR_BASE = "/digit-ui/pgr/citizen/";

const CREATE_COMPLAINT_PATH = "/create-complaint/";
const REOPEN_COMPLAINT_PATH = "/reopen/";
import { PGR_EMPLOYEE_COMPLAINT_DETAILS, PGR_EMPLOYEE_CREATE_COMPLAINT } from "./Employee";

export const PgrRoutes = {
  ComplaintsPage: "/complaints",
  RatingAndFeedBack: "/rate/:id*",
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

export const Employee = {
  Inbox: "/inbox",
  ComplaintDetails: PGR_EMPLOYEE_COMPLAINT_DETAILS,
  CreateComplaint: PGR_EMPLOYEE_CREATE_COMPLAINT,
  Response: "/response",
  Home: "/digit-ui/employee",
};

export const getRoute = (match, route) => `${match.path}${route}`;
