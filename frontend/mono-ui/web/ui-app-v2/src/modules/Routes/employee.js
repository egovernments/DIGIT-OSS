import Login from "modules/employee/User/Login";
import OTP from "modules/employee/User/OTP";
import LanguageSelection from "modules/employee/User/LanguageSelection";
import ChangePassword from "modules/employee/User/ChangePassword";
import ForgotPassword from "modules/employee/User/ForgotPassword";
import Profile from "modules/employee/User/Profile";

// Employee
import RequestReAssign from "modules/employee/pgr/RequestReAssign";
import AllComplaints from "modules/employee/pgr/AllComplaints";
import ComplaintResolved from "modules/employee/pgr/ComplaintResolved";
import ComplaintSummary from "modules/employee/pgr/ComplaintDetails";
import AssignComplaint from "modules/employee/pgr/AssignComplaint";
import EmployeeDirectory from "modules/employee/pgr/EmployeeDirectory";
import ClosedComplaints from "modules/employee/pgr/ClosedComplaints";
import RejectComplaint from "modules/employee/pgr/RejectComplaint";
import ComplaintRejected from "modules/employee/pgr/ComplaintRejected";
import ComplaintAssigned from "modules/employee/pgr/ComplaintAssigned";
import ResolveSuccess from "modules/employee/pgr/ResolveSuccess";
import ReassignSuccess from "modules/employee/pgr/ReassignSuccess";
import MDMS from "modules/common/MDMS";
import Home from "modules/employee/Home";

//Redirection Url
const redirectionUrl = "/employee/user/login";

const routes = [
  {
    path: "user/login",
    component: Login,
    needsAuthentication: false,
    redirectionUrl: "/employee",
  },
  {
    path: "user/otp",
    component: OTP,
    needsAuthentication: false,
    redirectionUrl: "/employee",
  },
  {
    path: "user/language-selection",
    component: LanguageSelection,
    needsAuthentication: false,
    redirectionUrl: "/employee",
  },
  {
    path: "user/forgot-password",
    component: ForgotPassword,
    needsAuthentication: false,
    redirectionUrl: "/employee",
  },
  {
    path: "user/change-password",
    component: ChangePassword,
    needsAuthentication: true,
    options: { hideFooter: true, title: "CORE_COMMON_CHANGE_PASSWORD" },
  },
  {
    path: "user/profile",
    component: Profile,
    needsAuthentication: true,
    options: { hideFooter: true, title: "CS_HOME_HEADER_PROFILE" },
  },
  {
    path: "all-complaints",
    component: AllComplaints,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "ES_ALL_COMPLAINTS_HEADER",
      redirectionUrl,
    },
  },
  {
    path: "complaint-resolved/:serviceRequestId?",
    component: ComplaintResolved,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_COMPLAINT_DETAILS_RESOLUTION_EVIDENCE",
      redirectionUrl,
    },
  },
  {
    path: "complaint-details/:serviceRequestId",
    component: ComplaintSummary,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_HEADER_COMPLAINT_SUMMARY",
      redirectionUrl,
    },
  },
  {
    path: "closed-complaints",
    component: ClosedComplaints,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "ES_CLOSED_COMPLAINTS_HEADER",
      redirectionUrl,
    },
  },
  {
    path: "complaint-reassigned/:serviceRequestId?",
    component: ComplaintAssigned,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "ES_COMPLAINT_REASSIGNED_HEADER",
      redirectionUrl,
    },
  },
  {
    path: "resolve-success",
    component: ResolveSuccess,
    needsAuthentication: true,
    options: {
      hideBackButton: true,
      hideFooter: true,
      title: "CS_COMPLAINT_DETAILS_COMPLAINT_RESOLVED",
      redirectionUrl,
    },
  },
  {
    path: "reassign-success",
    component: ReassignSuccess,
    needsAuthentication: true,
    options: {
      hideBackButton: true,
      hideFooter: true,
      title: "CS_COMMON_RE-ASSIGN REQUESTED",
      redirectionUrl,
    },
  },
  {
    path: "complaint-assigned/:serviceRequestId?",
    component: ComplaintAssigned,
    needsAuthentication: true,
    options: {
      hideBackButton: true,
      hideFooter: true,
      title: "ES_COMPLAINT_ASSIGNED_HEADER",
      redirectionUrl,
    },
  },
  {
    path: "complaint-rejected",
    component: ComplaintRejected,
    needsAuthentication: true,
    options: {
      title: "ES_COMPLAINT_REJECTED_HEADER",
      hideFooter: true,
      redirectionUrl,
    },
  },
  {
    path: "assign-complaint/:serviceRequestId?",
    component: AssignComplaint,
    needsAuthentication: true,
    options: {
      title: "ES_ASSIGN_TO_EMPLOYEE_HEADER",
      hideFooter: true,
      redirectionUrl,
    },
  },
  {
    path: "reassign-complaint/:serviceRequestId?",
    component: AssignComplaint,
    needsAuthentication: true,
    options: {
      title: "ES_REASSIGN_TO_EMPLOYEE_HEADER",
      hideFooter: true,
      redirectionUrl,
    },
  },
  {
    path: "employee-directory",
    component: EmployeeDirectory,
    needsAuthentication: true,
    options: {
      title: "ES_EMPLOYEE_DIRECTORY_HEADER",
      hideFooter: true,
      redirectionUrl,
    },
  },
  {
    path: "reject-complaint/:serviceRequestId?",
    component: RejectComplaint,
    needsAuthentication: true,
    options: {
      title: "ES_REASON_TO_REJECT_HEADER",
      hideFooter: true,
      redirectionUrl,
    },
  },

  {
    path: "request-reassign/:serviceRequestId?",
    component: RequestReAssign,
    needsAuthentication: true,
    options: {
      title: "CS_HEADER_REQUEST_REASSIGN",
      hideFooter: true,
      redirectionUrl,
    },
  },
  {
    path: "mdms/:moduleName/:masterName",
    component: MDMS,
    needsAuthentication: true,
    options: {
      title: "CS_HEADER_MDMS_COMMON",
      hideFooter: true,
      redirectionUrl,
    },
  },
  {
    path: "",
    component: Home,
    needsAuthentication: true,
    options: {
      title: "HOME",
      hideFooter: false,
      redirectionUrl,
      isHomeScreen: true,
    },
  },
];

export default routes;
